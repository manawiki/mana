ARG NODE_VERSION=16

# Setup the build container.
FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /home/node

# Install dependencies.
COPY package*.json .

RUN yarn install

# Copy the source files.
COPY . .

# Build the application.
RUN yarn build && yarn cache clean

# Setup the runtime container.
FROM node:${NODE_VERSION}-alpine

WORKDIR /home/node

# Copy the built application.
COPY --from=build /home/node /home/node

ENV PORT="8080"

# Run the service.
CMD ["yarn", "run", "start"]