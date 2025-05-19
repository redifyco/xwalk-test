import '../../scripts/customTag.js'
import {getBlogPreviewData} from "../../scripts/utils.js";

export default async function decorate(block) {
    const title = block.querySelector(':scope > div:nth-child(1) div')?.innerHTML || ''
    const buttonText = block.querySelector(':scope > div:nth-child(2) div p')?.textContent || ''
    const buttonLink = block.querySelector(':scope > div:nth-child(3) div a')?.href || ''
    const cardStyle = block.querySelector(':scope > div:nth-child(4) div p')?.textContent || 'primary'
    const apiString = block.querySelector(':scope > div:nth-child(5) div p')?.textContent || ''
    const itemsToShow = Number(block.querySelector(':scope > div:nth-child(6) div p')?.textContent) || 3

    const resultData = await getBlogPreviewData(apiString, itemsToShow)
    if (!resultData) return

    const extractTagsByType = (pageType, type) => {
        return pageType.split(',')
            .map(item => item.trim())
            .filter(item => item.toLowerCase().includes(type))
    };

    const sectionContainer = document.createElement('section');
    sectionContainer.className = ''

    sectionContainer.innerHTML = `
      <section class="flex flex-col items-center justify-center gap-8 px-4 pb-14 lg:gap-20 lg:px-20 lg:py-14">
        <div class="text-primary prose-em prose-em:lg:text-8xl prose-em:font-joyful text-center text-3xl uppercase lg:text-7xl">
          ${title}
        </div>
        <div class="scrollbar scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-track-gray-300 flex max-w-full justify-start gap-6 overflow-x-scroll pb-5 lg:flex-wrap lg:justify-center">
          ${resultData.data?.length > 0 && resultData.data.map((item, index) => {
        const pageTypesObject = {
            focusAreas: extractTagsByType(item.pageType, 'msc-foundation:focus-area'),
            status: extractTagsByType(item.pageType, 'msc-foundation:status')
        };

        return `
            <article-card 
              variant="${cardStyle}"
              subTitle="${item.description || ''}" 
              title="${item.title || ''}" 
              topLabel="${pageTypesObject.status}"
              icons="${pageTypesObject.focusAreas}"
              backgroundImage="${item.thumbImg}"
              href="${item.path || ''}"
              >
            </article-card>
          `
    }).join('')}
        <!--CUSTOM BUTTON-->
        </div>
        <custom-link href="${buttonLink}">${buttonText}</custom-link>
      </section>
    `

    block.textContent = ''
    block.append(sectionContainer)

}
