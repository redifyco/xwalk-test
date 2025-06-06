import {initDonationForm} from "../../scripts/adyen-init.js";

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

export default function decorate(block) {
    const backgroundImage =
        block.querySelector(":scope > div:nth-child(1) img")?.src;
    const title = block.querySelector(":scope > div:nth-child(2) div")?.innerHTML;
    const subtitle = block.querySelector(":scope > div:nth-child(3) div")?.innerHTML;
    const maxAmount = Number(
        block.querySelector(":scope > div:nth-child(4) div")?.textContent
    );
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
      <img src="${backgroundImage}" class="object-cover max-h-72 lg:hidden object-center inset-0 h-full w-full z-0" alt="">
      <img src="${backgroundImage}" class="absolute lg:block hidden object-cover object-center inset-0 h-full w-full z-0" alt="">
      <div class="lg:block z-10 hidden">
        <div class="text-7xl text-white prose-em:font-joyful prose-em:text-9xl">
          ${title}
        </div>
        <div class="text-sm text-white lg:text-xl font-light">
          ${subtitle}
        </div>
      </div>
      <div class="z-10 lg:max-w-xl w-full">
        <div id="currency-amount-form" class="block">${CurrencyAmountForm()}</div>
        <div id="owner-information-form" class="hidden">${OwnerInformationForm(
        redirectMaxAmount,
        maxAmount
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
            console.log(
                "🔷 storedFormValue CURRENCY AMOUNT→",
                JSON.parse(sessionStorage.getItem("formValue"))
            );
        });
    }

    // ─── 2) OWNER INFORMATION LOGIC ─────────────────────────────────────────────────
    const submitOwnerInformationForm = containerSection.querySelector(
        "#submit-owner-information-form"
    );
    if (submitOwnerInformationForm) {
        // Prefill any stored values
        const storedFormData = JSON.parse(sessionStorage.getItem("formValue")) || {};
        if (storedFormData) {
            containerSection.querySelector("#first_name").value = storedFormData.firstName || "";
            containerSection.querySelector("#last_name").value = storedFormData.lastName || "";
            containerSection.querySelector("#email").value = storedFormData.email || "";
            containerSection.querySelector("#country").value = storedFormData.country || "";
            containerSection.querySelector("#focus-area").value = storedFormData.focusArea || "";
        }

        submitOwnerInformationForm.addEventListener("click", (e) => {
            e.preventDefault();

            // 1) Swap to step 3
            formValue.steps = 3;
            containerSection.querySelector("#owner-information-form").classList.add("hidden");
            containerSection.querySelector("#adyen-form").classList.remove("hidden");

            // 2) Read whatever user typed
            formValue.firstName = containerSection.querySelector("#first_name")?.value;
            formValue.lastName = containerSection.querySelector("#last_name")?.value;
            formValue.email = containerSection.querySelector("#email")?.value;
            formValue.country = containerSection.querySelector("#country")?.value;
            formValue.focusArea = containerSection.querySelector("#focus-area")?.value;

            sessionStorage.setItem("formValue", JSON.stringify(formValue));
            console.log("🔷 storedFormValue OWNER INFO→", JSON.parse(sessionStorage.getItem("formValue")));

            // 3) Build `data` and `additionalData` now that we have everything
            const sessionData = JSON.parse(sessionStorage.getItem("formValue"));
            const rawCountryCode = sessionData.country.split("-")[0].toUpperCase(); // e.g. "IT" from "it-IT"

            const data = {
                country: rawCountryCode,
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
                shopperEmail: sessionData.email,
                shopperName: {
                    firstName: sessionData.firstName,
                    lastName: sessionData.lastName,
                },
                billingAddress: {
                    country: rawCountryCode,
                    city: "N/A",
                    street: "N/A",
                    houseNumberOrName: "N/A",
                    postalCode: "00000",
                },
                countryCode: rawCountryCode,
                locale: sessionData.country, // e.g. "it-IT"
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
        });
    }

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
        if (checked) {
            containerSection.querySelector("#submit-owner-information-form").classList.add("hidden");
            containerSection.querySelector("#submit-owner-information-form-link").classList.remove("hidden");
            containerSection.querySelector("#submit-owner-information-form-link").classList.add("block");
        }
    });

    // Wipe out the original block and insert our new wizard
    block.textContent = "";
    block.append(containerSection);
};

/* ─── TEMPLATES FOR EACH STEP ─────────────────────────────────────────────────── */

// Step 1: Currency & Amount UI
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
const OwnerInformationForm = (redirectLink, maxAmount) => {
    return `
    <div class="bg-white flex h-full w-full px-4 lg:p-8 flex-col gap-4">
      <div class="flex flex-col">
        <button type="button" id="back-owner-information-form" class="flex justify-end gap-1 items-center cursor-pointer text-primary">
          <ion-icon size="small" name="chevron-back-outline"></ion-icon>
          <span>Back</span>
        </button>
        <div class="mt-3 flex flex-col gap-8">
          <span class="border-b w-full text-xl border-b-black">Your Information</span>
          <div class="flex flex-col gap-8">
            <div class="flex gap-8">
              <input
                id="first_name"
                type="text"
                required
                placeholder="*First Name..."
                class="border-primary w-full border-r-2 border-b-2 p-1 focus-visible:translate-x-1 focus-visible:outline-0"
              />
              <input
                id="last_name"
                type="text"
                required
                placeholder="*Last Name..."
                class="border-primary w-full border-r-2 border-b-2 p-1 focus-visible:translate-x-1 focus-visible:outline-0"
              />
            </div>
            <div>
              <input
                id="email"
                type="email"
                required
                placeholder="*Email..."
                class="border-primary w-full border-r-2 border-b-2 p-1 focus-visible:translate-x-1 focus-visible:outline-0"
              />
            </div>
            <div>
              <select
                id="country"
                class="border-primary w-full border-r-2 border-b-2 p-1 focus-visible:translate-x-1 focus-visible:outline-0 bg-transparent"
              >
                <option value="" disabled selected>*Country...</option>
                <option value="es-ES">Esp</option>
                <option value="fr-FR">Fra</option>
                <option value="de-DE">Ger</option>
                <option value="it-IT">Ita</option>
                <option value="en-EN">Eng</option>
                <option value="">Other</option>
              </select>
            </div>
            <div>
              <select
                id="focus-area"
                class="border-primary w-full border-r-2 border-b-2 p-1 focus-visible:translate-x-1 focus-visible:outline-0 bg-transparent"
              >
                <option value="" disabled selected>*Focus Area...</option>
                <option value="environmental-conservation">Environmental Conservation</option>
                <option value="community-support">Community Support</option>
                <option value="education">Education</option>
                <option value="emergency-relief">Emergency Relief</option>
              </select>
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex w-full items-center gap-2">
                <input
                  type="checkbox"
                  id="privacy"
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
                  id="marketing"
                  class="size-4 min-w-4 checked:bg-primary border-primary accent-primary cursor-pointer"
                />
                <label for="marketing" class="text-sm font-light cursor-pointer">
                  Marketing (optional)
                </label>
              </div>
              <div class="flex w-full items-center gap-2">
                <input
                  type="checkbox"
                  id="max-amount-checkbox"
                  class="size-4 min-w-4 checked:bg-primary border-primary accent-primary cursor-pointer"
                />
                <label for="max-amount-checkbox" class="text-sm font-light cursor-pointer">
                  Ricevuta se importo superiore a ${maxAmount}
                </label>
              </div>
            </div>
          </div>
          <button
            type="button"
            class="border cursor-pointer mt-5 border-primary w-full py-2 text-primary"
            id="submit-owner-information-form"
          >
            Continue
          </button>
          <a
            target="_blank"
            href="${redirectLink}"
            type="button"
            class="border text-center cursor-pointer mt-5 border-primary w-full py-2 text-primary hidden"
            id="submit-owner-information-form-link"
          >
            Continue
          </a>
        </div>
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
        <div class="hidden mt-3" id="dropin-container"></div>
      </div>
    </div>
  `;
};
