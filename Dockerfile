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

RUN corepack enable
WORKDIR /app
COPY package.json yarn.lock ./
COPY ./patches ./patches

# Throw-away build stage to reduce size of final image
FROM base as build

WORKDIR /app
RUN yarn install --frozen-lockfile --production=false
RUN yarn run build

# Get production dependencies
FROM base as production

RUN yarn install --frozen-lockfile --production=true

# Install supervisor
RUN apk add supervisor

# Final stage for app image
FROM base

WORKDIR /app
COPY --from=production /node_modules /node_modules
COPY --from=build /app /app
COPY /public /public

# Start the server using supervisor
COPY supervisord.conf /app/supervisord.conf
EXPOSE 3000
CMD ["supervisord", "-c", "/app/supervisord.conf"]


