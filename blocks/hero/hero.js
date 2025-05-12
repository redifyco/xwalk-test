import {buildHeight, returnBoolean} from "../../scripts/utils.js";
import "../../scripts/customTag.js";


export default async function decorate(block) {
    const backgroundImage = block.querySelector(':scope > div:nth-child(1) img')?.src || ''
    const title = block.querySelector(':scope > div:nth-child(2) div')?.innerHTML
    const subTitle = block.querySelector(':scope > div:nth-child(3)')?.innerHTML || ''
    const isSocialBox = returnBoolean(block, 4)
    const isCenteredTitle = returnBoolean(block, 5)
    const isArrowDown = returnBoolean(block, 6)
    const facebookLink = block.querySelector(":scope > div:nth-child(7) a")?.href;
    const linkedinLink = block.querySelector(":scope > div:nth-child(8) a")?.href;
    const instagramLink = block.querySelector(":scope > div:nth-child(9) a")?.href;
    const youtubeLink = block.querySelector(":scope > div:nth-child(10) a")?.href;
    const mobileHeight = block.querySelector(":scope > div:nth-child(11) p")?.textContent;
    const desktopHeight = block.querySelector(":scope > div:nth-child(12) p")?.textContent;
    const calculatedSectionHeight = buildHeight(mobileHeight, desktopHeight)


    const containerSection = document.createElement('section')
    containerSection.className = 'flex flex-col bg-cover bg-center bg-no-repeat text-white'
    containerSection.style.backgroundImage = `url('${backgroundImage}')`

    containerSection.innerHTML = `
        <div class="relative z-10 flex w-full flex-col justify-end gap-3 px-4 pb-14 md:justify-center xl:px-16 xl:py-11 ${calculatedSectionHeight}">
            ${isCenteredTitle ? `
                <div class="font-medium prose-em:font-joyful flex justify-start text-start md:text-center md:justify-center z-10 text-5xl md:text-6xl lg:text-8xl uppercase text-white">
                    ${title}
                </div>
            ` : `
                <div class="text-5xl prose-em:font-joyful flex font-semibold lg:text-[130px] 2xl:text-8xl 2xl:text-[180px] justify-start">
                    ${title}
                </div>
            `}
            
            <div class="text-sm flex font-light lg:text-xl 2xl:text-2xl ${
        isCenteredTitle ? 'justify-start md:justify-center text-start md:text-center' : 'justify-start text-start'
    }">
                ${subTitle}
            </div>
            
            ${isSocialBox ? `
                <div class="absolute right-16 bottom-16 hidden h-auto gap-2 lg:flex">
                    <social-icons 
                        facebook="${facebookLink}" 
                        instagram="${instagramLink}" 
                        linkedin="${linkedinLink}" 
                        youtube="${youtubeLink}">
                    </social-icons>
                </div>
            ` : ''}
        ${isArrowDown ? ` <svg class="flex mt-10 justify-center w-full h-20 md:h-40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 105" fill="none">
            <path d="M38.5 101.855L74.416 65.9395L75.4766 67L38 104.477L37.7383 104.215L37.4766 104.477L0 67L1.06055 65.9395L37 101.879V0H38.5V101.855Z" fill="white"/>
        </svg>` : ''}
        </div>
    `
    block.textContent = ''
    block.append(containerSection)

}
