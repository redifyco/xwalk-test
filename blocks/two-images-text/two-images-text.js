import {returnBoolean} from "../../scripts/utils.js";

export default function decorate(block) {
    const title = block.querySelector(':scope > div:nth-child(1) div')?.innerHTML
    const description = block.querySelector(':scope > div:nth-child(2) div')?.innerHTML
    const isInvertedPosition = returnBoolean(block, 3)
    const maskImage1 = block.querySelector(':scope > div:nth-child(4) img')?.src
    const maskImage2 = block.querySelector(':scope > div:nth-child(5) img')?.src
    const fullWidthImage = block.querySelector(':scope > div:nth-child(6) img')?.src


    const sectionContainer = document.createElement('section')
    sectionContainer.className = "container-layout-padding"

    sectionContainer.innerHTML = `
        <div class="flex gap-4 lg:gap-32 justify-between box-border ${isInvertedPosition ? 'flex-row-reverse' : 'flex-row'}">
            <div class="flex flex-col gap-4 h-full lg:gap-16">
                <div class="text-3xl lg:text-start text-end text-primary prose-em:font-joyful lg:text-7xl">
                    ${title}
                </div>
                <div class="lg:hidden block">
                    <img class="w-full h-44 md:h-60 object-cover object-center" src="${fullWidthImage}" alt="">
                </div>
                <div class="font-light">${description}</div>
            </div>
            <div class="hidden justify-end lg:flex w-full gap-10">
                <img class="max-w-72 object-cover object-center ${isInvertedPosition ? '-translate-y-20' : 'translate-y-20'}" src="${maskImage1}" alt="">
                <img class="max-w-72 object-cover object-center  ${isInvertedPosition ? 'translate-y-20' : '-translate-y-20'}" src="${maskImage2}" alt="">
            </div>
        </div>
    `

    block.textContent = ''
    block.append(sectionContainer)

}
