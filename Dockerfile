# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.6.0
FROM node:${NODE_VERSION}-alpine as base

LABEL fly_launch_runtime="Mana"

# Set production environment
ARG IS_HOME
ENV IS_HOME $IS_HOME

ENV NODE_ENV="production"
ENV PORT="3000"

# Throw-away build stage to reduce size of final image
FROM base as build

RUN corepack enable
WORKDIR /app
COPY package.json yarn.lock ./
COPY ./patches ./patches

RUN yarn install --frozen-lockfile --production=false

COPY . .
RUN yarn run build

# Get production dependencies
FROM base as production

RUN corepack enable
WORKDIR /app
COPY package.json yarn.lock ./
COPY ./patches ./patches

RUN apk add supervisor
RUN yarn install --frozen-lockfile --production=true

# Final stage for app image
FROM base

WORKDIR /app
COPY --from=build /app/build /app/build
COPY --from=production /app/node_modules /app/node_modules
COPY /public /public

# Start the server using supervisor
COPY supervisord.conf /app/supervisord.conf
COPY package.json package.json
EXPOSE 3000
CMD ["supervisord", "-c", "/app/supervisord.conf"]


