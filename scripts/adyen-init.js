const {AdyenCheckout, Card} = window.AdyenWeb;

const data = {
    country: "IT",
    amount: {
        value: 100,
        currency: "EUR"
    },
    orderReference: "Test Reference",
};

Promise.all([
    fetch('/bin/msc-foundation/services/adyen?type=CREATE_SESSION', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    fetch('/bin/msc-foundation/services/adyen?type=GET_PAYMENT_METHODS', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json())
])
    .then(async ([session, paymentMethods]) => {

        const parsePaymentMethods = JSON.parse(paymentMethods.data);
        console.log('paymentMethods', parsePaymentMethods)
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

        const checkout = await AdyenCheckout(globalConfiguration);
        const cardConfiguration = {
            // Optional configuration.
            billingAddressRequired: true, // Show the billing address input fields and mark them as required.
            brandsConfiguration: {
                visa: {icon: 'https://...'} // Custom icon for Visa.
            }
        };

        console.log(checkout.paymentMethodsResponse);
        const cardComponent = new Card(checkout, cardConfiguration).mount('#card-container')
        const container = document.querySelector('#card-container');


    })
    .catch(err => console.log('error', err));
