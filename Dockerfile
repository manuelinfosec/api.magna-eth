# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.16.1
FROM node:${NODE_VERSION}-slim as base

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y build-essential pkg-config python-is-python3 curl gnupg2


# Add Yarn repository GPG key
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -

# Add Yarn repository to APT sources
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

# Update package lists again and install Yarn
RUN apt-get update && \
    apt-get install -y yarn    

# Install node modules
COPY --link package-lock.json package.json ./
RUN yarn install

# Copy application code
COPY --link . .


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "yarn", "start"]