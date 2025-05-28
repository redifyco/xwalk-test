const {AdyenCheckout, Card} = window.AdyenWeb;


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
        const configuration = {
            paymentMethodsResponse: JSON.parse(paymentMethods.data),
            clientKey: "test_6HJJXDTT5BHWJEIQQJPMNDVQW4VBAMI6",
            locale: 'it-IT',
            countryCode: 'IT',
            session: {
                id: session.id,
                sessionData: session.session
            },
            environment: 'test',
            amount: {
                value: data.value,
                currency: data.currency
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

        const checkout = await AdyenCheckout(configuration);
        const card = new Card(checkout).mount('#card-container');
        console.log('configuration', configuration);
        console.log('checkout', checkout);


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
