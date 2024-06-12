import { Site } from "@/models/site";

import { SiteState } from "./constants";

export const createTemplateSite = (site: Partial<Site> = {}) => {
  return {
    userId: "",
    url: "",
    siteKey: "",
    featured: false,
    name: "",
    snapshot: "",
    desceription: "",
    pricingType: "",
    categories: [],
    images: [],
    features: [],
    usecases: [],
    users: [],
    relatedSearchs: [],
    pricings: [],
    links: {},
    voteCount: 0,
    metaKeywords: [],
    metaDesceription: "",
    searchSuggestWords: [],
    state: SiteState.unpublished,
    ...site,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  } as Site;
};
