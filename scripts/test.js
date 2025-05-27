const data = {
    country: "US",
    amount: {
        value: 100,
        currency: "EUR"
    },
    orderReference: "Test Reference"
};

fetch('/bin/msc-foundation/services/adyen?type=CREATE_SESSION', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
    .then(async res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await res.text();
            throw new Error(`Invalid response format. Expected JSON, got: ${text.substring(0, 100)}...`);
        }
        return res.json();
    })
    .then(async session => {
        const parsedSession = JSON.parse(session.data);

        console.log('parsedSession', parsedSession)

        console.log('session', session);
        const globalConfiguration = {
            session: {
                id: session.id, // Unique identifier for the payment session.
                sessionData: session.session // The payment session data.
            },
            environment: 'test', // Change to 'live' for the live environment.
            amount: {
                value: 1000,
                currency: 'EUR'
            },
            locale: 'nl-NL',
            countryCode: 'NL',
            clientKey: 'test_870be2...', // Public key used for client-side authentication: https://docs.adyen.com/development-resources/client-side-authentication
            onPaymentCompleted: (result, component) => {
                console.info(result, component);
            },
            onPaymentFailed: (result, component) => {
                console.info(result, component);
            },
            onError: (error, component) => {
                console.error(error.name, error.message, error.stack, component);
            }
        };

        console.log('globalConfiguration', globalConfiguration);
        const {AdyenCheckout, Card} = window.AdyenWeb;

        const checkout = await AdyenCheckout(globalConfiguration);
        console.log('checkout', checkout);

        // 1. Check the available payment methods from the AdyenCheckout instance.
        console.log('checkout.paymentMethodsResponse', checkout.paymentMethodsResponse); // => { paymentMethods: [...], storedPaymentMethods: [...] }

// 2. Create an instance of the Component and mount it to the container you created.
        const cardComponent = new Card(checkout, cardConfiguration).mount('#card-container')
        console.log('cardComponent', cardComponent);

    })
    .catch(err => {
        console.error('Adyen setup error:', err.message);
        console.error('Error details:', err);
    });
