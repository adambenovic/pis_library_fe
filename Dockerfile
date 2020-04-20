FROM node:12.16.2 AS build
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx
COPY --from=build /usr/src/app/dist/pis-library-fe /usr/share/nginx/html
EXPOSE 4200
