FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci
RUN npm install -g @angular/cli
RUN npm install @microsoft/signalr --save

COPY . .

RUN mkdir -p src/environments && \
    printf "export const environment = { \
      production: true, \
      apiUrl: 'http://ipr2.local/graphql', \
      hubUrl: 'http://ipr2.local/records-hub' \
    };\n" > src/environments/environment.prod.ts

RUN ng build --configuration production

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/client-app/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]