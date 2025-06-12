import {initDonationForm, loadAdyen} from '../../scripts/adyen-init.js';
import { getDataFromJson } from '../../scripts/utils.js';

const formValue = {
    firstName: "",
    lastName: "",
    email: "",
    currency: "USD",
    amount: 25,
    steps: 1,
    country: "it-IT",
    focusArea: "",
};

export default async function decorate(block) {
    try {
        // Carica Adyen e aspetta che sia completamente disponibile
        await loadAdyen();
        console.log('✅ Adyen caricato con successo');
    } catch (error) {
        console.error('❌ Errore nel caricamento di Adyen:', error);
        return;
    }

    // Carica entrambi CSS e JS di Adyen
    const backgroundImage = block.querySelector(":scope > div:nth-child(1) img")?.src;
    const title = block.querySelector(":scope > div:nth-child(2) div")?.innerHTML;
    const subtitle = block.querySelector(":scope > div:nth-child(3) div")?.innerHTML;
    const maxAmount = Number(
        block.querySelector(":scope > div:nth-child(4) div")?.textContent
    );
    const focusAreaApiUrl = block.querySelector(":scope > div:nth-child(6) div p")?.textContent;
    const countriesApiUrl = block.querySelector(":scope > div:nth-child(7) div p")?.textContent;
    const focusArea = await getDataFromJson(focusAreaApiUrl);
    const countries = await getDataFromJson(countriesApiUrl);
    const redirectMaxAmount = block.querySelector(":scope > div:nth-child(5) div a")?.href;
    const sessionStorage = window.sessionStorage;

    // Helper to reset in‐memory + sessionStorage state:
    const resetSessionStorage = () => {
        formValue.firstName = "";
        formValue.lastName = "";
        formValue.email = "";
        formValue.currency = "USD";
        formValue.amount = 25;
        formValue.steps = 1;
        formValue.country = "it-IT";
        formValue.focusArea = "";

        sessionStorage.setItem(
            "formValue",
            JSON.stringify({...formValue})
        );
    };
    resetSessionStorage();

    // ─── Build the three‐step wizard container ───────────────────────────────────────
    const containerSection = document.createElement("section");
    containerSection.className =
        "bg-no-repeat relative bg-cover bg-center min-h-96 pb-14 lg:container-layout-padding";
    containerSection.innerHTML = `
    <div class="flex flex-col items-end lg:flex-row gap-8 lg:gap-24 justify-between">
      <img src="${backgroundImage}" class="object-cover max-h-80 lg:hidden object-center inset-0 h-full w-full z-0" alt="">
      <img src="${backgroundImage}" class="absolute lg:block hidden object-cover object-center inset-0 h-full w-full z-0" alt="">
      <div class="lg:block z-10 hidden">
        <div class="text-7xl text-white prose-em:font-joyful prose-em:text-9xl">
          ${title}
        </div>
        <div class="text-sm text-white lg:text-xl font-light">
          ${subtitle}
        </div>
      </div>
      <div id="success-box" class="z-10 lg:max-w-xl w-full hidden">
        ${SuccessBox()}
      </div>
    
      <div id="steps-form" class="z-10 lg:max-w-xl w-full">
        <div id="currency-amount-form" class="block">${CurrencyAmountForm()}</div>
        <div id="owner-information-form" class="hidden">${OwnerInformationForm(
        redirectMaxAmount,
        maxAmount,
        focusArea,
        countries
    )}</div>
        <div id="adyen-form" class="hidden">${AdyenForm()}</div>
      </div>
    </div>
  `;


    // When we land or refresh, show/hide steps based on sessionStorage.formValue.steps
    if (sessionStorage.length > 0) {
        const stored = JSON.parse(sessionStorage.getItem("formValue")) || {};
        const steps = stored.steps || 1;
        containerSection.querySelector("#currency-amount-form").classList.toggle("hidden", steps !== 1);
        containerSection.querySelector("#owner-information-form").classList.toggle("hidden", steps !== 2);
        containerSection.querySelector("#adyen-form").classList.toggle("hidden", steps !== 3);
    }

    // ─── 1) CURRENCY & AMOUNT LOGIC ─────────────────────────────────────────────────
    const customAmountInput = containerSection.querySelector("#custom-amount");
    const allAmountButtons = containerSection.querySelectorAll("[data-amount]");
    const allCurrencyButtons = containerSection.querySelectorAll("[data-currency]");

    // Highlight selected currency
    const handleCurrencyClick = (button) => {
        allCurrencyButtons.forEach((btn) => {
            btn.classList.remove("bg-gray-100", "text-primary");
            btn.classList.add("text-white");
        });
        button.classList.remove("text-white");
        button.classList.add("bg-gray-100", "text-primary");

        formValue.currency = button.dataset.currency;
        containerSection
            .querySelectorAll("#button-amount-span")
            .forEach((span) => (span.innerHTML = button.innerHTML));
    };
    allCurrencyButtons.forEach((button) =>
        button.addEventListener("click", (e) => handleCurrencyClick(e.currentTarget))
    );
    // Restore stored currency (if any)
    {
        const storedCurrency = JSON.parse(sessionStorage.getItem("formValue"))?.currency;
        const currencyButton =
            containerSection.querySelector(`[data-currency="${storedCurrency}"]`) ||
            containerSection.querySelector('[data-currency="USD"]');
        if (currencyButton) handleCurrencyClick(currencyButton);
    }

    // Highlight selected preset amount
    const handleAmountClick = (button) => {
        allAmountButtons.forEach((btn) => {
            btn.classList.remove("bg-primary", "text-white");
            btn.classList.add("bg-gray-100");
        });
        button.classList.remove("text-white");
        button.classList.add("bg-primary", "text-white");

        formValue.amount = Number(button.dataset.amount);
        customAmountInput.value = "";
    };
    allAmountButtons.forEach((button) =>
        button.addEventListener("click", (e) => handleAmountClick(e.currentTarget))
    );
    // Restore stored amount
    {
        const storedAmount = JSON.parse(sessionStorage.getItem("formValue"))?.amount;
        const amountButton =
            containerSection.querySelector(`[data-amount="${storedAmount}"]`) ||
            containerSection.querySelector('[data-amount="25"]');
        if (amountButton) handleAmountClick(amountButton);
    }

    // Custom-amount input overrides buttons
    if (customAmountInput) {
        customAmountInput.addEventListener("input", (e) => {
            const v = e.target.value;
            if (v) {
                formValue.amount = Number(v);
                allAmountButtons.forEach((btn) => {
                    btn.classList.remove("bg-primary", "text-white");
                    btn.classList.add("bg-gray-100");
                });
            } else {
                formValue.amount = 0;
            }
        });
    }

    // “Continue” on step 1 → move to step 2
    const submitCurrencyAmountButton = containerSection.querySelector(
        "#submit-currency-amount-form"
    );
    if (submitCurrencyAmountButton) {
        submitCurrencyAmountButton.addEventListener("click", () => {
            formValue.steps = 2;
          containerSection.querySelector("#currency-amount-form").classList.add("hidden");
          containerSection.querySelector("#owner-information-form").classList.remove("hidden");
            sessionStorage.setItem("formValue", JSON.stringify(formValue));
        });
    }

    // ─── 2) OWNER INFORMATION LOGIC ─────────────────────────────────────────────────
    const submitOwnerInformationForm = containerSection.querySelector('#form-owner-information')
    submitOwnerInformationForm.addEventListener('submit', (e) => {
        const formData = new FormData(submitOwnerInformationForm);

        e.preventDefault();
        containerSection.querySelector("#owner-information-form").classList.add("hidden");
        containerSection.querySelector("#adyen-form").classList.remove("hidden");

        formValue.firstName = formData.get("first_name");
        formValue.lastName = formData.get("last_name");
        formValue.email = formData.get("email");
        formValue.country = formData.get("country");
        formValue.focusArea = formData.get("focus-area");

        const parsedCountry = JSON.parse(formValue.country);
        sessionStorage.setItem("formValue", JSON.stringify({ ...formValue, country: parsedCountry }));
        const sessionData = JSON.parse(sessionStorage.getItem("formValue"));


        const data = {
            country: sessionData.country.code,
            amount: {
                // Minor units: e.g. 25 → 2500
                value: sessionData.amount * 100,
                currency: sessionData.currency,
            },
            orderReference: `DONATION_${Date.now()}`,
            metadata: {
                focusArea: sessionData.focusArea || ""
            }
        };


        const additionalData = {
            returnUrl: `${window.location.href}?donation-success=true`,
            shopperEmail: sessionData.email,
            shopperName: {
                firstName: sessionData.firstName,
                lastName: sessionData.lastName,
            },
            countryCode: sessionData.country.code,
            locale: sessionData.country.locale,
        };

        // 4) Call Drop-in
        initDonationForm(
            data,
            additionalData,
            (success) => {
                console.log("✅ Donation succeeded:", success);
                sessionStorage.clear();
            },
            (error) => {
                console.error("❌ Donation failed:", error);
                sessionStorage.clear();
            }
        );

        // 5) Finally, reveal the Drop-in container so it renders
        containerSection.querySelector("#dropin-container").classList.remove("hidden");
    })


    // ─── 3) “Back” Buttons ─────────────────────────────────────────────────────────────
    const backButtonOwnerInformation = containerSection.querySelector(
        "#back-owner-information-form"
    );
    if (backButtonOwnerInformation) {
        backButtonOwnerInformation.addEventListener("click", () => {
            formValue.steps = 1;
            containerSection.querySelector("#currency-amount-form").classList.remove("hidden");
            containerSection.querySelector("#owner-information-form").classList.add("hidden");
        });
    }

    const backButtonAdyenForm = containerSection.querySelector("#back-adyen-form");
    if (backButtonAdyenForm) {
        backButtonAdyenForm.addEventListener("click", () => {
            formValue.steps = 2;
            containerSection.querySelector("#owner-information-form").classList.remove("hidden");
            containerSection.querySelector("#adyen-form").classList.add("hidden");
        });
    }

    // ─── 4) “Max Amount” Checkbox Logic ────────────────────────────────────────────────
    containerSection.querySelector("#max-amount-checkbox").addEventListener("change", (e) => {
        const checked = e.target.checked;
        containerSection.querySelector("#button-form-owner-information").classList.toggle("hidden", checked);
        containerSection.querySelector("#button-form-owner-information-link").classList.toggle("hidden", !checked);
    });


    /* Logic after Redirect */
  const donationSuccess = new URLSearchParams(window.location.search).get('donation-success');
  if(donationSuccess === 'true') {
    console.log('donation-success query param found, resetting sessionStorage');
    resetSessionStorage()
    containerSection.querySelector("#steps-form").classList.add('hidden');
    containerSection.querySelector("#success-box").classList.toggle('hidden');
  }

    // Wipe out the original block and insert our new wizard
    block.textContent = "";
    block.append(containerSection);
};

const CurrencyAmountForm = () => {
    return `
    <div class="bg-white h-full w-full px-4 lg:p-8 flex flex-col gap-4">
      <div class="flex flex-col gap-2 justify-center items-center text-center">
        <h3 class="text-2xl lg:text-4xl font-medium">Select Donation Amount</h3>
        <p class="font-light">Choose a currency and amount to donate.</p>
      </div>
      <div class="mt-3 flex flex-col gap-4">
        <div class="flex flex-col gap-4">
          <span class="border-b w-full text-xl border-b-black">Choose Currency</span>
          <div class="bg-primary shadow rounded flex w-full p-2">
            <button data-currency="USD" id="button-dollar" class="text-white cursor-pointer rounded px-4 py-2 w-full">$</button>
            <button data-currency="CHF" id="button-chf" class="text-white cursor-pointer rounded px-4 py-2 w-full">CHF</button>
            <button data-currency="EUR" id="button-eur" class="text-white cursor-pointer rounded px-4 py-2 w-full">€</button>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <span class="border-b w-full text-xl border-b-black">Choose Amount</span>
          <div class="flex gap-2 py-2">
            <button data-amount="25" id="button-amount-25" class="cursor-pointer rounded px-4 py-2 w-full">
              25<span id="button-amount-span"></span>
            </button>
            <button data-amount="50" id="button-amount-50" class="cursor-pointer rounded px-4 py-2 w-full">
              50<span id="button-amount-span"></span>
            </button>
            <button data-amount="100" id="button-amount-100" class="cursor-pointer rounded px-4 py-2 w-full">
              100<span id="button-amount-span"></span>
            </button>
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
};

// Step 2: Owner Information UI
const OwnerInformationForm = (redirectLink, maxAmount, focusArea, countries) => {
    return `
    <div class="bg-white flex h-full w-full px-4 lg:p-8 flex-col gap-4">
      <div class="flex flex-col">
        <button type="button" id="back-owner-information-form" class="flex justify-end gap-1 items-center cursor-pointer text-primary">
          <ion-icon size="small" name="chevron-back-outline"></ion-icon>
          <span>Back</span>
        </button>
        <form id="form-owner-information" class="mt-3 flex flex-col gap-8">
          <span class="border-b w-full text-xl border-b-black">Your Information</span>
          <div class="flex flex-col gap-8">
            <div class="flex gap-8">
              <input
                name="first_name"
                type="text"
                required
                placeholder="*First Name..."
                class="border-primary w-full border-r-2 border-b-2 p-1 focus-visible:translate-x-1 focus-visible:outline-0"
              />
              <input
                name="last_name"
                type="text"
                required
                placeholder="*Last Name..."
                class="border-primary w-full border-r-2 border-b-2 p-1 focus-visible:translate-x-1 focus-visible:outline-0"
              />
            </div>
            <div>
              <input
                name="email"
                type="email"
                required
                placeholder="*Email..."
                class="border-primary w-full border-r-2 border-b-2 p-1 focus-visible:translate-x-1 focus-visible:outline-0"
              />
            </div>
            <div>
              <select
              required
                name="country"
                class="border-primary w-full border-r-2 border-b-2 p-1 focus-visible:translate-x-1 focus-visible:outline-0 bg-transparent"
              >
              <option value="" disabled selected>*Country...</option>
              ${countries?.data.length > 0 ? countries?.data.map((item) => {
                const stringifyData = JSON.stringify(item);
                return `<option value='${stringifyData}'>${item.name}</option>`
              }) : ''}
              </select>
            </div>
            <div>
              <select
              required
                name="focus-area"
                class="border-primary w-full border-r-2 border-b-2 p-1 focus-visible:translate-x-1 focus-visible:outline-0 bg-transparent"
              >
                ${focusArea?.data.length > 0 ? focusArea?.data.map((item) => {
        if (item.tag === 'mscfoundation:focus-area') {
            return `<option value="" disabled selected>*${item.title}...</option>`
        } else {
            return `<option value="${item.title}">${item.title}</option>`
        }
    }) : ''}
              </select>
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex w-full items-center gap-2">
                <input
                  type="checkbox"
                  name="privacy"
                  required
                  checked
                  class="size-4 min-w-4 checked:bg-primary border-primary accent-primary cursor-pointer"
                />
                <label for="privacy" class="text-sm font-light cursor-pointer">
                  Privacy (mandatory)
                </label>
              </div>
              <div class="flex w-full items-center gap-2">
                <input
                  type="checkbox"
                  name="marketing"
                  class="size-4 min-w-4 checked:bg-primary border-primary accent-primary cursor-pointer"
                />
                <label for="marketing" class="text-sm font-light cursor-pointer">
                  Marketing (optional)
                </label>
              </div>
              <div class="flex w-full items-center gap-2">
                <input
                  type="checkbox"
                  name="max-amount-checkbox"
                  id="max-amount-checkbox"
                  class="size-4 min-w-4 checked:bg-primary border-primary accent-primary cursor-pointer"
                />
                <label for="max-amount-checkbox" class="text-sm font-light cursor-pointer">
                  Ricevuta se importo superiore a ${maxAmount}<span id="button-amount-span"></span>
                </label>
              </div>
            </div>
          </div>
          <button
            type="submit"
            class="border cursor-pointer mt-5 border-primary w-full py-2 text-primary"
            id="button-form-owner-information"
          >
            Continue
          </button>
          <a
            target="_blank"
            href="${redirectLink}"
            type="button"
            class="border text-center cursor-pointer mt-5 border-primary w-full py-2 text-primary hidden"
            id="button-form-owner-information-link"
          >
            Continue
          </a>
        </form>
      </div>
    </div>
  `;
};

// Step 3: Adyen Drop-in container + Back button
const AdyenForm = () => {
    return `
    <div class="bg-white flex h-full w-full px-4 lg:p-8 flex-col gap-4">
      <div class="flex flex-col">
        <button
          type="button"
          id="back-adyen-form"
          class="flex justify-end gap-1 items-center cursor-pointer text-primary"
        >
          <ion-icon size="small" name="chevron-back-outline"></ion-icon>
          <span>Back</span>
        </button>
        <div class="hidden mt-3" id="dropin-container">
         <div class="w-full min-h-[400px] flex items-center justify-center" id="adyen-loader"><div role="status">
    <svg aria-hidden="true" class="w-12 h-12 text-gray-200 animate-spin fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
</div></div>
</div>
      </div>
    </div>
  `;
};

const SuccessBox = () => {
  return `
    <div class="bg-white flex h-full w-full px-4 lg:p-8 flex-col gap-4">
      <div class="adyen-checkout__status adyen-checkout__status--success"><img height="88" class="adyen-checkout__status__icon adyen-checkout__image adyen-checkout__image--loaded" src="https://checkoutshopper-test.cdn.adyen.com/checkoutshopper/images/components/success.gif" alt="Zahlung erfolgreich"><span class="adyen-checkout__status__text">Zahlung erfolgreich</span></div>
    </div>
  `;
};
