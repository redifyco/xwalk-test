import '../../scripts/customTag.js'
import {getProgrammesPages} from "../../scripts/utils.js";

export default async function decorate(block) {
    const {data} = await getProgrammesPages()
    const title = block.querySelector(':scope > div:nth-child(1) div p')?.textContent || ''
    const isLoadMoreButton = block.querySelector(':scope > div:nth-child(2) div p')?.textContent === 'true'
    const buttonText = block.querySelector(':scope > div:nth-child(3) div p')?.textContent || ''
    const buttonLink = block.querySelector(':scope > div:nth-child(4) div a')?.href || ''
    const itemsToShow = Number(block.querySelector(':scope > div:nth-child(5) div p')?.textContent) || 3
    const cardStyle = block.querySelector(':scope > div:nth-child(6) div p')?.textContent || 'primary'

    console.log('resultData', data)
    

    const sectionContainer = document.createElement('section');
    sectionContainer.className = ''

    sectionContainer.innerHTML = `
      <section class="flex flex-col items-center justify-center gap-8 px-4 pb-14 lg:gap-32 lg:px-20 lg:py-14">
        <h2 class="text-primary text-center text-3xl uppercase lg:text-7xl">
          ${title}
        </h2>
        <!--RELATED PROGRAMMES-->
        <div class="scrollbar scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-track-gray-300 flex max-w-full justify-start gap-6 overflow-x-scroll pb-5 lg:flex-wrap lg:justify-center">
          ${data.length > 0 && data.map((item, index) => `
            <article-card 
              variant="${cardStyle}"
              subTitle="${item.subTitle || ''}" 
              title="${item.title || ''}" 
              topLabel="${item.topLabel || ''}"
              icons="${item.icons || []}"
              backgroundImage="${item.thumbImg || ''}"
              date="${item.date || ''}"
              href="${item.href || ''}"
              >
            </article-card>
          `).join('')}
        </div>
        <!--CUSTOM BUTTON-->
        ${isLoadMoreButton ?
        `<custom-button>Load More</custom-button>`
        : `<custom-link href="${buttonLink}">${buttonText}</custom-link>`
    }
      </section>
    `

    block.textContent = ''
    block.append(sectionContainer)

}
