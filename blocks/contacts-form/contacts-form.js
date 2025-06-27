import '../../scripts/customTag.js';
import { createCase, loadGoogleRecaptcha, validateEmail } from "../../scripts/utils.js";

export default async function decorate(block) {
    // Default values
    const defaults = {
        backgroundImage: '/content/dam/mscfoundation/placeholders/contact-form-placeholder.jpg',
        title: 'Contact <em>Us</em>',
        subTitle: 'Get in touch with us for any questions or support',
        buttonText: 'Send Message',
        placeholders: {
            name: '*Name...',
            surname: '*Surname...',
            email: '*Email...',
            phone: '*Phone...',
            type: '*Type of request...',
            language: '*Language...',
            description: '*Description of your Request...'
        },
        labels: {
            marketingConsent: 'Marketing consent',
            policy: 'I agree to the privacy policy and terms of service',
            emailError: 'Please enter a valid email address',
            successTitle: 'Thank You!',
            successSubtitle: 'Your message has been sent successfully',
            errorTitle: 'Error'
        },
        fallbackImageStyle: 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);'
    };

    // Extract DOM-configured values, falling back to defaults
    const extractedBackgroundImage = block.querySelector(':scope > div:nth-child(1) img')?.src;
    const extractedTitle = block.querySelector(':scope > div:nth-child(2)')?.innerHTML;
    const extractedSubTitle = block.querySelector(':scope > div:nth-child(3) div')?.innerHTML;
    const extractedButtonText = block.querySelector(':scope > div:nth-child(4) p')?.textContent;

    const backgroundImage = extractedBackgroundImage?.trim() || defaults.backgroundImage;
    const title = extractedTitle?.trim() || defaults.title;
    const subTitle = extractedSubTitle?.trim() || defaults.subTitle;
    const buttonText = extractedButtonText?.trim() || defaults.buttonText;

    // 1️⃣ Load reCAPTCHA and keep the siteKey
    let siteKey = '';
    try {
        siteKey = await loadGoogleRecaptcha();
        console.log('[contacts-form.js] › reCAPTCHA ready, siteKey:', siteKey);
    } catch (error) {
        console.warn('[contacts-form.js] › reCAPTCHA loading failed:', error);
    }

    // Build the section
    const sectionContainer = document.createElement('section');
    sectionContainer.className = 'flex flex-col justify-between lg:flex-row-reverse';

    // Helper for fallback image
    const getImageElement = (imageSrc) => {
      if (!imageSrc || imageSrc.trim() === '') {
        return `<div class="w-full 2xl:w-1/2 flex items-center justify-center" style="${defaults.fallbackImageStyle}">
              <div class="text-white text-xl font-semibold">Contact Image</div>
          </div>`;
      }
      return `<div class="w-full 2xl:w-1/2">
          <img
              class="h-full w-full object-cover"
              src="${imageSrc}"
              alt="Contact form background"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          />
      </div>`;
    };

    // Inject HTML
    sectionContainer.innerHTML = `
        <div class="container-layout-padding">
            <div class="flex 2xl:mt-5 text-center lg:text-start flex-col items-center gap-6 2xl:items-start">
                <div class="text-3xl prose-em:font-joyful prose-em:text-7xl lg:prose-em:text-9xl text-primary lg:text-7xl">
                    ${title}
                </div>
                <span class="text-base lg:text-xl">
                    ${subTitle}
                </span>
            </div>
            <form
                id="form"
                class="flex w-full flex-col items-center gap-8 mt-10 2xl:items-start"
            >
                <div class="flex flex-col md:flex-row gap-8 justify-between w-full">   
                    <input
                        id="name"
                        type="text"
                        placeholder="${defaults.placeholders.name}"
                        class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 focus-visible:translate-x-1 focus-visible:outline-0"
                        required
                    />
                    <input
                        id="surname"
                        type="text"
                        placeholder="${defaults.placeholders.surname}"
                        class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 focus-visible:translate-x-1 focus-visible:outline-0"
                        required
                    />
                </div>
                <div class="flex flex-col md:flex-row gap-8 justify-between w-full">
                    <input
                        id="email"
                        type="email"
                        placeholder="${defaults.placeholders.email}"
                        class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 focus-visible:translate-x-1 focus-visible:outline-0"
                        required
                    />
                    <input
                        id="phone"
                        type="tel"
                        placeholder="${defaults.placeholders.phone}"
                        class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 focus-visible:translate-x-1 focus-visible:outline-0"
                        required
                    />
                </div>
                <select
                    id="type"
                    class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 focus-visible:translate-x-1 focus-visible:outline-0 bg-transparent"
                    required
                >
                    <option value="" disabled selected>${defaults.placeholders.type}</option>
                    <option value="sending-official-material">Sending official material</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="careers">Careers</option>
                    <option value="foundation-activity">Foundation activity</option>
                    <option value="donation-process">Donation process</option>
                    <option value="personal-data">Personal data</option>
                    <option value="payment-process">Payment process</option>
                    <option value="privacy">Privacy</option>
                    <option value="tax-certificates-website-support">Tax Certificates Website support</option>
                    <option value="unsubscribe">Unsubscribe</option>
                    <option value="others">Others</option>
                </select>
                <select
                    id="languages"
                    class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 focus-visible:translate-x-1 focus-visible:outline-0 bg-transparent"
                    required
                >
                    <option value="" disabled selected>${defaults.placeholders.language}</option>
                    <option value="esp">Spanish</option>
                    <option value="fra">French</option>
                    <option value="ger">German</option>
                    <option value="ita">Italian</option>
                    <option value="eng">English</option>
                    <option value="others">Other</option>
                </select>
                <textarea
                    id="description"
                    rows="3"
                    placeholder="${defaults.placeholders.description}"
                    class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 focus-visible:translate-x-1 focus-visible:outline-0 resize-none"
                    required
                ></textarea>
                <div class="flex flex-col mt-10 gap-12 2xl:gap-4">
                    <div class="w-full 2xl:w-2/3 flex flex-col gap-2">
                        <div class="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="marketing-consent"
                                class="size-4 min-w-4 checked:bg-primary border-primary accent-primary cursor-pointer"
                            />
                            <label for="marketing-consent" class="text-sm font-light cursor-pointer">
                                ${defaults.labels.marketingConsent}
                            </label>
                        </div>
                        <div class="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="policy"
                                required
                                class="size-4 min-w-4 checked:bg-primary border-primary accent-primary cursor-pointer"
                            />
                            <label for="policy" class="text-sm font-light cursor-pointer">
                                ${defaults.labels.policy}
                            </label>
                        </div>
                    </div>
                    <div id="box-error" class="border hidden border-b-red-400 rounded-lg p-2 text-red-400 items-center justify-center gap-2 w-full"></div>
                    <!--CUSTOM BUTTON-->
                    <custom-button
                        type="submit"
                        class="w-full mt-10"
                        btnClass="w-full md:w-fit"
                        color="primary"
                    >
                        ${buttonText}
                    </custom-button>
                </div>
            </form>
            <div id="container-popup-form" class="hidden mt-5"></div>
        </div>
        ${getImageElement(backgroundImage)}
    `;

    // 2️⃣ Wire up form submission with reCAPTCHA
    const form = sectionContainer.querySelector('#form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const boxError = sectionContainer.querySelector('#box-error');
            const emailInput = sectionContainer.querySelector('#email');
            // Other inputs omitted for brevity...
            // Validate email
            if (!validateEmail(emailInput.value)) {
                boxError.textContent = defaults.labels.emailError;
                boxError.classList.remove('hidden');
                return;
            }
            boxError.classList.add('hidden');

            // Build payload
            const data = {
                first_name: sectionContainer.querySelector('#name').value.trim(),
                "00N7R000009Jcc5": sectionContainer.querySelector('#name').value.trim(),
                "00N7R000009JccA": sectionContainer.querySelector('#surname').value.trim(),
                email: emailInput.value.trim(),
                phone: sectionContainer.querySelector('#phone').value.trim(),
                type: sectionContainer.querySelector('#type').value,
                description: sectionContainer.querySelector('#description').value.trim(),
                "00N7R000009JccK": sectionContainer.querySelector('#marketing-consent').checked,
                "00N7R000009JccF": sectionContainer.querySelector('#languages').value,
                recordType: sectionContainer.querySelector('#type').value === 'unsubscribe'
                    ? '0127R0000007LeP'
                    : '0127R0000007LeR',
                "00N7R000009JccP": sectionContainer.querySelector('#policy').checked,
                origin: "Web Contact Us"
            };

            // 3️⃣ Guard: ensure grecaptcha + siteKey
            if (!(window.grecaptcha && window.grecaptcha.enterprise && siteKey)) {
                console.error('[contacts-form.js] › grecaptcha.enterprise or siteKey missing');
                const popup = sectionContainer.querySelector('#container-popup-form');
                form.classList.add('hidden');
                popup.classList.remove('hidden');
                popup.innerHTML = `
                  <popup-box extraClass="text-black"
                             isSuccess="false"
                             title="Security verification failed. Please try again later.">
                  </popup-box>`;
                return;
            }

            // 4️⃣ Execute reCAPTCHA v3
            grecaptcha.enterprise.execute(siteKey, { action: 'contact_form_submit' })
                .then((token) => {
                    console.log('[contacts-form.js] › reCAPTCHA token received');
                    data['g-recaptcha-response'] = token;
                    // 5️⃣ Finally, submit the case
                    createCase(
                        data,
                        () => {
                            const popup = sectionContainer.querySelector('#container-popup-form');
                            form.classList.add('hidden');
                            popup.classList.remove('hidden');
                            popup.innerHTML = `
                              <popup-box extraClass="text-black"
                                         isSuccess="true"
                                         title="${defaults.labels.successTitle}"
                                         subtitle="${defaults.labels.successSubtitle}">
                              </popup-box>`;
                        },
                        (error) => {
                            const popup = sectionContainer.querySelector('#container-popup-form');
                            form.classList.add('hidden');
                            popup.classList.remove('hidden');
                            popup.innerHTML = `
                              <popup-box extraClass="text-black"
                                         isSuccess="false"
                                         title="${error || defaults.labels.errorTitle}">
                              </popup-box>`;
                        }
                    );
                })
                .catch((err) => {
                    console.error('[contacts-form.js] › reCAPTCHA exec failed:', err);
                    const popup = sectionContainer.querySelector('#container-popup-form');
                    form.classList.add('hidden');
                    popup.classList.remove('hidden');
                    popup.innerHTML = `
                      <popup-box extraClass="text-black"
                                 isSuccess="false"
                                 title="Verification failed. Please try again later.">
                      </popup-box>`;
                });
        });
    } else {
        console.error('Contact form: Form element not found after creation');
    }

    // 6️⃣ Replace the block
    block.textContent = '';
    block.append(sectionContainer);
}
