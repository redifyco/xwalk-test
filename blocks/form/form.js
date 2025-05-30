import '../../scripts/customTag.js'
import {createLead} from "../../scripts/utils.js";


export default async function decorate(block) {
    const backgroundImage = block.querySelector(':scope > div:nth-child(1) img')?.src
    const title = block.querySelector(':scope > div:nth-child(2)')?.innerHTML
    const subTitle = block.querySelector(':scope > div:nth-child(3) div')?.innerHTML
    const buttonText = block.querySelector(':scope > div:nth-child(4) p ')?.textContent


    const sectionContainer = document.createElement('section')
    sectionContainer.className = 'bg-secondary relative flex flex-col lg:flex-row'


    sectionContainer.innerHTML = `
      <div
        class="flex w-full justify-center flex-col  lg:gap-16 2xl:w-1/2 2xl:px-16 container-layout-padding"
      >
        <div class="flex flex-col items-center gap-6 2xl:items-start">
          <div class="text-3xl prose-em:font-joyful prose-em:text-7xl lg:prose-em:text-9xl  text-white lg:text-7xl">
          ${title}
          </div>
          <span class="text-base text-white text-center lg:text-start lg:text-xl 2xl:w-1/2">
          ${subTitle}
          </span>
        </div>
        <form
        id="form"
          class="flex w-full flex-col items-center gap-8 text-white mt-20 lg:mt-0 2xl:items-start 2xl:p-10"
        >
          <input
            id="first_name"
            type="text"
            required
            placeholder="*Name..."
            class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 placeholder:text-white/90 focus-visible:translate-x-1 focus-visible:outline-0"
          />
          <input
            id="last_name"
            type="text"
            required
            placeholder="*Surname..."
            class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 placeholder:text-white/90 focus-visible:translate-x-1 focus-visible:outline-0"
          />
          <input
            id="email"
            type="text"
            required
            placeholder="*Email..."
            class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 placeholder:text-white/90 focus-visible:translate-x-1 focus-visible:outline-0"
          />
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
          <div class="flex w-full items-center gap-2">
            <input
              type="checkbox"
              id="marketing-consent"
              required
              checked
              class="size-4 min-w-4 checked:bg-primary border-primary accent-primary cursor-pointer"
            />
            <label for="marketing-consent" class="text-sm font-light cursor-pointer">
              Marketing consent
            </label>
          </div>
            <div id="box-error" class="border hidden border-b-red-400 rounded-lg p-2 text-red-400 items-center justify-center gap-2 w-full">
          </div>
          <!--CUSTOM BUTTON-->
          <custom-button
          class="w-full mt-10"
          btnClass="w-full md:w-fit"
            color="white"
            id="custom-button-form"
          >
            ${buttonText}
          </custom-button>
        </form>
        <popup-box id="popup-box" isSuccess="true" class="hidden"></popup-box>
      </div>
      <div class="w-full 2xl:w-1/2">
        <img
          class="h-full w-full object-cover"
          src="${backgroundImage}"
          alt=""
        />
      </div>
    `


    const validateEmail = (email) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    sectionContainer.querySelector('form').addEventListener('submit', async (e) => {
        e.preventDefault()
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

        emailInput.style.borderColor = '';
        emailInput.removeAttribute('title');

        const data = {
            "first_name": sectionContainer.querySelector('#first_name').value,
            "last_name": sectionContainer.querySelector('#last_name').value,
            "email": emailInput.value,
            "00NVj000001XF69": sectionContainer.querySelector('#languages').value,
            "lead_source": 'Web',
            "00NVj000003rpfN": sectionContainer.querySelector('#marketing-consent').checked
        }

        createLead(data, (msg) => {
            console.log('OnSuccess', msg)
            const popupBox = sectionContainer.querySelector('#popup-box');
            const form = sectionContainer.querySelector('#form');
            form.classList.toggle('hidden');
            popupBox.classList.toggle('hidden');
            popupBox.setAttribute('isSuccess', 'true');
            popupBox.setAttribute('title', 'Thank you for your interest');
            popupBox.setAttribute('subtitle', 'We will contact you soon');
        }, error => {
            console.error('OnError', error)
        })
    })

    block.textContent = ''
    block.append(sectionContainer)
}
