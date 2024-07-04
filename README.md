<div align="center">
  <a href="https://github.com/someu/aigotools.git">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>
  <h2 align="center">AigoTools</h2>
  <a href="README.zh-CN.md">
    简体中文
  </a>
  |
  <a href="README.ja-JP.md">
    日本語
  </a>
  <br>
  <br>
</div>

AigoTools helps users quickly create and manage website directory with built-in site management and automatic inclusion features. It also offers internationalization, SEO, and multiple image storage solutions, enabling users to quickly deploy and launch their own navigation site.

Visit here: <a href="https://www.aigotools.com/cn">www.aigotools.com</a>

https://github.com/someu/aigotools/assets/33251742/00d39041-a216-4105-884b-bd19cde6c706


## Table of Contents

- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Deployment](#deployment)
  - [Prerequisites](#prerequisites)
  - [Local Deployment](#local-deployment)
  - [Hosting Service Deployment](#hosting-service-deployment)
- [Development](#development)
- [Figma Resource](#figma-resource)
- [Maintainers](#maintainers)
- [How to Contribute](#how-to-contribute)
- [Contact Us](#contact-us)
- [🌟 Star History](#-star-history)
- [License](#license)

## Features

- **Site Management**
- **Automatic Site Information Collection (playwright, jina, openai)**
- **User Management (clerk)**
- **Internationalization**
- **Dark/Light Theme Toggle**
- **SEO Optimization**
- **Multiple Image Storage Solutions (local minio, AWS S3, Tencent Cloud COS)**

## Deployment

This project consists of the main navigation site (`packages/aigotools`) and the inclusion service (`packages/crawler`). It can be deployed via hosting services like Zeabur or directly on a local machine using `docker-compose`.

### Prerequisites

- Create an application at https://clerk.com/ and add a user to log in as the admin for the management backend.
- Obtain `OpenAI apiKey` and `jina apiKey`, which are used for site inclusion.
- Set up MongoDB and Redis databases.

### Local Deployment

1. Clone the repository:

   ```bash
   git clone https://github.com/someu/aigotools.git
   cd aigotools
   ```

2. Configure environment variables:
   Copy the `.env` files in `packages/aigotools` and `packages/crawler` to `.env.prod`.

   ```bash
   cp packages/aigotools/.env packages/aigotools/.env.prod
   cp packages/crawler/.env packages/crawler/.env.prod
   ```

   Modify the configuration files accordingly.

3. Start the project:

   ```bash
   docker-compose up -d
   ```

**Note: If using minio for image storage, you can initially leave the minio authentication configuration empty when starting the project. After running the project, access the minio management backend to create a Bucket, ACCESS_KEY, and SECRET_KEY, enable public read permissions for the Bucket, update the configuration file, and restart the project.**

### Hosting Service Deployment

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates/9PSGFO?referralCode=someu)

Refer to the documentation: [zeabur-deploy.md](./docs/zeabur-deploy.md)

Zeabur demo link: https://aigotools.zeabur.app/

## Development

1. Clone the repository:

   ```bash
   git clone https://github.com/someu/aigotools.git
   cd aigotools
   ```

2. Install dependencies:

   ```bash
   pnpm i
   ```

3. Configure environment variables:
   Copy the `.env` files in `packages/aigotools` and `packages/crawler` to `.env.local` and modify the configuration files.

   ```bash
   cp packages/aigotools/.env packages/aigotools/.env.local
   cp packages/crawler/.env packages/crawler/.env.local
   ```

4. Start the project:
   Navigate to `packages/aigotools` and `packages/crawler` respectively.

   ```bash
   pnpm run dev
   ```

## Figma Resource

We have also open-sourced the design drafts for this project. Feel free to use the UI and code from this project to develop your own website.

https://www.figma.com/community/file/1385200592630492334/aigotools

![AigoTools Figma](./images/figma-preview.jpg)


## Maintainers

[@someu](https://github.com/someu).

## How to Contribute

We warmly welcome your contributions! [Submit an Issue](https://github.com/someu/aigotools/issues/new) or submit a Pull Request.

## Contact Us

For any questions or suggestions, please contact us via:

- GitHub Issues: [Submit Issues](https://github.com/someu/aigotools/issues)
- Email: someuxyz@gmail.com

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=someu/aigotools&type=Timeline)](https://star-history.com/#someu/aigotools&Timeline)


## License

AigoTools is licensed under the Apache License 2.0. For more details, see the [LICENSE](./LICENSE) file.
