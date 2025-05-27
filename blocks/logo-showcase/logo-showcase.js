import {buildHeight} from "../../scripts/utils.js";
import "../../scripts/customTag.js";

export default async function decorate(block) {
    const title = block.querySelector(":scope > div:nth-child(1) div")?.innerHTML;
    const subtitle = block.querySelector(":scope > div:nth-child(2) div")?.innerHTML;
    const buttonText = block.querySelector(":scope > div:nth-child(3) div a")?.textContent;
    const buttonLink = block.querySelector(":scope > div:nth-child(3) div a")?.href;
    const mobileHeight = block.querySelector(":scope > div:nth-child(4) div")?.textContent || '800';
    const desktopHeight = block.querySelector(":scope > div:nth-child(5) div")?.textContent || '1000';
    const items = block.querySelectorAll(":scope > div:nth-child(n+6) div");
    const resultItems = processDivsToObject(items);


    const container = document.createElement('div')
    container.id = 'card-container'

    console.log('container', container)
    const containerSection = document.createElement('section')
    containerSection.className = `flex flex-col items-center justify-center gap-8 px-4 py-14 text-center lg:gap-16 lg:px-16 lg:py-24 ${buildHeight(mobileHeight, desktopHeight)}`

    containerSection.innerHTML = `
      <div class="text-primary prose-em:font-joyful text-3xl uppercase lg:text-7xl">
        ${title}
      </div>
      <div class="text-sm lg:text-xl">
        ${subtitle}
      </div>
      <!--CAROSELLI-->
      <div class="relative w-full overflow-hidden">
    <!-- Mobile carousel -->
    <div class="flex md:hidden items-center gap-12 sm:gap-20 w-max animate-[slide_10s_linear_infinite]">
        ${[...resultItems, ...resultItems]
        .map((item) => {
            if (!item.image || !item.title || !item.link) return "";
            return `
                <a class=" flex items-center" href="${item.link}">
                  <img class="object-contain h-20 sm:h-32 w-auto bg-contain" src="${item.image}" alt="${item.title}" />
                </a>`;
        })
        .join("")}
    </div>
    <!-- Desktop carousel -->
    <div class="hidden md:flex gap-10 py-20 justify-center">
        ${resultItems
        .map((item, index) => {
            if (!item.image || !item.title || !item.link) return "";
            const translation =
                index % 2 === 0 ? "translate-y-0" : "-translate-y-20";
            return `
                <a class="size-48 flex ${translation}" href="${item.link}">
                  <img class="object-contain h-48 w-auto bg-contain" src="${item.image}" alt="${item.title}" />
                </a>`;
        })
        .join("")}
    </div>
</div>
      ${buttonText && buttonLink ? `
      <custom-link href="${buttonLink}">
        ${buttonText}
      </custom-link>
      ` : ''}
  `;


    const aemEnv = block.getAttribute('data-aue-resource');
    if (!aemEnv) {
        block.textContent = '';
        block.append(containerSection);
    } else {
        block.append(containerSection);
        block.querySelector(":scope > div:nth-child(1) div").classList.add('hidden');
        block.querySelector(":scope > div:nth-child(2) div").classList.add('hidden');
        block.querySelector(":scope > div:nth-child(3) div").classList.add('hidden');
        block.querySelector(":scope > div:nth-child(4) div").classList.add('hidden');
        block.querySelector(":scope > div:nth-child(4) div").classList.add('hidden');
        items.forEach(item => item.classList.add('hidden'));
    }

    block.append(containerSection)
    block.append(container)

    const data = {
        country: "IT",
        amount: {
            value: 100,
            currency: "EUR"
        },
        orderReference: "Test Reference"
    };


    const containerDiv = document.querySelector('#card-container');
    console.log('container', containerDiv);

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
        .then(async session => {
            const parsedSession = JSON.parse(session.data);
            
            const globalConfiguration = {
                session: {
                    id: parsedSession.id, // Unique identifier for the payment session.
                    sessionData: parsedSession.session // The payment session data.
                },
                environment: 'test', // Change to 'live' for the live environment.
                amount: {
                    value: 1000,
                    currency: 'EUR'
                },
                locale: 'it-IT',
                countryCode: 'IT',
                clientKey: 'test_6HJJXDTT5BHWJEIQQJPMNDVQW4VBAMI6', // Public key used for client-side authentication: https://docs.adyen.com/development-resources/client-side-authentication
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

            console.log('globalConfiguration', globalConfiguration);
            const {AdyenCheckout, Card} = window.AdyenWeb;

            const checkout = await AdyenCheckout(globalConfiguration);
            console.log('checkout', checkout);

            // 1. Check the available payment methods from the AdyenCheckout instance.
            console.log('checkout.paymentMethodsResponse', checkout.paymentMethodsResponse); // => { paymentMethods: [...], storedPaymentMethods: [...] }

// 2. Create an instance of the Component and mount it to the container you created.
            const cardConfiguration = {
                // Optional configuration.
                billingAddressRequired: true, // Show the billing address input fields and mark them as required.
                brandsConfiguration: {
                    visa: {icon: 'https://...'} // Custom icon for Visa.
                }
            };
            const container = document.querySelector('#card-container');
            console.log('container', container);
            const cardComponent = new Card(checkout, cardConfiguration).mount('#card-container')
            console.log('cardComponent', cardComponent);

        })
        .catch(err => {
            console.error('Adyen setup error:', err.message);
            console.error('Error details:', err);
        });
}

/*Logo Showcase*/
function processDivsToObject(divs) {
    const result = [];

    // Process the divs in groups of 3
    for (let i = 0; i < divs.length; i += 3) {
        const imageDiv = divs[i];
        const titleDiv = divs[i + 1];
        const linkDiv = divs[i + 2];

        const image = imageDiv?.querySelector('img')?.getAttribute('src') || '';
        const title = titleDiv?.textContent.trim() || 'Untitled';
        const link = linkDiv?.textContent.trim() || null;

        result.push({
            image,
            title,
            link,
        });
    }

    return result;
}

