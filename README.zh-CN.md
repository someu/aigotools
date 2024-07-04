<div align="center">
  <a href="https://github.com/someu/aigotools.git">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>
  <h2 align="center">AigoTools</h2>
  <a href="README.md">
    English
  </a>
  |
  <a href="README.ja-JP.md">
    日本語
  </a>
  <br>
  <br>
</div>


AigoTools 可以帮助用户快速创建和管理导航站点，内置站点管理和自动收录功能，同时提供国际化、SEO、多种图片存储方案。让用户可以快速部署上线自己的导航站。

点击访问：<a href="https://www.aigotools.com/cn">www.aigotools.com</a>

https://github.com/someu/aigotools/assets/33251742/00d39041-a216-4105-884b-bd19cde6c706


## 目录

- [目录](#目录)
- [功能](#功能)
- [部署](#部署)
  - [前置准备](#前置准备)
  - [本地部署](#本地部署)
  - [托管服务部署](#托管服务部署)
- [开发](#开发)
- [Figma资源](#figma资源)
- [维护者](#维护者)
- [如何贡献](#如何贡献)
- [联系我们](#联系我们)
- [🌟 Star History](#-star-history)
- [使用许可](#使用许可)


## 功能

- **站点管理**
- **站点信息自动采集（playwright、jina、openai）**
- **用户管理（clerk）**
- **国际化**
- **暗色/亮色主题切换**
- **SEO 优化**
- **多种图片存储方案（本地minio、aws s3、腾讯云cos）**



## 部署

本项目包含导航站主体（`packages/aigotools`）和收录服务（`packages/crawler`）两个部分，可以通过zeabur等托管服务部署，也可以在使用`docker-compose`直接在本地部署。

### 前置准备

- 前往 https://clerk.com/ 创建 application，并添加一个用户作为登录管理后台的管理员。
- 申请好`OpenAI apiKey`和`jina apiKey`，它们会在收录网站时使用
- 部署好mongodb、redis数据库

### 本地部署

1. 克隆仓库

   ```bash
   git clone https://github.com/someu/aigotools.git
   cd aigotools
   ```

2. 配置环境变量
   拷贝`packages/aigotools`和`packages/crawler`下的`.env`为`.env.prod`。

   ```bash
   cp packages/aigotools/.env packages/aigotools/.env.prod
   cp packages/crawler/.env packages/crawler/.env.prod
   ```

   修改两个配置文件。

3. 启动项目

   ```bash
   docker-compose up -d
   ```

**注意：如果采用minio存储图片，第一次启动项目时，minio的鉴权配置可以先不填。运行项目，进入minio管理后台创建Bucket、ACCESS_KEY和SECERT_KEY，开启Bucket的公开读权限，并将更新到配置文件中再重新启动项目。**

### 托管服务部署

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates/9PSGFO?referralCode=someu)

参考文档：[zeabur-deploy.md](./docs/zeabur-deploy.md)

Zeabur demo链接：https://aigotools.zeabur.app/


## 开发

1. 克隆仓库

   ```bash
   git clone https://github.com/someu/aigotools.git
   cd aigotools
   ```

2. 安装依赖

   ```bash
   pnpm i
   ```

3. 配置环境变量
   拷贝`packages/aigotools`和`packages/crawler`下的`.env`为`.env.local`，修改配置文件中内容。

   ```bash
   cp packages/aigotools/.env packages/aigotools/.env.local
   cp packages/crawler/.env packages/crawler/.env.local
   ```

4. 启动项目

   分别进入`packages/aigotools`和`packages/crawler`。

   ```
   pnpm run dev
   ```

## Figma资源

我们同时开源了本项目的设计稿，欢迎使用本项目的UI和代码开发你自己的网站。

https://www.figma.com/community/file/1385200592630492334/aigotools

![AigoTools Figma](./images/figma-preview.jpg)



## 维护者

[@someu](https://github.com/someu)。

## 如何贡献

非常欢迎你的加入！[提一个 Issue](https://github.com/someu/aigotools/issues/new) 或者提交一个 Pull Request。

## 联系我们

如有任何问题或建议，请通过以下方式联系我们：

- GitHub Issues: [提交问题](https://github.com/someu/aigotools/issues)
- 电子邮件: someuxyz@gmail.com

## 🌟 Star History

[![Star History](https://api.star-history.com/svg?repos=someu/aigotools&type=Timeline)](https://star-history.com/#someu/aigotools&Timeline)

## 使用许可

AigoTools 使用 Apache License 2.0 许可证。详细信息请参见 [LICENSE](./LICENSE) 文件。
