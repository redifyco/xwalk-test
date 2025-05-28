import {initDonationForm} from "../../scripts/adyen-init.js";

export default function decorate(block) {
    const backgroundImage = block.querySelector(":scope > div:nth-child(1) img")?.src;
    const title = block.querySelector(":scope > div:nth-child(2) div")?.innerHTML;
    const subtitle = block.querySelector(":scope > div:nth-child(3) div")?.innerHTML;

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
${CurrencyForm(containerSection)}
</div>
<div class="bg-white">

        <div class="p-20 mt-10" id="dropin-container"></div>
        <div class="p-20 mt-10" id="card-container"></div>
        <button class="bg-orange-300" id="create-form">Create form</button>
</div>
    `

    containerSection.querySelector('#create-form').addEventListener('click', () => {
        console.log('click create form');
        const data = {
            country: "IT",
            amount: {
                value: 3000,
                currency: "EUR"
            },
            orderReference: "Test Reference",
        };
        initDonationForm(data);
    })


    block.textContent = '';
    block.append(containerSection);
}


const CurrencyForm = () => {

    return `
        <div class="bg-white h-full max-w-[600px] w-full p-8 flex flex-col gap-4">
            <div class="flex flex-col gap-2 justify-center items-center text-center">  
                <h3 class="text-4xl font-medium">Lorem ipsum dolor sit amet</h3>
                <p class="font-light">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium atque beatae deserunt inventore laboriosam nihil placeat quod, sed temporibus vitae.</p>
            </div>
            <div class="mt-3">
                <div class="flex flex-col gap-2">
                    <span class="border-b w-full border-b-black">Choose Currency</span>
                    <div class="bg-primary shadow rounded flex w-full p-2">
                        <button id="button-dolla" class="bg-gray-200 rounded px-4 py-2 text-primary w-full">$</button>
                        <button id="button-chf" class="w-full text-white">CHF</button>
                        <button id="button-eur" class="w-full text-white">€</button>
                    </div>
                </div> 
                <div>
                    Chose Amount:
                </div>
                <div>Button</div>
            </div>
        </div>
    `;
}
