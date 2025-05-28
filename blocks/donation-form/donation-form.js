import {initDonationForm} from "../../scripts/adyen-init.js";

export default function decorate(block) {
    const backgroundImage = block.querySelector(":scope > div:nth-child(1) img")?.src;
    const title = block.querySelector(":scope > div:nth-child(2) div")?.innerHTML;
    const subtitle = block.querySelector(":scope > div:nth-child(3) div")?.innerHTML;
    const formValue = {
        currency: 'dollar',
        value: 1000
    }

    const containerSection = document.createElement('section');
    containerSection.className = 'bg-no-repeat bg-cover bg-center min-h-96';
    containerSection.style.backgroundImage = `url('${backgroundImage}')`;
    containerSection.innerHTML = `
<div class="container-layout-padding flex gap-24 justify-between">
<div>
    <div class=" text-7xl text-white prose-em:font-joyful prose-em:text-9xl">
        ${title}
    </div>
     <div class="text-sm text-white lg:text-xl font-light">
        ${subtitle}
      </div>
</div>
${CurrencyForm()}
<div class="hidden" id="dropin-container"></div>
</div>
    `

    /*CURRENCY SELECT*/
    const allButtons = containerSection.querySelectorAll('[data-currency]');
    const handleCurrencyClick = (button) => {
        allButtons.forEach(btn => {
            btn.classList.remove('bg-gray-200', 'text-primary');
            btn.classList.add('text-white');
        });

        button.classList.remove('text-white');
        button.classList.add('bg-gray-200', 'text-primary');
        formValue.currency = button.dataset.currency;
    };

    allButtons.forEach(button => {
        button.addEventListener('click', (event) => handleCurrencyClick(event.currentTarget));
    });

    const dollarButton = containerSection.querySelector('[data-currency="dollar"]');
    if (dollarButton) {
        handleCurrencyClick(dollarButton);
    }


    const submitButton = containerSection.querySelector('#submit-button');
    submitButton.addEventListener('click', () => {
        console.log('formValue', formValue);
        const data = {
            country: "IT",
            amount: {
                value: 1000,
                currency: 'EUR'
            },
            orderReference: "Test Reference",
        };
        initDonationForm(data);
        containerSection.querySelector('#dropin-container').classList.remove('hidden');
        containerSection.querySelector('#form-1').classList.add('hidden');
    })


    block.textContent = '';
    block.append(containerSection);
}


const CurrencyForm = () => {

    return `
        <div id="form-1" class="bg-white h-full max-w-[600px] w-full p-8 flex flex-col gap-4">
            <div class="flex flex-col gap-2 justify-center items-center text-center">  
                <h3 class="text-4xl font-medium">Lorem ipsum dolor sit amet</h3>
                <p class="font-light">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium atque beatae deserunt inventore laboriosam nihil placeat quod, sed temporibus vitae.</p>
            </div>
            <div class="mt-3">
                <div class="flex flex-col gap-2">
                    <span class="border-b w-full border-b-black">Choose Currency</span>
                    <div class="bg-primary shadow rounded flex w-full p-2">
                        <button data-currency="dollar" id="button-dollar" class="text-white cursor-pointer rounded px-4 py-2 w-full">$</button>
                        <button data-currency="chf" id="button-chf" class="text-white cursor-pointer rounded px-4 py-2 w-full">CHF</button>
                        <button data-currency="eur" id="button-eur" class="text-white cursor-pointer rounded px-4 py-2 w-full">€</button>
                    </div>
                </div> 
                <div>
                    Chose Amount:
                </div>
                <button id="submit-button">Button</button>
            </div>
        </div>
    `;
}
