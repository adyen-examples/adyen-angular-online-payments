const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { v4: uuidv4 } = require('uuid');
const { Client, Config, CheckoutAPI, hmacValidator } = require("@adyen/api-library");

// home folder (used when running Node on Docker and Gitpod)
const root_folder = "/workspace/adyen-angular-online-payments";

// init app
const app = express();
// setup request logging
app.use(morgan("dev"));
// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.use(express.static(root_folder + "/checkout/dist/checkout/"));

// enables environment variables by
// parsing the .env file and assigning it to process.env
dotenv.config({
  path: "./.env",
});

// Adyen Node.js API library boilerplate (configuration, etc.)
const config = new Config();
config.apiKey = process.env.ADYEN_API_KEY;
const client = new Client({ config });
client.setEnvironment("TEST"); // change to LIVE for production
const checkout = new CheckoutAPI(client);

// Verify app is running
app.get('/test', (req,res) => {
    res.send('App Works !!!!');
});

// Homepage
app.get('/', (req,res) => {
  res.sendFile(root_folder + "/checkout/dist/checkout/index.html")
});

// Result pages
app.get('/result/*', (req,res) => {
  res.sendFile(root_folder + "/checkout/dist/checkout/index.html")
});


/* ################# API ENDPOINTS ###################### */

// return ADYEN_CLIENT_KEY (used on front-end)
app.get('/api/config', (req,res) => {
  res.send(`{"api_key":"${process.env.ADYEN_CLIENT_KEY}"}`);
});

// Invoke /sessions endpoint
app.post("/api/sessions", async (req, res) => {

  try {
    // unique ref for the transaction
    const orderRef = uuidv4();
    // Ideally the data passed here should be computed based on business logic
    const response = await checkout.sessions({
      amount: { currency: "EUR", value: 10000 }, // value is 100€ in minor units
      countryCode: "NL",
      merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT, // required
      reference: orderRef, // required: your Payment Reference
      // set lineItems required for some payment methods (ie Klarna)
      lineItems: [
        {quantity: 1, amountIncludingTax: 5000 , description: "Sunglasses"},
        {quantity: 1, amountIncludingTax: 5000 , description: "Headphones"}
      ] ,
      returnUrl: `http://${req.headers.host}/api/handleShopperRedirect?orderRef=${orderRef}` // set redirect URL required for some payment methods
    });

    res.json(response);
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
    res.status(err.statusCode).json(err.message);
  }
});

// Handle all redirects from payment type
app.all("/api/handleShopperRedirect", async (req, res) => {
  // Create the payload for submitting payment details
  const redirect = req.method === "GET" ? req.query : req.body;
  const details = {};
  if (redirect.redirectResult) {
    details.redirectResult = redirect.redirectResult;
  } else if (redirect.payload) {
    details.payload = redirect.payload;
  }

  try {
    const response = await checkout.paymentsDetails({ details });
    // Conditionally handle different result codes for the shopper
    switch (response.resultCode) {
      case "Authorised":
        res.redirect("/result/success");
        break;
      case "Pending":
      case "Received":
        res.redirect("/result/pending");
        break;
      case "Refused":
        res.redirect("/result/failed");
        break;
      default:
        res.redirect("/result/error");
        break;
    }
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
    res.redirect("/result/error");
  }
});

/* ################# end API ENDPOINTS ###################### */

/* ################# WEBHOOK ###################### */

// Process incoming Webhook notification: get NotificationRequestItem, validate HMAC signature,
// consume the event asynchronously, send response ["accepted"]
app.post("/api/webhooks/notifications", async (req, res) => {

  console.log("/api/webhooks/notifications");

  // YOUR_HMAC_KEY from the Customer Area
  const hmacKey = process.env.ADYEN_HMAC_KEY;
  const validator = new hmacValidator()
  // Notification Request JSON
  const notificationRequest = req.body;
  const notificationRequestItems = notificationRequest.notificationItems

  // fetch first (and only) NotificationRequestItem
  const notification = notificationRequestItems[0].NotificationRequestItem
  console.log(notification)

  // Handle the notification
  if( validator.validateHMAC(notification, hmacKey) ) {
    // valid hmac: process event
    const merchantReference = notification.merchantReference;
    const eventCode = notification.eventCode;
    console.log("merchantReference:" + merchantReference + " eventCode:" + eventCode);

    // consume event asynchronously
    consumeEvent(notification);

    // acknowledge event has been consumed
    res.send('[accepted]')

  } else {
    // invalid hmac: do not send [accepted] response
    console.log("Invalid HMAC signature: " + notification);
    res.status(401).send('Invalid HMAC signature');
  }

});

// process payload asynchronously
function consumeEvent(notification) {
  // add item to DB, queue or different thread
  
}


/* ################# end WEBHOOK ###################### */

/* ################# UTILS ###################### */

function getPort() {
  return process.env.PORT || 3000;
}

/* ################# end UTILS ###################### */

// Start server
app.listen(getPort(), () => console.log(`Server started -> http://localhost:${getPort()}`));

