import {buildHeight, returnBoolean} from "../../scripts/utils.js";
import "../../scripts/customTag.js";


export default async function decorate(block) {
    const backgroundImage = block.querySelector(':scope > div:nth-child(1) img')?.src || ''
    const title = block.querySelector(':scope > div:nth-child(2) div')?.innerHTML
    const subTitle = block.querySelector(':scope > div:nth-child(3)')?.innerHTML || ''
    const isSocialBox = returnBoolean(block, 4)
    const isCenteredTitle = returnBoolean(block, 5)
    const facebookLink = block.querySelector(":scope > div:nth-child(6) a")?.href;
    const linkedinLink = block.querySelector(":scope > div:nth-child(7) a")?.href;
    const instagramLink = block.querySelector(":scope > div:nth-child(8) a")?.href;
    const youtubeLink = block.querySelector(":scope > div:nth-child(9) a")?.href;
    const mobileHeight = block.querySelector(":scope > div:nth-child(10) p")?.textContent;
    const desktopHeight = block.querySelector(":scope > div:nth-child(11) p")?.textContent;
    const calculatedSectionHeight = buildHeight(mobileHeight, desktopHeight)


    const containerSection = document.createElement('section')
    containerSection.className = 'flex flex-col bg-cover bg-center bg-no-repeat text-white'
    containerSection.style.backgroundImage = `url('${backgroundImage}')`

    containerSection.innerHTML = `
        <div class="relative z-10 flex w-full flex-col justify-end gap-3 px-4 pb-14 lg:justify-center xl:px-16 xl:py-11 ${calculatedSectionHeight}">
            ${isCenteredTitle
        ? `
                    <div class="font-medium flex justify-center z-10 text-8xl uppercase text-white">
                        ${title}
                    </div>
                `
        : `
                    <div class="text-5xl flex font-semibold lg:text-[130px] 2xl:text-8xl 2xl:text-[180px] justify-start">
                        ${title}
                    </div>
                `
    }
    
            <div class="w-3/4 text-sm lg:text-xl 2xl:w-2/3 2xl:text-2xl">
                ${subTitle}
            </div>
    
            ${isSocialBox
        ? `
                    <div class="absolute right-16 bottom-16 hidden h-auto gap-2 lg:flex">
                        <social-icons 
                            facebook="${facebookLink}" 
                            instagram="${instagramLink}" 
                            linkedin="${linkedinLink}" 
                            youtube="${youtubeLink}">
                        </social-icons>
                    </div>
                `
        : ''
    }
        </div>
    `
    block.textContent = ''
    block.append(containerSection)

}
