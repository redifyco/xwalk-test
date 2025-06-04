const {AdyenCheckout, Dropin} = window.AdyenWeb;

const ADYEN_CLIENT_KEY_JATIN_TEST = 'test_4TAQ4FQCQFGWVOH5XB3SHGF4YQUKNJMQ';
const ADYEN_CLIENT_KEY_CUSTOMER_TEST = 'test_RECMBL5SWRCZBBE2OLQ57DZNNAK74JHQ';
const CREATE_SESSION_API_URL = '/api/msc-foundation/services/adyen?type=CREATE_SESSION'
const GET_PAYMENT_METHODS_API_URL = '/api/msc-foundation/services/adyen?type=GET_PAYMENT_METHODS'
const ENVIRONMENT = 'test';


export const initDonationForm = (data, onPaymentCompleted, onPaymentFailed) => {


    Promise.all([
        fetch(CREATE_SESSION_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json()),
        fetch(GET_PAYMENT_METHODS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
    ]).then(async ([session, paymentMethods]) => {
        const parsedSession = JSON.parse(session.data);
        const parsedPaymentMethods = JSON.parse(paymentMethods.data);

        const globalConfiguration = {
            session: {
                id: parsedSession.id,
                sessionData: parsedSession.session
            },
            amount: {
                value: data.amount,
                currency: data.currency
            },
            environment: ENVIRONMENT,
            paymentMethodsResponse: parsedPaymentMethods,
            locale: 'it-IT',
            countryCode: 'IT',
            clientKey: ADYEN_CLIENT_KEY_JATIN_TEST,
            onPaymentCompleted,
            onPaymentFailed,
            onSubmit: async (state, component, actions) => {
                try {

                    // Make a POST /payments request from your server.
                    const result = await makePaymentsCall(state.data, countryCode, locale, amount);

                    // If the /payments request from your server fails, or if an unexpected error occurs.
                    if (!result.resultCode) {
                        actions.reject();
                        return;
                    }

                    const {
                        resultCode,
                        action,
                        order,
                        donationToken
                    } = result;

                    // If the /payments request request from your server is successful, you must call this to resolve whichever of the listed objects are available.
                    // You must call this, even if the result of the payment is unsuccessful.
                    actions.resolve({
                        resultCode,
                        action,
                        order,
                        donationToken,
                    });
                } catch (error) {
                    console.error("onSubmit", error);
                    actions.reject();
                }
            },
            beforeSubmit: (data, component, actions) => {
                data.billingAddress = {
                    "country": "IT",
                    "city": "Milan",
                    "street": "Via Example",
                    "houseNumberOrName": "123",
                    "postalCode": "20100"
                };

                actions.resolve(data);
            }
        };

        const dropinConfiguration = {};

        const checkout = await AdyenCheckout(globalConfiguration);
        new Dropin(checkout, dropinConfiguration).mount('#dropin-container');
    })
        .catch(err => console.log('error', err));
}
