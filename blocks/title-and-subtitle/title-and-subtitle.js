import {buildHeight} from "../../scripts/utils.js";

export default function decorate(block) {
    const backgroundImage = block.querySelector(":scope > div:nth-child(1) div img")?.src;
    const title = block.querySelector(":scope > div:nth-child(2) div")?.innerHTML
    const subTitle = block.querySelector(":scope > div:nth-child(3) div")?.innerHTML
    const mobileHeight = block.querySelector(":scope > div:nth-child(4) div")?.textContent;
    const desktopHeight = block.querySelector(":scope > div:nth-child(5) div")?.textContent;


    const containerSection = document.createElement("section");
    containerSection.className = `${buildHeight(mobileHeight, desktopHeight)} flex items-center justify-center container-layout-padding bg-orange-100 bg-no-repeat bg-cover bg-center`
    containerSection.style.backgroundImage = `url('${backgroundImage}')`;

    containerSection.innerHTML = `
    <div class="flex gap-4 flex-col ${title ? 'md:flex-row md:items-start text-center md:text-start' : 'items-center'} ">
    ${title && `<div class="md:w-1/2 text-primary text-3xl prose-em:font-joyful md:text-7xl">${title}</div>`}
    ${subTitle && `<div class="font-light prose-p:py-2 ${title ? 'md:w-1/2 md:text-start' : 'w-full text-center text-lg md:text-xl lg:text-2xl italic max-w-6xl'} ${backgroundImage ? 'text-white' : 'text-current'}">${subTitle}</div>`}
    </div>
    `

    block.textContent = "";
    block.append(containerSection);

}
