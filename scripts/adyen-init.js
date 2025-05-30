const {AdyenCheckout, Dropin} = window.AdyenWeb;

const ADYEN_CLIENT_KEY_TEST = 'test_4TAQ4FQCQFGWVOH5XB3SHGF4YQUKNJMQ';
const ADYEN_CLIENT_KEY_PROD = 'test_RECMBL5SWRCZBBE2OLQ57DZNNAK74JHQ';


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
            clientKey: ADYEN_CLIENT_KEY_PROD,
            onPaymentCompleted,
            onPaymentFailed,
            onError: (error, component) => {
                console.error(error.name, error.message, error.stack, component);
            }
        };

        const dropinConfiguration = {
            paymentMethodsConfiguration: {
                card: {
                    hasHolderName: true,
                    holderNameRequired: true,
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
