const globalConfiguration = {
    session: {
        id: 'CSD9CAC3...', // Unique identifier for the payment session.
        sessionData: 'Ab02b4c...' // The payment session data.
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
