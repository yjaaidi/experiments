FROM node:18.3.0-alpine
ENV NODE_ENV=production

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy yarn berry's files just to make sure that we are
# using the same version of yarn. 
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install dependencies.
RUN pnpm --frozen-lockfile

# Copy local code to the container image.
COPY dist ./

# Run the web service on container startup.
CMD [ "pnpm", "node", "src/main.js" ]
