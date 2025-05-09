export default function decorate(block) {
    const backgroundImage = block.querySelector(":scope > div:nth-child(1) div img")?.src;
    const title = block.querySelector(":scope > div:nth-child(2) div")?.innerHTML
    const subTitle = block.querySelector(":scope > div:nth-child(3) div")?.innerHTML

    const containerSection = document.createElement("section");
    containerSection.className = `flex gap-4 flex-col bg-no-repeat bg-cover bg-center container-layout-padding ${title ? 'md:flex-row md:items-start' : 'items-center'}`
    containerSection.style.backgroundImage = `url('${backgroundImage}')`;

    containerSection.innerHTML = `
    ${title && `<div class="md:w-1/2 text-primary text-3xl prose-em:font-joyful md:text-7xl">${title}</div>`}
    ${subTitle && `<div class="font-light prose-p:py-2 ${title ? 'md:w-1/2 md:text-start' : 'w-full text-center text-2xl italic max-w-6xl'} ${backgroundImage ? 'text-white' : 'text-current'}">${subTitle}</div>`}
    `

    block.textContent = "";
    block.append(containerSection);

}
