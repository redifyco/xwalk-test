export default function decorate(block) {
    const backgroundImage = block.querySelector(":scope > div:nth-child(1) img")?.src;
    const title = block.querySelector(":scope > div:nth-child(2) div")?.innerHTML;
    const subtitle = block.querySelector(":scope > div:nth-child(3) div")?.innerHTML;
    console.log('block', block);

    const containerSection = document.createElement('section');
    containerSection.className = 'bg-no-repeat relative bg-cover bg-center min-h-96 pb-14 lg:container-layout-padding';
    containerSection.innerHTML = `
    <div class="flex flex-col items-end lg:flex-row gap-8 lg:gap-24 justify-between">
    <img src="${backgroundImage}" class="object-cover max-h-72 lg:hidden object-center inset-0 h-full w-full z-0" alt="">
        <img src="${backgroundImage}" class="absolute lg:block hidden object-cover object-center inset-0 h-full w-full z-0" alt="">
        <div class="lg:block z-10 hidden">
            <div class="text-7xl text-white prose-em:font-joyful prose-em:text-9xl">
                ${title}
            </div>
            <div class="text-sm text-white lg:text-xl font-light">
                ${subtitle}
            </div>
        </div>
        <div class="z-10 lg:max-w-xl w-full">      
        </div>
    </div>
`

    // block.textContent = '';+
    console.log('block', block)
    block.append(containerSection);

}
