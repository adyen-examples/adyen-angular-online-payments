#!/bin/bash
# Adyen Angular Online Payments - Devcontainer Setup Script
set -euo pipefail

echo "Setting up Adyen Angular Online Payments..."

# Install dependencies
echo "Installing dependencies..."
cd checkout && npm install && cd ..
cd node-api && npm install && cd ..

echo ""
echo "Setup complete!"
echo ""
echo "Before running the server, create a .env file in the node-api directory:"
echo "   cp .env.example node-api/.env"
echo ""
echo "Then edit node-api/.env and fill in your actual values:"
echo "   - ADYEN_API_KEY          (required) (https://docs.adyen.com/user-management/how-to-get-the-api-key)"
echo "   - ADYEN_CLIENT_KEY       (required) (https://docs.adyen.com/user-management/client-side-authentication)"
echo "   - ADYEN_MERCHANT_ACCOUNT (required) (https://docs.adyen.com/account/account-structure)"
echo "   - ADYEN_HMAC_KEY         (optional, recommended) (https://docs.adyen.com/development-resources/webhooks/verify-hmac-signatures)"
echo ""
echo "Remember to include http://*.github.dev/* and http://localhost:8080 in the Allowed Origins for your Client Key."
echo ""
echo "To start the application:"
echo "   Terminal 1: cd checkout && ng serve --proxy-config proxy.conf.json"
echo "   Terminal 2: cd node-api && npm start"