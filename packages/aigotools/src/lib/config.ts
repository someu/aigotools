export const AppConfig = {
  // app
  appGenerator: process.env.NEXT_PUBLIC_APP_GENERATOR as string,
  appGeneratorUrl: process.env.NEXT_PUBLIC_APP_GENERATOR_URL as string,
  siteUrl: process.env.NEXT_PUBLIC_APP_URL as string,
  siteName: process.env.NEXT_PUBLIC_APP_NAME as string,

  // clerk
  debugClerk: process.env.CLERK_DEBUG === "true",
  manageUsers: (process.env.NEXT_PUBLIC_MANAGER_USER?.split(",") || []).filter(
    Boolean
  ),

  // mongo
  mongoUri: process.env.MONGODB_URI as string,
  // image storage
  imageStorage: process.env.NEXT_PUBLIC_IMAGE_STORAGE as
    | "minio"
    | "aws"
    | "tencent",

  // minio
  minioBase: process.env.MINIO_BASE as string,
  minioBucket: process.env.MINIO_BUCKET as string,
  minioEndPoint: process.env.MINIO_ENDPOINT as string,
  minioPort: parseInt(process.env.MINIO_PORT as string, 10),
  minioUseSSL: (process.env.MINIO_SSL as string) === "true",
  minioAccessKey: process.env.MINIO_ACCESS_KEY as string,
  minioSecretKey: process.env.MINIO_SECERT_KEY as string,
  // aws s3
  awsBase: process.env.AWS_BASE as string,
  awsRegion: process.env.AWS_REGION as string,
  awsBucket: process.env.AWS_BUCKET as string,
  awsAccessKey: process.env.AWS_ACCESS_KEY_ID as string,
  awsSecert: process.env.AWS_ACCESS_SECERT as string,
  // tencent cos
  cosBase: process.env.COS_BASE as string,
  cosRegion: process.env.COS_REGION as string,
  cosBucket: process.env.COS_BUCKET as string,
  cosSecertId: process.env.COS_SECERT_ID as string,
  cosSecertKey: process.env.COS_SECERT_KEY as string,

  // crawer
  crawlerGateway: process.env.CRAWLER_GATEWAY as string,
  crawlerAuthUser: process.env.CRAWLER_AUTH_USER as string,
  crawlerAuthPassword: process.env.CRAWLER_AUTH_PASSWORD as string,

  get crawlerAuthToken() {
    return Buffer.from(
      `${this.crawlerAuthUser}:${this.crawlerAuthPassword}`,
      "utf8"
    ).toString("base64");
  },
};
