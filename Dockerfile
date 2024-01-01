#Stage 1
FROM node:21-alpine as builder
WORKDIR /app
COPY package*.json .
COPY yarn*.lock .
RUN yarn install
COPY . .
RUN yarn build

#Stage 2
FROM nginx:1.25.0
RUN rm /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf 

COPY nginx/nginx.conf /etc/nginx/
COPY nginx/default.conf /etc/nginx/conf.d/

COPY --from=builder /app/dist /usr/share/nginx/html/

ENTRYPOINT ["nginx", "-g", "daemon off;"]
