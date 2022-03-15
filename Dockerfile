FROM node:16-alpine AS ui-build

WORKDIR /app
COPY checkout/ ./checkout/
RUN cd checkout && npm install @angular/cli && npm install && npm run build

FROM node:16-alpine AS server-build

WORKDIR /app/
COPY --from=ui-build /app/checkout/dist ./checkout/dist
COPY node-api/ ./node-api/
RUN cd node-api && npm install

EXPOSE 8080

WORKDIR /app/node-api

CMD [ "npm", "start" ]