import '../../scripts/customTag.js'
import {getBlogPreviewData} from "../../scripts/utils.js";

export default async function decorate(block) {
    console.log('block', block)
    const title = block.querySelector(':scope > div:nth-child(1) div')?.innerHTML || ''
    const buttonText = block.querySelector(':scope > div:nth-child(2) div p')?.textContent || ''
    const buttonLink = block.querySelector(':scope > div:nth-child(3) div a')?.href || ''
    const cardStyle = block.querySelector(':scope > div:nth-child(4) div p')?.textContent || 'primary'
    const apiString = block.querySelector(':scope > div:nth-child(5) div p')?.textContent || ''
    const itemsToShow = Number(block.querySelector(':scope > div:nth-child(6) div p')?.textContent) || 3


    const sectionContainer = document.createElement('section');
    sectionContainer.className = 'container-layout-padding'

    sectionContainer.innerHTML = `
      
    `

    // block.textContent = ''
    // block.append(sectionContainer)

}
