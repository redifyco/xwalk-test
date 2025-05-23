const globalConfiguration = {
    session: {
        id: 'CSD9CAC3...',
        sessionData: 'Ab02b4c...'
    },
    environment: 'test',
    amount: {
        value: 1000,
        currency: 'EUR'
    },
    locale: 'nl-NL',
    countryCode: 'NL',
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

const cardConfiguration = {
    billingAddressRequired: true,
};

const {AdyenCheckout, Card} = window.AdyenWeb;
console.log('AdyenCheckout', AdyenCheckout)

const checkout = await AdyenCheckout(globalConfiguration);

console.log('checkout', checkout)


fetch('http://localhost:8080/api/session', {
    method: 'POST'
})
    .then(res => res.json())
    .then(async session => {
        const checkout = await AdyenCheckout({
            environment: 'test',
            clientKey: 'test_6HJJXDTT5BHWJEIQQJPMNDVQW4VBAMI6',
            session: {
                id: session.id,
                sessionData: session.sessionData
            }
        });

        console.log('checkout', checkout)

        checkout.create('card').mount('#card-container');
    })
    .catch(err => console.error('Adyen setup error:', err));

