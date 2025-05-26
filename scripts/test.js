const data = {
    country: "US",
    amount: {
        value: 100,
        currency: "EUR"
    },
    orderReference: "Test Reference"
};

fetch('/bin/msc-foundation/services/adyen?type=CREATE_SESSION', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
    .then(res => res.json())
    .then(async session => {
        console.log('session', session);


        // checkout.create('card').mount('#card-container');
    })
    .catch(err => console.error('Adyen setup error:', err));
