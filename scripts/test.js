// All of the resources that you imported are properties of the window.
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
    clientKey: 'test_P5VRHKISRFFTTMRBMQ4ZYLVQIUSHXYCQ', // Public key used for client-side authentication: https://docs.adyen.com/development-resources/client-side-authentication
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

const cardConfiguration = {
    // Optional configuration.
    billingAddressRequired: true, // Show the billing address input fields and mark them as required.
    brandsConfiguration: {
        visa: {icon: 'https://...'} // Custom icon for Visa.
    }
};

// In this example you imported Card.
const {AdyenCheckout, Card} = window.AdyenWeb;
console.log('AdyenCheckout', AdyenCheckout)

const checkout = await AdyenCheckout(globalConfiguration);
const cardComponent = new Card(checkout, cardConfiguration).mount('#card-container')

console.log('checkout', checkout)
