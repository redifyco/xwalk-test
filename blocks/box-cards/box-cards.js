import '../../scripts/customTag.js'


export default function decorate(block) {

    const titleSection = block.querySelector(':scope > div:nth-child(1) div')?.innerHTML || "";
    const subtitleSection = block.querySelector(':scope > div:nth-child(2) div')?.innerHTML || "";
    const cards = block.querySelectorAll(':scope > div:nth-child(n+3) div')
    const cardsResult = processDivs(cards)

    const containerSection = document.createElement('section');
    containerSection.className = 'container-layout-padding';

    containerSection.innerHTML = `
    <div class="flex flex-col items-center justify-center gap-8 text-center lg:gap-16">
      <div class="text-primary text-start prose-em:font-joyful-sm prose-em:text-6xl text-3xl lg:text-7xl">
        ${titleSection}
      </div>
      <div class="text-sm lg:text-xl font-light">
        ${subtitleSection}
      </div>
      <div class="w-full flex flex-wrap flex-col gap-4 md:flex-row md:gap-8 justify-center">
      ${cardsResult.length > 0 && cardsResult.map((item) => `
      <div class="bg-cover shadow-lg text-white rounded-xl w-full md:max-w-[47%] xl:max-w-[500px] items-start p-6 flex flex-col gap-6 relative overflow-hidden bg-center bg-no-repeat" style='background-image: url("${item.backgroundImage}")'>
      <div class="flex flex-col gap-2 items-start">
      <h6 class="font-semibold z-10 text-2xl lg:text-4xl">${item.title}</h6>
        <p class="z-10 line-clamp-1">${item.subtitle}</p>
</div>
        <arrow-button color="white" class="z-10" href="${item.buttonLink}">${item.buttonText}</arrow-button>
        <img class="absolute size-40 -right-10 -bottom-10" src="${item.icon}" alt="">
      <div class="absolute inset-0 h-full w-full z-0 bg-black/20"></div>
</div>
      `).join('')}
</div>
     
    </div>
    `

    const aemEnv = block.getAttribute('data-aue-resource');
    if (!aemEnv) {
        block.textContent = '';
        block.append(containerSection);
    } else {
        cards.forEach(item => item.classList.add('hidden'));
        const titleSection = block.querySelector(':scope > div:nth-child(1) div')
        const subtitleSection = block.querySelector(':scope > div:nth-child(2) div')
        titleSection.classList.add('hidden');
        subtitleSection.classList.add('hidden');
        block.append(containerSection);
    }

}


function processDivs(divs) {
    const result = [];

    for (let i = 0; i < divs.length; i += 6) {
        const backgroundImage = divs[i]?.querySelector('img')?.src || '';
        const icon = divs[i + 1]?.querySelector('img')?.src || '';
        const title = divs[i + 2]?.querySelector('p')?.textContent || '';
        const subtitle = divs[i + 3]?.querySelector('p')?.textContent || '';
        const buttonText = divs[i + 4]?.querySelector('p')?.textContent || '';
        const buttonLink = divs[i + 5]?.querySelector('a')?.href || '';

        result.push({
            backgroundImage,
            title,
            subtitle,
            buttonText,
            buttonLink,
            icon
        });
    }

    return result;
}
