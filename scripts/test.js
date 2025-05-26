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
    .then(async res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await res.text();
            throw new Error(`Invalid response format. Expected JSON, got: ${text.substring(0, 100)}...`);
        }
        return res.json();
    })
    .then(session => {
        console.log('session', session);


        // checkout.create('card').mount('#card-container');
    })
    .catch(err => {
        console.error('Adyen setup error:', err.message);
        console.error('Error details:', err);
    });
