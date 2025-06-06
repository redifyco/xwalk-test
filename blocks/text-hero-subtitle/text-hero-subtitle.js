export default function decorate(block) {
    const data = {
        backgroundImage: block.querySelector(":scope > div:nth-child(1) div img")?.src || "",
        heroTitle: block.querySelector(":scope > div:nth-child(2) p")?.textContent || "",
        isCenteredBox: block.querySelector(":scope > div:nth-child(3) p")?.textContent === 'true',
        headingSubtitleBox: block.querySelector(":scope > div:nth-child(4)")?.innerHTML || '',
        contentSubtitleBox: block.querySelector(":scope > div:nth-child(5)")?.innerHTML || ''
    };


    const containerSection = document.createElement("section");
    containerSection.className = !data.backgroundImage && 'bg-grey-100'

    containerSection.innerHTML = `
        <div class="flex flex-col">
            <div 
                class="relative h-[600px] flex md:justify-center items-end md:items-center justify-start bg-center bg-cover bg-no-repeat w-full" 
                style="background-image: url('${data.backgroundImage}')"
            >
                <h2 class="font-medium z-10 text-5xl pl-4 pb-10 md:p-0 md:text-8xl uppercase text-white">
                    ${data.heroTitle}
                </h2>
                <div class="absolute inset-0 bg-black/20"></div>
            </div>
            <div class="container-layout-padding flex ${data.isCenteredBox ? 'flex-col text-center items-center' : 'flex-col lg:flex-row items-center text-center lg:items-start lg:text-start lg:justify-between'} mx-auto">
                ${data.headingSubtitleBox && `<div class="text-3xl lg:text-7xl text-primary prose-em:font-joyful font-medium mb-8">${data.headingSubtitleBox}</div>`}
                ${data.contentSubtitleBox && `<div class="${data.isCenteredBox ? 'lg:w-9/12 w-full italic text-lg lg:text-2xl' : 'lg:w-8/12 w-full text-lg lg:text-xl'}">${data.contentSubtitleBox}</div>`}
            </div>
        </div>
    `;

    block.textContent = "";
    block.append(containerSection);
}
