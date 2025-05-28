const {AdyenCheckout, Card, Dropin, PayPal, Klarna} = window.AdyenWeb;


export const initDonationForm = (data) => {
    console.log('click init donation form', data);
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
    ]).then(async ([session, paymentMethods]) => {

        console.log('session', session);
        console.log('paymentMethods', paymentMethods);
        const parsedSession = JSON.parse(session.data);

        const configuration = {
            paymentMethodsResponse: JSON.parse(paymentMethods.data),
            clientKey: "test_4TAQ4FQCQFGWVOH5XB3SHGF4YQUKNJMQ",
            locale: 'it-IT',
            countryCode: 'IT',
            environment: 'test',
            amount: {
                value: data.amount.value,
                currency: data.amount.currency
            },
            onSubmit: async (result, component) => {
                console.log('submit', result, component);
            },
            onAdditionalDetails: async (state, component, actions) => {
                console.log('additional details', state, component, actions);
            },
            onPaymentCompleted: (result, component) => {
                console.info(result, component);
            },
            onPaymentFailed: (result, component) => {
                console.info(result, component);
            },
            /*onError: (error, component) => {
                console.error(error.name, error.message, error.stack, component);
            },*/
            /*  onChange: (state, component) => {
                  console.log('change', state, component);
              },*/
        }

        const globalConfiguration = {
            session: {
                id: parsedSession.id, // Unique identifier for the payment session.
                sessionData: parsedSession.session // The payment session data.
            },
            environment: 'test', // Change to 'live' for the live environment.
            paymentMethodsResponse: JSON.parse(paymentMethods.data),
            amount: {
                value: 1000,
                currency: 'EUR'
            },
            locale: 'nl-NL',
            countryCode: 'NL',
            clientKey: 'test_4TAQ4FQCQFGWVOH5XB3SHGF4YQUKNJMQ', // Public key used for client-side authentication: https://docs.adyen.com/development-resources/client-side-authentication
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
            paymentMethodComponents: [Card, PayPal, Klarna],
            // Optional configuration.
            onReady: () => {
            }
        };

        const checkout = await AdyenCheckout(globalConfiguration);
        const dropin = new Dropin(checkout, dropinConfiguration).mount('#dropin-container');

        /*const card = new Card(checkout).mount('#card-container');
        const dropin = new Dropin(checkout).mount('#dropin-container');*/

        console.log('configuration', configuration);
        console.log('checkout', checkout);
        console.log('dropin', dropin);


    })
        .catch(err => console.log('error', err));
}

/*const globalConfiguration = {
    session: {
        id: parsedSession.id,
        sessionData: parsedSession.session
    },
    environment: 'test',
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
};*/
