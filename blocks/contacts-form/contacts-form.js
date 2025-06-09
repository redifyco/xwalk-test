import '../../scripts/customTag.js'
import {createCase, loadGoogleRecaptcha, validateEmail} from "../../scripts/utils.js";

export default async function decorate(block) {
    const backgroundImage = block.querySelector(':scope > div:nth-child(1) img')?.src
    const title = block.querySelector(':scope > div:nth-child(2)')?.innerHTML
    const subTitle = block.querySelector(':scope > div:nth-child(3) div')?.innerHTML
    const buttonText = block.querySelector(':scope > div:nth-child(4) p ')?.textContent

    await loadGoogleRecaptcha();

    const sectionContainer = document.createElement('section')
    sectionContainer.className = 'flex flex-col justify-between lg:flex-row-reverse'


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
            placeholder="*Name..."
            class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200  focus-visible:translate-x-1 focus-visible:outline-0"
          />
          <input
            id="surname"
            type="text"
            placeholder="*Surname..."
            class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 focus-visible:translate-x-1 focus-visible:outline-0"
          />
</div>
<div class="flex flex-col md:flex-row gap-8 justify-between w-full">
          <input
            id="email"
            type="text"
            placeholder="*Email..."
            class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 focus-visible:translate-x-1 focus-visible:outline-0"
          />
          <input
            id="phone"
            type="text"
            placeholder="*Phone..."
            class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 focus-visible:translate-x-1 focus-visible:outline-0"
          />
          </div>
         <select
            id="type"
            class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200  focus-visible:translate-x-1 focus-visible:outline-0 bg-transparent"
          >
            <option value="" disabled selected>*Type of request...</option>
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
            class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200  focus-visible:translate-x-1 focus-visible:outline-0 bg-transparent"
          >
            <option value="" disabled selected>*Language...</option>
            <option value="esp">Esp</option>
            <option value="fra">Fra</option>
            <option value="ger">Ger</option>
            <option value="ita">Ita</option>
            <option value="eng">Eng</option>
            <option value="others">Other</option>
          </select>
          <textarea
            id="description"
            rows="3"
            placeholder="*Description of your Request..."
            class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 focus-visible:translate-x-1 focus-visible:outline-0 resize-none"
          ></textarea>
          <div class="flex flex-col mt-10 gap-12 2xl:gap-4">
          <div class="w-full 2xl:w-2/3  flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              id="marketing-consent"
              class="size-4 min-w-4 checked:bg-primary border-primary accent-primary cursor-pointer"
            />
            <label for="marketing-consent" class="text-sm font-light cursor-pointer">
              Marketing consent
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
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus atque consequatur culpa error fuga illo nam nostrum rerum sit voluptate.
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
        <div class="w-full 2xl:w-1/2">
        <img
          class="h-full w-full object-cover"
          src="${backgroundImage}"
          alt=""
        />
      </div>
    `

    sectionContainer.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        const boxError = sectionContainer.querySelector('#box-error');
        const emailInput = sectionContainer.querySelector('#email');

        if (!validateEmail(emailInput.value)) {
            boxError.classList.remove('hidden');
            boxError.classList.add('flex');
            boxError.innerHTML = `<ion-icon size="large" name="information-circle"></ion-icon> Please enter a valid email address`;
            return;
        } else {
            boxError.classList.remove('flex');
            boxError.classList.add('hidden');
        }
        const data = {
            first_name: sectionContainer.querySelector('#name').value || '',
            last_name: sectionContainer.querySelector('#surname').value || '',
            email: sectionContainer.querySelector('#email').value || '',
            phone: sectionContainer.querySelector('#phone').value || '',
            type: sectionContainer.querySelector('#type').value || '',
            description: sectionContainer.querySelector('#description').value || '',
            "00N7R000009JccK": sectionContainer.querySelector('#marketing-consent').checked,
            "00N7R000009JccF": sectionContainer.querySelector('#languages').value,
            "recordType": sectionContainer.querySelector('#type').value === 'unsubscribe' ? '0127R0000007LeP' : '0127R0000007LeR',
            "00N7R000009JccP": sectionContainer.querySelector('#policy').checked
        }


        createCase(data, msg => {
            const containerPopup = sectionContainer.querySelector('#container-popup-form');
            const form = sectionContainer.querySelector('#form');
            form.classList.toggle('hidden');
            containerPopup.classList.remove('hidden')
            containerPopup.innerHTML = `<popup-box extraClass="text-black" class="block" isSuccess="true" subtitle="Subtitle" title="Title"></popup-box>`
        }, error => {
            const containerPopup = sectionContainer.querySelector('#container-popup');
            const form = sectionContainer.querySelector('#form');
            form.classList.toggle('hidden');
            containerPopup.classList.remove('hidden')
            containerPopup.innerHTML = `<popup-box extraClass="text-black" class="block" isSuccess="false" title="${error}"></popup-box>`
        })
    })

    block.textContent = ''
    block.append(sectionContainer)

}
