import '../../scripts/customTag.js'

export default async function decorate(block) {
    const backgroundImage = block.querySelector(':scope > div:nth-child(1) img')?.src
    const title = block.querySelector(':scope > div:nth-child(2) p')?.textContent
    const subTitle = block.querySelector(':scope > div:nth-child(3) div')?.innerHTML
    const buttonText = block.querySelector(':scope > div:nth-child(4) p ')?.textContent
    const buttonLink = block.querySelector(':scope > div:nth-child(5) a ')?.href

    const sectionContainer = document.createElement('section')
    sectionContainer.className = 'flex flex-col lg:flex-row'


    sectionContainer.innerHTML = `
<div class="w-full h-[600px] lg:h-auto 2xl:w-1/2 bg-no-repeat object-cover bg-cover" style="background-image: url('${backgroundImage}');"></div>
      <div
        class="flex w-full justify-center flex-col px-4 py-14 lg:gap-8 2xl:w-1/2 2xl:px-16"
      >
        <div class="flex 2xl:mt-5 text-center lg:text-start flex-col items-center gap-6 2xl:items-start">
          <h2 class="text-3xl text-primary lg:-translate-x-60 uppercase lg:text-7xl">
          ${title}
          </h2>
          <span class="text-base lg:text-xl">
          ${subTitle}
          </span>
        </div>
        <form
          class="flex w-full flex-col items-center gap-4 2xl:items-start"
        >
          <label for="field1"></label>
          <input
            id="field1"
            type="text"
            placeholder="*Name..."
            class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200  focus-visible:translate-x-1 focus-visible:outline-0"
          />
          <label for="field2"></label>
          <input
            id="field2"
            type="text"
            placeholder="*Surname..."
            class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 focus-visible:translate-x-1 focus-visible:outline-0"
          />
          <label for="field3"></label>
          <input
            id="field3"
            type="text"
            placeholder="*Email..."
            class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 focus-visible:translate-x-1 focus-visible:outline-0"
          />
          <label for="fiel4"></label>
          <input
            id="field4"
            type="text"
            placeholder="*Phone..."
            class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 focus-visible:translate-x-1 focus-visible:outline-0"
          />
           <label for="field5"></label>
          <input
            id="field5"
            type="text"
            placeholder="*Type of request..."
            class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 focus-visible:translate-x-1 focus-visible:outline-0"
          />
          <label for="field5"></label>
          <textarea
            id="field5"
            rows="3"
            placeholder="*Description of your Request..."
            class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 focus-visible:translate-x-1 focus-visible:outline-0 resize-none"
          ></textarea>
          <div class="flex flex-col 2xl:flex-row justify-between mt-10 items-center gap-12 2xl:gap-4">
          <div class="w-full 2xl:w-2/3  flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              id="field5"
              required
              class="size-4 min-w-4 checked:bg-primary border-primary accent-primary cursor-pointer"
            />
            <label for="field5" class="text-sm font-light cursor-pointer">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem id impedit magni non obcaecati similique.
            </label>
          </div>
          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              id="field6"
              required
              class="size-4 min-w-4 checked:bg-primary border-primary accent-primary cursor-pointer"
            />
            <label for="field6" class="text-sm font-light cursor-pointer">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus atque consequatur culpa error fuga illo nam nostrum rerum sit voluptate.
            </label>
          </div>
          </div>
          <!--CUSTOM BUTTON-->
          <custom-link color="primary" href="${buttonLink}">${buttonText}</custom-link>
          </div>
        </form>
      </div>
    `

    block.textContent = ''
    block.append(sectionContainer)

}
