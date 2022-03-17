# Adyen [online payment](https://docs.adyen.com/checkout) integration demos

This repository includes examples of PCI-compliant UI integrations for online payments with Adyen. Within this demo app, you'll find a simplified version of an e-commerce website, complete with commented code to highlight key features and concepts of Adyen's API. Check out the underlying code to see how you can integrate Adyen to give your shoppers the option to pay with their preferred payment methods, all in a seamless checkout experience.

![Card checkout demo](checkout/src/assets/images/cardcheckout.gif)

## Supported Integrations

**Angular + Express** demos of the following client-side integrations are currently available in this repository:

- [Drop-in](https://docs.adyen.com/checkout/drop-in-web)
- [Component](https://docs.adyen.com/checkout/components-web)
  - ACH
  - Alipay
  - Boleto Bancário
  - Card (3DS2)
  - Dotpay
  - giropay
  - iDEAL
  - Klarna (Pay now, Pay later, Slice it)
  - SEPA Direct Debit
  - SOFORT

Each demo leverages Adyen's API Library for Node.js ([GitHub](https://github.com/Adyen/adyen-node-api-library) | [Docs](https://docs.adyen.com/development-resources/libraries#javascript)).

## Requirements

Node.js 17.0+
Angular 11+

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
  - [API key](https://docs.adyen.com/user-management/how-to-get-the-api-key)
  - [Merchant Account](https://docs.adyen.com/account/account-structure)
  - [HMAC Key](https://docs.adyen.com/development-resources/webhooks/verify-hmac-signatures)

Remember to include `http://localhost:8080` in the list of Allowed Origins

```
ADYEN_API_KEY="your_API_key_here"
ADYEN_MERCHANT_ACCOUNT="your_merchant_account_here"
ADYEN_HMAC_KEY="your_hmac_key_here"
```

2. Start the Express server:

```
$ cd node-api
$ npm start
```

3. In `checkout`, open `src/environments/environment.ts` and add your [Client Key](https://docs.adyen.com/user-management/client-side-authentication):

```js
export const environment = {
  production: false,
  adyenClientKey: "YOUR_CLIENT_KEY"
};
```

4. Serve the Angular application:

```
$ cd checkout
$ ng serve --proxy-config proxy.conf.json
```

5. Visit [http://localhost:8080/](http://localhost:8080/) to select an integration type.

To try out integrations with test card numbers and payment method details, see [Test card numbers](https://docs.adyen.com/development-resources/test-cards/test-card-numbers).

## Contributing

We commit all our new features directly into our GitHub repository. Feel free to request or suggest new features or code changes yourself as well!

Find out more in our [Contributing](https://github.com/adyen-examples/.github/blob/main/CONTRIBUTING.md) guidelines.

## License

MIT license. For more information, see the **LICENSE** file in the root directory.
