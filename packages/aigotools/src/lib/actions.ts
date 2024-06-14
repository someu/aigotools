"use server";
import { currentUser } from "@clerk/nextjs/server";
import { FilterQuery } from "mongoose";
import axios from "axios";

import { createTemplateSite } from "./create-template-site";
import { ProcessStage, ReviewState, SiteState } from "./constants";
import { AppConfig } from "./config";

import dbConnect from "@/lib/db-connect";
import { Site, SiteDocument, SiteModel } from "@/models/site";
import { Review, ReviewDocument, ReviewModel } from "@/models/review";
import { UpvoteModel, UpvoteType } from "@/models/upvote";
import { Category, CategoryDocument, CategoryModel } from "@/models/category";

function siteToObject(site: SiteDocument) {
  const siteObj = site.toObject();

  siteObj._id = siteObj._id.toString();

  delete siteObj.__v;

  return siteObj as Site;
}

function pickCategoryName(site: Site) {
  site.categories = site.categories.map(
    (cate) => (cate as unknown as Category).name
  );

  return site;
}

function reviewToObject(review: ReviewDocument) {
  const reviewObj = review.toObject();

  reviewObj._id = reviewObj._id.toString();

  delete reviewObj.__v;

  return reviewObj as Review;
}

function categoryToObject(category: CategoryDocument) {
  const categoryObj = category.toObject();

  categoryObj._id = categoryObj._id.toString();

  delete categoryObj.__v;

  return categoryObj as Category;
}

async function assertIsManager() {
  const user = await currentUser();
  const isManager = user?.id && AppConfig.manageUsers.includes(user.id);

  if (!isManager) {
    throw new Error("User not manager");
  }

  return user;
}

export async function searchSites(search: string, page: number) {
  try {
    await dbConnect();

    const pageSize = 24;

    const query: FilterQuery<SiteDocument> = {
      $text: { $search: search },
      state: SiteState.published,
    };

    const [sites, count] = await Promise.all([
      SiteModel.find(query, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .populate("categories"),
      SiteModel.countDocuments(query),
    ]);

    return {
      page,
      sites: sites.map(siteToObject).map(pickCategoryName),
      hasNext: count > page * pageSize,
    };
  } catch (error) {
    console.log("Search sites error", error);

    throw error;
  }
}

export interface SearchParams {
  state?: SiteState;
  processStage?: ProcessStage;
  search?: string;
  page: number;
  size: number;
}

function generateSiteFilterQuery(data: SearchParams) {
  const query: FilterQuery<SiteDocument> = {};

  if (data.search) {
    query.$text = { $search: data.search };
  }
  if (data.state) {
    query.state = data.state;
  }
  if (data.processStage) {
    query.processStage = data.processStage;
  }

  return query;
}

export async function managerSearchSites(data: SearchParams) {
  try {
    await assertIsManager();

    await dbConnect();

    const query = generateSiteFilterQuery(data);

    const [sites, count] = await Promise.all([
      SiteModel.find(query)
        .sort({ updatedAt: -1 })
        .skip((data.page - 1) * data.size)
        .limit(data.size),
      SiteModel.countDocuments(query),
    ]);

    return {
      sites: sites.map(siteToObject).map((site) => {
        site.categories = site.categories.map((c) => c.toString());

        return site;
      }),
      count,
      totalPage: Math.ceil(count / data.size),
    };
  } catch (error) {
    console.log("Search sites error", error);

    throw error;
  }
}

export async function getFeaturedSites(size = 12) {
  try {
    await dbConnect();

    const sites = await SiteModel.find({
      featured: true,
      state: SiteState.published,
    })
      .sort({ weight: -1 })
      .limit(size)
      .populate("categories");

    return sites.map(siteToObject).map(pickCategoryName);
  } catch (error) {
    console.log("Get featured sites", error);

    return [];
  }
}

export async function getLatestSites(size = 12) {
  try {
    await dbConnect();

    const sites = await SiteModel.find({
      state: SiteState.published,
    })
      .sort({ createdAt: -1 })
      .limit(size)
      .populate("categories");

    return sites.map(siteToObject).map(pickCategoryName);
  } catch (error) {
    console.log("Get latest sites", error);

    return [];
  }
}

export async function submitReview(name: string, url: string) {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("User not signed");
    }
    await dbConnect();

    await ReviewModel.create({
      name,
      url,
      userId: user.id,
      userEmail: user.primaryEmailAddress?.emailAddress,
    });

    return true;
  } catch (error) {
    console.log("Submit review error", error);
  }

  return false;
}

export async function getSiteMetadata(siteKey: string) {
  try {
    await dbConnect();

    const site = await SiteModel.findOne({
      siteKey,
      state: SiteState.published,
    });

    if (!site) {
      return null;
    }

    return {
      title: site.name,
      description: site.metaDesceription || site.desceription,
      keywords: site.metaKeywords,
    };
  } catch (error) {
    console.log("Get site metadata error", error);
  }

  return null;
}

export async function getSiteDetailByKey(siteKey: string) {
  try {
    await dbConnect();

    const site = await SiteModel.findOne({
      siteKey,
      state: SiteState.published,
    }).populate("categories");

    if (!site) {
      return null;
    }

    const suggests = await SiteModel.find(
      {
        $text: { $search: site.desceription },
        _id: { $ne: site._id },
        state: SiteState.published,
      },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(12)
      .populate("categories");

    return {
      site: pickCategoryName(siteToObject(site)),
      suggests: suggests.map(siteToObject).map(pickCategoryName),
    };
  } catch (error) {
    console.log("Get site detail error", error);
  }

  return null;
}

export async function triggerUpvoteSite(siteId: string) {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("User not signed");
    }
    await dbConnect();

    const site = await SiteModel.findOne({
      _id: siteId,
      state: SiteState.published,
    });

    if (!site) {
      throw new Error("Site is null");
    }

    const upvoted = await UpvoteModel.exists({
      userId: user.id,
      targetId: siteId,
      upvoteType: UpvoteType.site,
    });

    if (upvoted) {
      await UpvoteModel.findByIdAndDelete(upvoted._id);
    } else {
      await UpvoteModel.create({
        userId: user.id,
        targetId: siteId,
        upvoteType: UpvoteType.site,
      });
    }
    site.voteCount = await UpvoteModel.countDocuments({
      targetId: siteId,
      upvoteType: UpvoteType.site,
    });
    await site.save();

    return { upvoted: !upvoted, count: site.voteCount };
  } catch (error) {
    console.log("Upvote site error", error);
    throw error;
  }
}

export async function isUserUpVoteSite(siteId: string) {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("Not signed");
    }
    await dbConnect();

    const existed = await UpvoteModel.exists({
      targetId: siteId,
      userId: user.id,
      upvoteType: UpvoteType.site,
    });

    return !!existed;
  } catch (error) {
    console.log("Is user upvote site error", error);
  }

  return false;
}

export async function saveSite(site: Site) {
  try {
    const user = await assertIsManager();

    await dbConnect();

    const urlObj = new URL(site.url);

    site.url = urlObj.origin;
    site.updatedAt = Date.now();
    site.siteKey = urlObj.hostname.replace(/[^\w]/g, "_");

    let saved: SiteDocument;

    if (site._id) {
      saved = (await SiteModel.findByIdAndUpdate(
        site._id,
        { $set: site },
        { returnDocument: "after" }
      )) as any;
    } else {
      site.userId = user.id;

      saved = await SiteModel.create(site);
    }

    saved.categories = saved.categories.map((c) => c.toString());

    return siteToObject(saved);
  } catch (error) {
    console.log("Save site error", error);
  }

  return null;
}

export async function triggerSitePublish(site: Site) {
  try {
    await assertIsManager();

    await dbConnect();

    if (site.state === SiteState.published) {
      await SiteModel.findByIdAndUpdate(site._id, {
        $set: { state: SiteState.unpublished, updatedAt: Date.now() },
      });
    } else {
      await SiteModel.findByIdAndUpdate(site._id, {
        $set: { state: SiteState.published, updatedAt: Date.now() },
      });
    }

    return true;
  } catch (error) {
    console.log("trigger site publish error", error);
  }

  return false;
}

export async function managerSearchReviews(data: {
  page: number;
  size: number;
  search?: string;
  state?: ReviewState;
}) {
  try {
    await assertIsManager();

    await dbConnect();

    const query: FilterQuery<SiteDocument> = {};

    if (data.search) {
      query.$text = { $search: data.search };
    }
    if (data.state) {
      query.state = data.state;
    }

    const [reviews, count] = await Promise.all([
      ReviewModel.find(query)
        .sort({ updatedAt: -1 })
        .skip((data.page - 1) * data.size)
        .limit(data.size),
      ReviewModel.countDocuments(query),
    ]);

    return {
      reviews: reviews.map(reviewToObject),
      count,
      totalPage: Math.ceil(count / data.size),
    };
  } catch (error) {
    console.log("Search reviews error", error);

    // throw error;
    return {
      reviews: [],
      count: 0,
      totalPage: 0,
    };
  }
}

export async function deleteSite(siteId: string) {
  try {
    await assertIsManager();

    await SiteModel.findByIdAndDelete(siteId);
  } catch (error) {
    console.log("Delete site error", error);
    throw error;
  }
}

export async function updateReviewState(reviewId: string, state: ReviewState) {
  try {
    const user = await assertIsManager();

    await dbConnect();

    const review = await ReviewModel.findById(reviewId);

    if (!review) {
      throw new Error("Review not exist");
    }

    if (state === ReviewState.approved) {
      const site = await saveSite(
        createTemplateSite({
          userId: user.id,
          name: review.name,
          url: review.url,
        })
      );

      if (site) {
        await dispatchSiteCrawl(site._id.toString());
      } else {
        throw new Error("Save site error");
      }
    }

    review.state = state;
    review.updatedAt = Date.now();
    await review.save();
  } catch (error) {
    console.log("Update review state error", error);
    throw error;
  }
}

export async function dispatchSiteCrawl(siteId: string) {
  try {
    await assertIsManager();

    await axios.post(
      `${AppConfig.crawlerGateway}/dispatch`,
      { siteIds: [siteId] },
      {
        headers: {
          Authorization: `Basic ${AppConfig.crawlerAuthToken}`,
        },
      }
    );
  } catch (error) {
    console.log("Dispatch site crawl error", error);
    throw error;
  }
}

export async function stopSiteCrawl(siteId: string) {
  try {
    await assertIsManager();

    await axios.post(
      `${AppConfig.crawlerGateway}/stop?site=${siteId}`,
      { siteIds: [siteId] },
      {
        headers: {
          Authorization: `Basic ${AppConfig.crawlerAuthToken}`,
        },
      }
    );
  } catch (error) {
    console.log("Stop site crawl error", error);
    throw error;
  }
}

export async function dispatchAllSitesCrawl(
  data: Omit<SearchParams, "page" | "size">
) {
  try {
    await assertIsManager();

    await axios.post(
      `${AppConfig.crawlerGateway}/dispatch`,
      { query: data },
      {
        headers: {
          Authorization: `Basic ${AppConfig.crawlerAuthToken}`,
        },
      }
    );
  } catch (error) {
    console.log("Dispatch site crawl error", error);
    throw error;
  }
}

export async function stopAllSitesCrawl(
  data: Omit<SearchParams, "page" | "size">
) {
  try {
    await assertIsManager();

    await axios.post(
      `${AppConfig.crawlerGateway}/stop`,
      { query: data },
      {
        headers: {
          Authorization: `Basic ${AppConfig.crawlerAuthToken}`,
        },
      }
    );
  } catch (error) {
    console.log("Dispatch site crawl error", error);
    throw error;
  }
}

/** Category */
export async function saveCategory(category: Category) {
  try {
    await assertIsManager();
    await dbConnect();

    if (category._id) {
      category.updatedAt = Date.now();
      await CategoryModel.findByIdAndUpdate(category._id, { $set: category });
    } else {
      await CategoryModel.create(category);
    }
  } catch (error) {
    console.log("Dispatch site crawl error", error);
    throw error;
  }
}

export async function deleteCategory(id: string) {
  try {
    await assertIsManager();
    await dbConnect();

    await CategoryModel.findByIdAndDelete(id);
    await SiteModel.updateMany(
      {
        categories: id,
      },
      {
        $pull: { categories: id },
      }
    );
  } catch (error) {
    console.log("Dispatch site crawl error", error);
    throw error;
  }
}

export async function managerSearchCategories(data: {
  page: number;
  size: number;
  search?: string;
}) {
  try {
    await assertIsManager();

    await dbConnect();

    const query: FilterQuery<SiteDocument> = {};

    if (data.search) {
      query.name = { $regex: data.search, $options: "i" };
    }
    const [categories, count] = await Promise.all([
      CategoryModel.find(query)
        .sort({ updatedAt: -1 })
        .skip((data.page - 1) * data.size)
        .limit(data.size),
      CategoryModel.countDocuments(query),
    ]);

    return {
      categories: categories.map(categoryToObject),
      count,
      totalPage: Math.ceil(count / data.size),
    };
  } catch (error) {
    console.log("Search categories error", error);

    throw error;
  }
}

export async function getAllCategories() {
  await dbConnect();
  const categories = await CategoryModel.find({});

  return categories.map(categoryToObject);
}
