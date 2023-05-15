FROM node:16-alpine as base

ARG STATIC_URL
ENV STATIC_URL $STATIC_URL

ARG REDIS_URI
ENV REDIS_URI $REDIS_URI

FROM base as builder

WORKDIR /home/node
COPY package*.json ./

COPY . .
RUN yarn install
RUN yarn build

FROM base as runtime

ENV NODE_ENV=production

WORKDIR /home/node
COPY package*.json  ./

RUN yarn install --production
COPY --from=builder /home/node/public ./public
COPY --from=builder /home/node/dist ./dist
COPY --from=builder /home/node/build ./build

EXPOSE 4040

CMD ["yarn", "run", "start:core"]
