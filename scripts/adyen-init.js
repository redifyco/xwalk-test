const {AdyenCheckout, Dropin, Card, GooglePay, PayPal} = window.AdyenWeb;


const data = {
    country: "IT",
    amount: {
        value: 100,
        currency: "EUR"
    },
    orderReference: "Test Reference",
    allowedPaymentMethods: ["ideal", "applepay"]
};

fetch('/bin/msc-foundation/services/adyen?type=CREATE_SESSION', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
    .then(async res => res.json())
    .then(async session => {
        const parsedSession = JSON.parse(session.data);

        const globalConfiguration = {
            session: {
                id: parsedSession.id,
                sessionData: parsedSession.session
            },
            environment: 'test',
            amount: {
                value: 1000,
                currency: 'EUR'
            },
            locale: 'it-IT',
            countryCode: 'IT',
            clientKey: 'test_6HJJXDTT5BHWJEIQQJPMNDVQW4VBAMI6',
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

        const dropinConfiguration = {
            // Required if you import individual payment methods.
            paymentMethodComponents: [Card, PayPal, GooglePay, "applepay", "accel", "applepay"],
            // Optional configuration.
            onReady: () => {
            },
            instantPaymentTypes: ['applepay', 'googlepay']
        };

        const checkout = await AdyenCheckout(globalConfiguration);
        const cardConfiguration = {};

        const dropin = new Dropin(checkout, dropinConfiguration).mount('#card-container');

        // const cardComponent = new Card(checkout, cardConfiguration).mount('#card-container')
        const container = document.querySelector('#card-container');


    })
    .catch(err => console.log('error', err));
