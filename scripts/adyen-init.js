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
    ])
        .then(async ([session, paymentMethods]) => {
            const parsePaymentMethods = JSON.parse(paymentMethods.data);
            const parsedSession = JSON.parse(session.data);

            const globalConfiguration = {
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
            };

            const checkout = await AdyenCheckout(globalConfiguration);
            const cardConfiguration = {
                hasHolderName: false,
                billingAddressRequired: false,
                paymentMethods: parsePaymentMethods.data
            };

            console.log(checkout.paymentMethodsResponse);
            new Card(checkout, cardConfiguration).mount('#card-container')


        })
        .catch(err => console.log('error', err));
}

