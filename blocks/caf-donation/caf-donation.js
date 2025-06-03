export default function decorate(block) {
    const backgroundImage = block.querySelector(":scope > div:nth-child(1) img")?.src;
    const title = block.querySelector(":scope > div:nth-child(2) div")?.innerHTML;
    const subtitle = block.querySelector(":scope > div:nth-child(3) div")?.innerHTML;

    const boxTitle = block.querySelector(":scope > div:nth-child(4) div p")?.textContent;
    const boxDescription = block.querySelector(":scope > div:nth-child(5) div p")?.textContent;
    const boxButtonText = block.querySelector(":scope > div:nth-child(6) div p")?.textContent;
    const countryItems = block.querySelectorAll(":scope > div:nth-child(n+7) div");
    const processCountryItems = processDivsToObject(countryItems)

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
        <div class="bg-white h-full w-full px-4 lg:p-8 flex flex-col gap-4">
            <div class="flex flex-col gap-2 justify-center items-center text-center">  
                ${boxTitle ? `<h3 class="text-2xl lg:text-4xl font-medium">${boxTitle}</h3>` : ''}
                ${boxDescription ? `<p class="font-light">${boxDescription}</p>` : ''}
            </div>
            <div class="mt-3 flex flex-col gap-4">
                <div class="relative w-full">
                    <input id="country-search" type="text" class="border-primary w-full border-r-2 border-b-2 focus:outline-0 p-1 ring-0" placeholder="Search your country"/>
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"><ion-icon size="large" name="search-outline"></ion-icon></span>
                </div>
                <div id="container-render">              
                    <div class="flex flex-wrap mt-2 gap-6 justify-center max-h-[250px] overflow-y-scroll">
                        ${processCountryItems.length > 0 ? processCountryItems.map(item => `
                            <button data-country-link="${item.link}" id="country-button" class="flex cursor-pointer flex-col justify-center items-center gap-2">
                                <img src="${item.image}" alt="icon-${item.name}" class="rounded-full size-16 object-cover object-center">
                                <span id="country-name" class="capitalize">${item.name}</span>
                            </button>
                        `).join('') : ''}
                    </div>
                </div>
                <a target="_blank" id="continue-button" href="#" class="border text-center cursor-pointer mt-5 border-primary w-full py-2 text-primary" id="submit-currency-amount-form">${boxButtonText}</a>
            </div>
        </div>   
    </div>
</div>
`


    const aemEnv = block.getAttribute('data-aue-resource');
    if (!aemEnv) {
        block.textContent = '';
        block.append(containerSection);
    } else {
        block.append(containerSection);
        block.querySelectorAll(":scope > div:nth-child(n+1) div").forEach(item => item.classList.add('hidden'));
    }


    containerSection.querySelectorAll('#country-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const link = button.dataset.countryLink;
            containerSection.querySelector('#continue-button').setAttribute('href', link);
            containerSection.querySelectorAll('#country-name').forEach(item => item.classList.remove('font-semibold'));
            button.querySelector('#country-name').classList.add('font-semibold');
        })
    })

    containerSection.querySelector('#country-search').addEventListener('input', (e) => {
        const value = e.target.value;
        const items = containerSection.querySelectorAll('#country-button');
        if (value.length > 0) {
            items.forEach(item => {
                const name = item.querySelector('#country-name').textContent.toLowerCase();
                if (name.includes(value.toLowerCase())) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            })
        } else {
            items.forEach(item => item.classList.remove('hidden'));
        }
    })
}


const RenderElements = (items) => {
    return `
<div class="flex flex-wrap mt-2 gap-6 justify-center max-h-[250px] overflow-y-scroll">
    ${items.length > 0 ? items.map(item => `
    <button data-country-link="${item.link}" id="country-button" class="flex cursor-pointer flex-col justify-center items-center gap-2">
        <img src="${item.image}" alt="icon-${item.name}" class="rounded-full size-16 object-cover object-center">
        <span id="country-name" class="capitalize">${item.name}</span>
    </button>
    `).join('') : ''}
</div>
    `
}


/*Country Items*/
function processDivsToObject(divs) {
    if (!divs || divs.length === 0) return [];

    const result = [];

    // Process the divs in groups of 3
    for (let i = 0; i < divs.length; i += 3) {
        const imageDiv = divs[i];
        const nameDiv = divs[i + 1];
        const linkDiv = divs[i + 2];

        if (!imageDiv || !nameDiv) continue;

        const image = imageDiv?.querySelector('img')?.getAttribute('src') || '';
        const name = nameDiv?.textContent.trim() || 'Untitled';
        const link = linkDiv?.textContent.trim() || null;

        result.push({
            image,
            name,
            link,
        });
    }

    return result;
}
