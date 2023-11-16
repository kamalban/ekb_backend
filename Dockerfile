FROM node:14-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
COPY ./package*.json ./
RUN npm ci
COPY ./dist ./dist
CMD ["node", "./dist/app.js"]