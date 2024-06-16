FROM mcr.microsoft.com/playwright:v1.41.1-jammy as baserepo
WORKDIR /app
RUN npm install -g pnpm @nestjs/cli

FROM baserepo as builder
COPY . .
RUN pnpm install \
  && pnpm run build

FROM baserepo
ENV NODE_ENV='production'
RUN chown -R pwuser:pwuser /app
USER pwuser
COPY --from=builder --chown=pwuser:pwuser /app/package.json /app/pnpm-lock.yaml /app/
RUN pnpm install --production && pnpm exec playwright install chromium
COPY --from=builder --chown=pwuser:pwuser /app/dist /app/dist
EXPOSE 13000
CMD pnpm run start:prod