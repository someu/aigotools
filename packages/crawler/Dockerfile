FROM mcr.microsoft.com/playwright:v1.41.1-jammy as baserepo
ENV NODE_ENV='production'
WORKDIR /app

FROM baserepo as builder
COPY . .
RUN npm install -g pnpm @nestjs/cli \
  && pnpm install \
  && pnpm run build

FROM baserepo
RUN chown -R pwuser:pwuser /app
USER pwuser
COPY --from=builder --chown=pwuser:pwuser /app/package.json /app/package-lock.json /app/
RUN pnpm install --production && pnpm exec playwright install chromium
COPY --from=builder --chown=pwuser:pwuser /app/dist /app/dist
EXPOSE 13000
CMD pnpm run start:prod