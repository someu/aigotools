export const AppConfig = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL as string,
  siteName: process.env.NEXT_PUBLIC_APP_NAME as string,
  imageBase: process.env.NEXT_PUBLIC_IMAGE_BASE as string,
  debugClerk: process.env.CLERK_DEBUG === "true",
  manageUsers: (process.env.NEXT_PUBLIC_MANAGER_USER?.split(",") || []).filter(
    Boolean,
  ),
  mongoUri: process.env.MONGODB_URI as string,
  awsRegion: process.env.AWS_REGION as string,
  awsBucket: process.env.AWS_BUCKET as string,
  awsAccessKey: process.env.AWS_ACCESS_KEY_ID as string,
  awsSecert: process.env.AWS_ACCESS_SECERT as string,
  appGenerator: process.env.NEXT_PUBLIC_APP_GENERATOR as string,
  appGeneratorUrl: process.env.NEXT_PUBLIC_APP_GENERATOR_URL as string,
  crawlerGateway: process.env.CRAWLER_GATEWAY as string,
  crawlerAuthUser: process.env.CRAWLER_AUTH_USER as string,
  crawlerAuthPassword: process.env.CRAWLER_AUTH_PASSWORD as string,

  get crawlerAuthToken() {
    return Buffer.from(
      `${this.crawlerAuthUser}:${this.crawlerAuthPassword}`,
      "utf8",
    ).toString("base64");
  },
};
