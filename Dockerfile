# syntax = docker/dockerfile:1

# Base image with the desired Node.js version
ARG NODE_VERSION=18.16.1
FROM node:${NODE_VERSION}-slim as base

# Set the working directory for the app
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y build-essential pkg-config python-is-python3 && \
    rm -rf /var/lib/apt/lists/*

# Copy package.json and yarn.lock first to leverage Docker cache
COPY --link package.json yarn.lock ./

# Install node modules
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY --link . .

# Build the application
RUN yarn build

# Final stage for the production image
FROM base

# Copy built application from the build stage
COPY --from=build /app/dist/ /app/dist/

# Expose the port the app runs on
EXPOSE 3000

# Start the server by default, this can be overwritten at runtime
CMD ["yarn", "start:prod"]
