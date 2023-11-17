FROM --platform=linux/arm/v8 node:latest
WORKDIR /app
COPY package* ./
RUN npm i
COPY . .
EXPOSE 80
ENTRYPOINT node_modules/.bin/ng serve --host 0.0.0.0 --disable-host-check