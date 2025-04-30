export default function decorate(block) {
    console.log('block', block);
    const data = {
        backgroundImage: block.querySelector(":scope > div:nth-child(1) div img")?.src || "",
        heroTitle: block.querySelector(":scope > div:nth-child(2) p")?.textContent || "",
        isCenteredBox: block.querySelector(":scope > div:nth-child(3) p")?.textContent === 'true',
        headingSubtitleBox: block.querySelector(":scope > div:nth-child(4) p")?.textContent || '',
        contentSubtitleBox: block.querySelector(":scope > div:nth-child(5)") || '',
    }


    const containerSection = document.createElement("section");
    containerSection.className = !data.backgroundImage && 'bg-grey-100'

    /*html*/
    containerSection.innerHTML = `
        <div class="flex flex-col">
            <div class="relative h-[600px] flex justify-center items-center bg-cover bg-no-repeat w-full" style="background-image: url('${data.backgroundImage}')">
                <h2 class="font-medium z-10 text-8xl uppercase text-white">${data.heroTitle}</h2>
                <div class="absolute inset-0 bg-black/20"></div>
            </div>
            <div class="container-layout-padding flex ${data.isCenteredBox ? 'flex-col text-center items-center' : 'flex-row justify-between'} mx-auto">
                    ${data.headingSubtitleBox && `<h3 class="text-7xl text-primary font-medium mb-8">${data.headingSubtitleBox}</h3>`}
                    ${data.contentSubtitleBox.innerHTML && `<div class=" ${data.isCenteredBox ? 'w-9/12 italic text-2xl' : 'w-8/12 text-xl'}">${data.contentSubtitleBox.innerHTML}</div>`}
            </div>
        </div>
    `

    block.textContent = "";
    block.append(containerSection);



    console.log('data', data.contentSubtitleBox);



}
