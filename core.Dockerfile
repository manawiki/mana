FROM node:18-bookworm-slim as base

ARG PAYLOAD_PUBLIC_IS_HOME
ENV PAYLOAD_PUBLIC_IS_HOME $PAYLOAD_PUBLIC_IS_HOME

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

EXPOSE 8080

CMD ["yarn", "run", "start:core"]
