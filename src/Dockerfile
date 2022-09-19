FROM node:18.3.0-alpine
ENV NODE_ENV=production

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy yarn berry's files just to make sure that we are
# using the same version of yarn. 
COPY .yarnrc.yml ./
COPY .yarn/releases ./.yarn/releases/
# Copy deps
COPY package.json ./
COPY yarn.lock ./

# Install dependencies.
RUN yarn --immutable

# Copy local code to the container image.
COPY dist ./

# Run the web service on container startup.
CMD [ "node", "src/main.js" ]
