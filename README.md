# Adyen [online payment](https://docs.adyen.com/online-payments) integration demos

[![Angular Build](https://github.com/adyen-examples/adyen-angular-online-payments/actions/workflows/build.yml/badge.svg)](https://github.com/adyen-examples/adyen-angular-online-payments/actions/workflows/build.yml) 
[![E2E (Playwright)](https://github.com/adyen-examples/adyen-angular-online-payments/actions/workflows/e2e.yml/badge.svg)](https://github.com/adyen-examples/adyen-angular-online-payments/actions/workflows/e2e.yml)

## Details

This repository showcases a PCI-compliant integration of the [Sessions Flow](https://docs.adyen.com/online-payments/build-your-integration/additional-use-cases/), the default integration that we recommend for merchants. Explore this simplified e-commerce demo to discover the code, libraries and configuration you need to enable various payment options in your checkout experience.  

![Card checkout demo](checkout/src/assets/images/cardcheckout.gif)

The demo leverages Adyen's API Library for Node.js ([GitHub](https://github.com/Adyen/adyen-node-api-library) | [Docs](https://docs.adyen.com/development-resources/libraries#javascript)).

## Requirements

Node.js 20.0+  
Angular 18+

## Run with GitHub Codespaces
This repository is configured to work with GitHub Codespaces. Click the badge below to launch a Codespace with all dependencies pre-installed.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new/adyen-examples/adyen-anqular-online-payments?ref=main&devcontainer_path=.devcontainer%2Fdevcontainer.json)

For detailed setup instructions, see the [GitHub Codespaces Instructions](https://github.com/adyen-examples/.github/blob/main/pages/codespaces-instructions.md).

## Installation

1. Clone this repo:

```
git clone https://github.com/adyen-examples/adyen-angular-online-payments.git
```

2. Navigate to `checkout` and install dependencies:

```
npm install
```

3. Navigate to `node-api` and install dependencies:

```
npm install
```

## Usage

1. Create a `.env` file with all required configuration
  - [API key](https://docs.adyen.com/user-management/how-to-get-the-api-key) (required)
  - [Client Key](https://docs.adyen.com/user-management/client-side-authentication) (required)
  - [Merchant Account](https://docs.adyen.com/account/account-structure) (required)
  - [HMAC Key](https://docs.adyen.com/development-resources/webhooks/verify-hmac-signatures) (optional, recommended)

Remember to include `http://localhost:8080` in the list of Allowed Origins

```
ADYEN_API_KEY="your_adyen_api_key_here"
ADYEN_MERCHANT_ACCOUNT="your_adyen_merchant_account_here"
ADYEN_CLIENT_KEY="your_adyen_client_key_here"
ADYEN_HMAC_KEY="your_adyen_hmac_key_here"

```

2. Start the Express server:

```
$ cd node-api
$ npm start
```

3. Serve the Angular application:

```
$ cd checkout
$ ng serve --proxy-config proxy.conf.json
```

5. Visit [http://localhost:8080/](http://localhost:8080/) to select an integration type.

To try out integrations with test card numbers and payment method details, see [Test card numbers](https://docs.adyen.com/development-resources/test-cards/test-card-numbers).

# Webhooks

Webhooks deliver asynchronous notifications about the payment status and other events that are important to receive and process. 
You can find more information about webhooks in [this blog post](https://www.adyen.com/knowledge-hub/consuming-webhooks).

### Webhook setup

In the Customer Area under the `Developers → Webhooks` section, [create](https://docs.adyen.com/development-resources/webhooks/#set-up-webhooks-in-your-customer-area) a new `Standard webhook`.

A good practice is to set up basic authentication, copy the generated HMAC Key and set it as an environment variable. The application will use this to verify the [HMAC signatures](https://docs.adyen.com/development-resources/webhooks/verify-hmac-signatures/).

Make sure the webhook is **enabled**, so it can receive notifications.

### Expose an endpoint

This demo provides a simple webhook implementation exposed at `/api/webhooks/notifications` that shows you how to receive, validate and consume the webhook payload.

### Test your webhook

The following webhooks `events` should be enabled:
* **AUTHORISATION**


To make sure that the Adyen platform can reach your application, we have written a [Webhooks Testing Guide](https://github.com/adyen-examples/.github/blob/main/pages/webhooks-testing.md)
that explores several options on how you can easily achieve this (e.g. running on localhost or cloud).
