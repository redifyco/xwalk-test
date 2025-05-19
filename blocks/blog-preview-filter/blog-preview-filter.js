import '../../scripts/customTag.js'
import {getAllArticles, getBlogPreviewData, returnBoolean} from "../../scripts/utils.js";

export default async function decorate(block) {
    const title = block.querySelector(':scope > div:nth-child(1) div')?.innerHTML || ''
    const cardStyle = block.querySelector(':scope > div:nth-child(2) div p')?.textContent || 'primary'
    const apiString = block.querySelector(':scope > div:nth-child(3) div p')?.textContent || ''
    const itemsToShow = Number(block.querySelector(':scope > div:nth-child(4) div p')?.textContent) || 3
    const filterFocusArea = returnBoolean(block, 5)
    const filterDate = returnBoolean(block, 6)
    const filterCategory = returnBoolean(block, 7)


    const resultData = await getAllArticles('/programs-index.json')
    console.log('result', resultData)

    const sectionContainer = document.createElement('section');
    sectionContainer.className = 'container-layout-padding'

    sectionContainer.innerHTML = `
      
    `

    // block.textContent = ''
    // block.append(sectionContainer)

}
