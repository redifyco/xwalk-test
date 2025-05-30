const {AdyenCheckout, Dropin} = window.AdyenWeb;


export const initDonationForm = (data, onPaymentCompleted, onPaymentFailed) => {
    console.log('click init donation form', data);
    Promise.all([
        fetch('/api/msc-foundation/services/adyen?type=CREATE_SESSION', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json()),
        fetch('/api/msc-foundation/services/adyen?type=GET_PAYMENT_METHODS', {
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

        const globalConfiguration = {
            session: {
                id: parsedSession.id,
                sessionData: parsedSession.session
            },
            amount: {
                value: data.amount,
                currency: data.currency
            },
            environment: 'test', // Change to 'live' for the live environment.
            paymentMethodsResponse: JSON.parse(paymentMethods.data),
            locale: 'it-IT',
            countryCode: 'IT',
            clientKey: 'test_4TAQ4FQCQFGWVOH5XB3SHGF4YQUKNJMQ',
            onPaymentCompleted,
            onPaymentFailed,
            onError: (error, component) => {
                console.error(error.name, error.message, error.stack, component);
            }
        };

        const dropinConfiguration = {
            paymentMethodsConfiguration: {
                card: {
                    hasHolderName: true, // Show the cardholder name field.
                    holderNameRequired: true, // Mark the cardholder name field as required.
                }
            },
        };

        const checkout = await AdyenCheckout(globalConfiguration);
        const dropin = new Dropin(checkout, dropinConfiguration).mount('#dropin-container');

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


/*
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
    /!*onError: (error, component) => {
        console.error(error.name, error.message, error.stack, component);
    },*!/
    /!*  onChange: (state, component) => {
          console.log('change', state, component);
      },*!/
}*/
