FROM node:slim AS build

# install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
&& apt-get clean \
&& rm -rf /var/lib/apt/lists/*

# setup workspace
WORKDIR /app

COPY package*.json .
RUN npm ci

COPY . .

# EXPOSE 4200

# ENTRYPOINT node_modules/.bin/ng serve --host 0.0.0.0 --disable-host-check

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist/volex-app /usr/share/nginx/html

EXPOSE 80