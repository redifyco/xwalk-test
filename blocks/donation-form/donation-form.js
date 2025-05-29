import {initDonationForm} from "../../scripts/adyen-init.js";

export default function decorate(block) {
    const backgroundImage = block.querySelector(":scope > div:nth-child(1) img")?.src;
    const title = block.querySelector(":scope > div:nth-child(2) div")?.innerHTML;
    const subtitle = block.querySelector(":scope > div:nth-child(3) div")?.innerHTML;
    const sessionStorage = window.sessionStorage;
    const formValue = {
        currency: 'USD',
        amount: 25,
        steps: 1
    }

    const containerSection = document.createElement('section');
    containerSection.className = 'bg-no-repeat bg-cover bg-center min-h-96';
    containerSection.style.backgroundImage = `url('${backgroundImage}')`;
    containerSection.innerHTML = `
        <div class="container-layout-padding flex gap-24 justify-between">
            <div>
                <div class="text-7xl text-white prose-em:font-joyful prose-em:text-9xl">
                    ${title}
                </div>
                <div class="text-sm text-white lg:text-xl font-light">
                    ${subtitle}
                </div>
            </div>
            <div id="currency-amount-form" class="block">${CurrencyAmountForm()}</div>
            <div id="owner-information-form" class="hidden">${OwnerInformationForm()}</div>
            <div id="adyen-form" class="hidden">${AdyenForm()}</div>
            <div class="hidden" id="dropin-container"></div>
            <button id="open-adyen">Open Adyen</button>
        </div>
    `


    console.log('sessionStorage', sessionStorage.length)
    if (sessionStorage.length > 0) {
        const steps = JSON.parse(sessionStorage.getItem("formValue"))?.steps;
        if (steps) {
            console.log('steps', steps);
            if (steps === 1) {
                containerSection.querySelector('#currency-amount-form').classList.remove('hidden');
                containerSection.querySelector('#owner-information-form').classList.add('hidden');
                containerSection.querySelector('#adyen-form').classList.add('hidden');
            } else if (steps === 2) {
                containerSection.querySelector('#currency-amount-form').classList.add('hidden');
                containerSection.querySelector('#owner-information-form').classList.remove('hidden');
                containerSection.querySelector('#adyen-form').classList.add('hidden');
            } else if (steps === 3) {
                containerSection.querySelector('#currency-amount-form').classList.add('hidden');
                containerSection.querySelector('#owner-information-form').classList.add('hidden');
                containerSection.querySelector('#adyen-form').classList.remove('hidden');
            }
        }
    }


    /*GET ELEMENTS*/
    const customAmountInput = containerSection.querySelector('#custom-amount');
    const allAmountButtons = containerSection.querySelectorAll('[data-amount]');

    /*CURRENCY SELECT*/
    const allCurrencyButtons = containerSection.querySelectorAll('[data-currency]');
    const handleCurrencyClick = (button) => {
        allCurrencyButtons.forEach(btn => {
            btn.classList.remove('bg-gray-100', 'text-primary');
            btn.classList.add('text-white');
        });

        button.classList.remove('text-white');
        button.classList.add('bg-gray-100', 'text-primary');
        formValue.currency = button.dataset.currency;
        containerSection.querySelectorAll('#button-amount-span').forEach(span => span.innerHTML = button.innerHTML);

    };

    allCurrencyButtons.forEach(button => {
        button.addEventListener('click', (event) => handleCurrencyClick(event.currentTarget));
    });

    const firstCurrencyButton = containerSection.querySelector('[data-currency="USD"]');
    if (firstCurrencyButton) {
        handleCurrencyClick(firstCurrencyButton);
    }


    /*AMOUNT SELECTS*/
    const handleAmountClick = (button) => {
        allAmountButtons.forEach(btn => {
            btn.classList.remove('bg-primary', 'text-white');
            btn.classList.add('bg-gray-100');
        });

        button.classList.remove('text-white');
        button.classList.add('bg-primary', 'text-white');
        formValue.amount = Number(button.dataset.amount);
        customAmountInput.value = '';
    };

    allAmountButtons.forEach(button => {
        button.addEventListener('click', (event) => handleAmountClick(event.currentTarget));
    });

    const firstAmountButton = containerSection.querySelector('[data-amount="25"]');
    if (firstAmountButton) {
        handleAmountClick(firstAmountButton);
    }

    /*CUSTOM INPUT SELECTED*/
    if (customAmountInput) {

        customAmountInput.addEventListener('input', (event) => {
            const value = event.target.value;
            if (value) {
                formValue.amount = Number(value);
                allAmountButtons.forEach(btn => {
                    btn.classList.remove('bg-primary', 'text-white');
                    btn.classList.add('bg-gray-100');
                });
            } else {
                formValue.amount = 0;
            }
        })
    }

    /*SUBMIT CURRENCY AMOUNT FORM*/
    const submitCurrencyAmountButton = containerSection.querySelector('#submit-currency-amount-form');
    if (submitCurrencyAmountButton) {
        submitCurrencyAmountButton.addEventListener('click', () => {
            formValue.steps = 2;
            containerSection.querySelector('#currency-amount-form').classList.toggle('hidden');
            containerSection.querySelector('#owner-information-form').classList.toggle('hidden');
            sessionStorage.setItem("formValue", JSON.stringify(formValue));

            const storedFormValue = JSON.parse(sessionStorage.getItem("formValue"));

            console.log('storedFormValue CURRENCY AMOUNT', storedFormValue);
        })
    }

    /*SUBMIT OWNER INFORMATION FORM*/
    const submitOwnerInformationForm = containerSection.querySelector('#submit-owner-information-form');
    if (submitOwnerInformationForm) {
        submitOwnerInformationForm.addEventListener('click', (e) => {
            e.preventDefault();
            formValue.steps = 3;
            containerSection.querySelector('#owner-information-form').classList.toggle('hidden');
            containerSection.querySelector('#adyen-form').classList.toggle('hidden');
            sessionStorage.setItem("formValue", JSON.stringify(formValue));
            const storedFormValue = JSON.parse(sessionStorage.getItem("formValue"));

            console.log('storedFormValue OWNER INFO', storedFormValue);


            const ownerData = {
                firstName: containerSection.querySelector('#first_name').value,
                lastName: containerSection.querySelector('#last_name').value,
                email: containerSection.querySelector('#email').value,
                currency: storedFormValue.currency,
                amount: storedFormValue.amount
            };
        })
    }

    /*BACK FROM OWNER INFORMATION*/
    const backButtonOwnerInformation = containerSection.querySelector('#back-owner-information-form');
    if (backButtonOwnerInformation) {
        backButtonOwnerInformation.addEventListener('click', () => {
            formValue.steps = 1;
            sessionStorage.setItem("formValue", JSON.stringify(formValue));

            containerSection.querySelector('#currency-amount-form').classList.toggle('hidden');
            containerSection.querySelector('#owner-information-form').classList.toggle('hidden');
        })
    }

    /*BACK FROM ADYEN FORM*/
    const backButtonAdyenForm = containerSection.querySelector('#back-adyen-form');
    console.log('backButton', backButtonAdyenForm);
    if (backButtonAdyenForm) {
        backButtonAdyenForm.addEventListener('click', () => {
            formValue.steps = 2;
            sessionStorage.setItem("formValue", JSON.stringify(formValue));

            containerSection.querySelector('#owner-information-form').classList.toggle('hidden');
            containerSection.querySelector('#adyen-form').classList.toggle('hidden');
        })
    }


    const submitButton = containerSection.querySelector('#open-adyen');
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
    })


    block.textContent = '';
    block.append(containerSection);
}


const CurrencyAmountForm = () => {
    return `
        <div class="bg-white h-full max-w-[600px] min-w-[600px] w-full p-8 flex flex-col gap-4">
            <div class="flex flex-col gap-2 justify-center items-center text-center">  
                <h3 class="text-4xl font-medium">Lorem ipsum dolor sit amet</h3>
                <p class="font-light">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium atque beatae deserunt inventore laboriosam nihil placeat quod, sed temporibus vitae.</p>
            </div>
            <div class="mt-3 flex flex-col gap-4">
                <div class="flex flex-col gap-4">
                    <span class="border-b w-full border-b-black">Choose Currency:</span>
                    <div class="bg-primary shadow rounded flex w-full p-2">
                        <button data-currency="USD" id="button-dollar" class="text-white cursor-pointer rounded px-4 py-2 w-full">$</button>
                        <button data-currency="CHF" id="button-chf" class="text-white cursor-pointer rounded px-4 py-2 w-full">CHF</button>
                        <button data-currency="EUR" id="button-eur" class="text-white cursor-pointer rounded px-4 py-2 w-full">€</button>
                    </div>
                </div> 
                <div class="flex flex-col gap-2">
                    <span class="border-b w-full border-b-black">Choose Amount:</span>
                    <div class="flex gap-2 py-2">
                        <button data-amount="25" id="button-dollar" class="cursor-pointer rounded px-4 py-2 w-full">25<span id="button-amount-span"></span></button>
                        <button data-amount="50" id="button-chf" class="cursor-pointer rounded px-4 py-2 w-full">50<span id="button-amount-span"></span></button>
                        <button data-amount="100" id="button-eur" class="cursor-pointer rounded px-4 py-2 w-full">100<span id="button-amount-span"></span></button>
                    </div>
                    <div class="relative w-full">
                        <input id="custom-amount" type="number" class="rounded bg-gray-100 px-8 py-3 w-full" placeholder="Custom Amount"/>
                        <span id="button-amount-span" class="absolute right-2 top-1/2 -translate-y-1/2"></span>
                    </div>
                </div> 
                <button class="border cursor-pointer mt-5 border-primary w-full py-2 text-primary" id="submit-currency-amount-form">Continue</button>
            </div>
        </div>
    `;
}

const OwnerInformationForm = () => {
    return `
        <div class="bg-white flex h-full max-w-[600px] min-w-[600px] w-full p-8 flex-col gap-4">
            <div class="mt-3 flex flex-col gap-4">
                <div class="flex flex-col gap-8">
                    <div class="flex flex-col">
                        <button type="button" id="back-owner-information-form" class="flex justify-end gap-1 items-center cursor-pointer text-primary">
                            <ion-icon size="small" name="chevron-back-outline"></ion-icon>
                            <span>Back</span>
                        </button>
                        <span class="border-b w-full border-b-black">Information</span>
                    </div>
                    <div class="mt-3 flex flex-col gap-8">
                        <div class="flex gap-8">
                            <input
                                id="first_name"
                                type="text"
                                required
                                placeholder="*First Name..."
                                class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200  focus-visible:translate-x-1 focus-visible:outline-0"
                            />
                            <input
                                id="last_name"
                                type="text"
                                placeholder="*Last Name..."
                                required
                                class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200  focus-visible:translate-x-1 focus-visible:outline-0"
                            />
                        </div>
                        <div>
                            <input
                                id="email"
                                type="text"
                                required
                                placeholder="*Email..."
                                class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200  focus-visible:translate-x-1 focus-visible:outline-0"
                            />
                        </div>
                        <div>
                            <select
                                id="languages"
                                class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 placeholder:text-white/90 focus-visible:translate-x-1 focus-visible:outline-0 bg-transparent"
                            >
                                <option value="" disabled selected>*Language...</option>
                                <option value="Esp">Esp</option>
                                <option value="Fra">Fra</option>
                                <option value="Ger">Ger</option>
                                <option value="Ita">Ita</option>
                                <option value="Eng">Eng</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <button type="button" class="border cursor-pointer mt-5 border-primary w-full py-2 text-primary" id="submit-owner-information-form">Continue</button>
                </div>
            </div>
        </div>
    `;
}


const AdyenForm = () => {
    return `
        <div class="bg-white flex h-full max-w-[600px] min-w-[600px] w-full p-8 flex-col gap-4">
            Adyen form placeholder
            <div class="flex flex-col">
                        <button type="button" id="back-adyen-form" class="flex justify-end gap-1 items-center cursor-pointer text-primary">
                            <ion-icon size="small" name="chevron-back-outline"></ion-icon>
                            <span>Back</span>
                        </button>
                        <span class="border-b w-full border-b-black">Information</span>
                    </div>
        </div>
    `;
}


