export default async function decorate(block) {
    const backgroundImage = block.querySelector(':scope > div:nth-child(1) img')?.src
    const title = block.querySelector(':scope > div:nth-child(2) p')?.textContent
    const subTitle = block.querySelector(':scope > div:nth-child(3) div')?.innerHTML
    const buttonText = block.querySelector(':scope > div:nth-child(4) p ')?.textContent
    const buttonLink = block.querySelector(':scope > div:nth-child(5) a ')?.href

    const sectionContainer = document.createElement('section')
    sectionContainer.className = 'bg-secondary flex flex-col lg:flex-row'


    sectionContainer.innerHTML = `
      <div
        class="flex w-full justify-center flex-col px-4 py-14 lg:gap-16 2xl:w-1/2 2xl:px-16"
      >
        <div class="flex flex-col items-center gap-6 2xl:items-start">
          <h2 class="text-3xl text-white uppercase lg:text-7xl">
          ${title}
          </h2>
          <span class="text-base text-white lg:text-xl 2xl:w-1/2">
          ${subTitle}
          </span>
        </div>
        <form
          class="flex w-full flex-col items-center gap-4 text-white 2xl:items-start 2xl:p-10"
        >
          <label for="field1"></label>
          <input
            id="field1"
            type="text"
            placeholder="*Name..."
            class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 placeholder:text-white/90 focus-visible:translate-x-1 focus-visible:outline-0"
          />
          <label for="field2"></label>
          <input
            id="field2"
            type="text"
            placeholder="*Surname..."
            class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 placeholder:text-white/90 focus-visible:translate-x-1 focus-visible:outline-0"
          />
          <label for="field3"></label>
          <input
            id="field3"
            type="text"
            placeholder="*Email..."
            class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 placeholder:text-white/90 focus-visible:translate-x-1 focus-visible:outline-0"
          />
          <label for="field4"></label>
          <input
            id="field4"
            type="text"
            placeholder="*Language..."
            class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 placeholder:text-white/90 focus-visible:translate-x-1 focus-visible:outline-0"
          />
          <!--CUSTOM BUTTON-->
          <custom-link className="mt-10" color="white" href="${buttonLink}">${buttonText}</custom-link>
        </form>
      </div>
      <div class="w-full 2xl:w-1/2">
        <img
          class="h-full w-full object-cover"
          src="${backgroundImage}"
          alt=""
        />
      </div>
    `

    block.textContent = ''
    block.append(sectionContainer)

}
