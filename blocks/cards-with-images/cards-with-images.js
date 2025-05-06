import {processDivsToObjectCardsWithImages} from "../../scripts/utils.js";


export default function decorate(block) {
    const sectionTitle = block.querySelector(':scope > div:nth-child(1) div p').textContent || ''
    const sectionSubTitle = block.querySelector(':scope > div:nth-child(2) div p').textContent || ''
    const sectionButtonText = block.querySelector(':scope > div:nth-child(3) div p').textContent || ''
    const sectionButtonLink = block.querySelector(':scope > div:nth-child(4) div p a').href || ''
    const cards = Array.from(block.querySelectorAll(":scope > div:nth-child(n+5)"));
    const JSONCards = processDivsToObjectCardsWithImages(cards)

    const buildFlexReverseClass = styleString => styleString === 'titleOnBottom'

    const containerSection = document.createElement('section')
    containerSection.className = 'small-layout-padding bg-white bg-cover bg-center bg-no-repeat text-center lg:text-start'

    containerSection.innerHTML = `
     
      <h2 class="text-primary hidden w-9/12 xl:w-1/2 xl:block text-3xl uppercase lg:text-5xl xl:text-7xl xl:font-normal">
       ${sectionTitle}
      </h2>
      <div class="flex flex-col justify-between items-center xl:items-start gap-4 pb-10 lg:flex-row">
        <div class="flex lg:w-1/2 flex-col items-center gap-8 lg:items-start">
         <h2 class="text-primary block xl:hidden text-3xl uppercase lg:text-5xl xl:text-7xl xl:font-normal">
       ${sectionTitle}
      </h2>
          <p class="text-sm font-light lg:text-xl 2xl:w-9/12">
            ${sectionSubTitle}
          </p>
          <!--CUSTOM BUTTON-->
          <custom-link href="${sectionButtonLink}">${sectionButtonText}</custom-link>
        </div>
        <!--CARDS CONTAINER-->
        <div
          class="mt-3 w-fit gap-4 grid grid-cols-2 justify-items-center xl:flex xl:flex-nowrap xl:justify-center xl:gap-6"
        >
        ${JSONCards.length > 0 && JSONCards.map((card, index) => {
        const isFlexReverse = buildFlexReverseClass(card.style)
        const translationY = index % 2 === 0 ? 'xl:translate-y-28 hover:xl:translate-y-20' : 'xl:translate-y-0 hover:xl:-translate-y-10'

        return `
              <div
            class="vertical-card-container transition-all duration-1000 ease-in-out group relative ${translationY}"
            style="background-image: url('${card.image}')"
          >
            <div
              class="vertical-card-content black-gradient-from-bottom lg:flex-col ${isFlexReverse ? 'xl:flex-col-reverse xl:black-gradient-from-top' : 'xl:flex-col xl:black-gradient-from-bottom'}"
            >
              <div
                class="rounded-full xl:border xl:border-white xl:bg-white/30 xl:p-5"
              >
                <img
                  class="size-14"
                  src="${card.icon}"
                  alt=""
                />
              </div>
              <h6 class="text-lg font-semibold lg:text-xl 2xl:text-3xl transition-transform duration-700 ${isFlexReverse ? '' : 'group-hover:-translate-y-20'}">
                ${card.title}
              </h6>
              <div class="hidden xl:block absolute mx-2 p-2 bg-white/10 backdrop-blur-sm text-xs border border-white opacity-0 transition-all duration-1000 group-hover:opacity-100 ${isFlexReverse ? 'top-40' : 'bottom-10'}">${card.description}</div>
            </div>
          </div>
            `
    }).join('')}
        </div>
      </div>
    `

    block.textContent = ''
    block.append(containerSection)
}
