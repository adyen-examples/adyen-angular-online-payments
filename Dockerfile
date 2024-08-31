FROM node:20-alpine AS ui-build

WORKDIR /workspace/adyen-angular-online-payments
COPY checkout/ ./checkout/
RUN cd checkout && npm install 
RUN cd checkout && npm run build

FROM node:20-alpine AS server-build

WORKDIR /workspace/adyen-angular-online-payments/
COPY --from=ui-build /workspace/adyen-angular-online-payments/checkout/dist/checkout/browser ./checkout/dist/checkout
COPY node-api/ ./node-api/
RUN cd node-api && npm install

EXPOSE 8080

WORKDIR /workspace/adyen-angular-online-payments/node-api

CMD [ "npm", "start" ]
