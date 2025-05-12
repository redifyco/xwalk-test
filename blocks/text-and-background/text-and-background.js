import {buildHeight, returnBoolean} from "../../scripts/utils.js";
import '../../scripts/customTag.js'

export default async function decorate(block) {
    const backgroundImage = block.querySelector(":scope > div:nth-child(1) div img")?.src || "";
    const title = block.querySelector(":scope > div:nth-child(2) div")?.innerHTML;
    const subTitle = block.querySelector(":scope > div:nth-child(3) div")?.innerHTML;
    const buttonText = block.querySelector(":scope > div:nth-child(4) div p")?.textContent || "";
    const buttonLink = block.querySelector(":scope > div:nth-child(4) div p a")?.href || "";
    const invertedTitlePosition = returnBoolean(block, 5)
    const isPrimaryColor = returnBoolean(block, 6)
    const mobileHeight = block.querySelector(":scope > div:nth-child(7) div p")?.textContent;
    const desktopHeight = block.querySelector(":scope > div:nth-child(8) div p")?.textContent;


    const containerSection = document.createElement("section");
    containerSection.className = `
    flex items-center justify-center bg-center bg-cover bg-no-repeat text-white text-center px-4 md:text-start md:px-10 lg:px-20 xl:px-26 2xl:px-40 ${buildHeight(mobileHeight, desktopHeight)}`;
    containerSection.style.backgroundImage = `url(${backgroundImage})`;

    containerSection.innerHTML = `
        <div class="flex flex-col md:justify-between gap-10 w-full ${invertedTitlePosition ? 'md:flex-row-reverse' : 'md:flex-row'}">
            <div class="text-6xl prose-em:font-joyful md:text-8xl ${isPrimaryColor ? 'text-primary' : 'text-white'}">
                ${title}
            </div>
            <div class="flex flex-col gap-4 md:translate-y-40 md:w-1/2">
                <div class="text-sm md:text-2xl prose-p:py-2 font-light ${isPrimaryColor ? 'text-black' : 'text-white'}">
                    ${subTitle}
                </div>
                <custom-link className="mt-4" color="${isPrimaryColor ? 'primary' : 'white'}" href="${buttonLink}">
                    ${buttonText}
                </custom-link>
            </div>
        </div>
    `;

    block.textContent = "";
    block.append(containerSection);
}
