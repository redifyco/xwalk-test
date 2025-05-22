export default function decorate(block) {
    console.log('block', block)
    const title = block.querySelector(':scope > div:nth-child(1) div')?.innerHTML || '';
    const accordionItems = block.querySelectorAll(':scope > div:nth-child(n+2) div');
    const resultData = processDivsToObject(accordionItems);


    console.log('resultData', resultData);
    let degree = 0;
    const sectionContainer = document.createElement('section');
    sectionContainer.className = 'container-layout-padding';

    sectionContainer.innerHTML = `
            <div class="text-primary lg:text-start text-center prose-em:lg:text-9xl prose-em:font-joyful text-3xl lg:text-7xl mb-8">
                ${title}
            </div>
            
            
            <div class="flex flex-col lg:flex-row justify-between gap-4 w-full items-center">
            <div class="space-y-0.5 lg:space-y-2 w-full lg:w-3/4">
            ${resultData.length > 0 ? resultData.map((item, index) => {
        return `
        <div class="w-full">
            <button id="accordion-button" class="cursor-pointer w-full py-1 lg:py-3 text-left font-medium flex justify-between items-center" data-index="${index}">
                <span class="text-xl lg:text-4xl text-primary">${item.title ? item.title : 'No Title'}</span>
                <svg class="w-6 text-primary h-8 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
            </button>
            <div class="accordion-content overflow-hidden max-h-0 transition-all duration-200 ease-out">
                <p class="font-light py-1 lg:py-3">${item.description ? item.description : 'No Description'}</p>
            </div>
        </div>`
    }).join('') : ''}
            </div>
            <!--3D CAROUSEL-->
                <div id="3d-carousel" class="relative w-full h-[300px] lg:h-[500px] flex items-center justify-center lg:-translate-y-96 perspective-[1000px]">
                    <div id="container-rotate" class="absolute transition-all duration-1000 transform-3d w-[180px] lg:translate-y-96 h-[200px] lg:w-[200px] lg:h-[300px]">
                        ${resultData.length > 0 ? resultData.map((item, index) => {

        const buildTransform = (() => {
            switch (index % 4) {
                case 0:
                    return 'translate-z-[100px] lg:translate-z-[180px]';
                case 1:
                    return 'translate-x-[100px] lg:translate-x-[180px]';
                case 2:
                    return '-translate-z-[100px] lg:-translate-z-[180px]';
                case 3:
                    return '-translate-x-[100px] lg:-translate-x-[180px]';
                default:
                    return '';
            }
        })();

        return `
                        <div id="item-container" class="absolute shadow flex items-center justify-center transition-all duration-1000 ${buildTransform} w-[180px] h-[200px] lg:w-[200px] lg:h-[300px] ${item.image ? '' : 'bg-gray-300'}">
                            ${item.image ? `<img alt="image" class="w-full h-full object-cover object-center" src="${item.image}" />` : ``}
                            ${item.icon ? `<img alt="icon" class="absolute object-contain h-20 justify-center w-20" src="${item.icon}" />` : ''}
                            <div id="overlay-image" class="h-full w-full absolute inset-0 bg-white/40 transition-opacity duration-300"></div>
                        </div>
                    `
    }).join('') : ''}

                    </div>
                </div>
            </div>

    `;

    function closeAccordionContent(content) {
        content.style.maxHeight = null;
        const allOverlays = document.querySelectorAll('#overlay-image');
        allOverlays.forEach(overlay => {
            overlay.classList.remove('opacity-0');
            overlay.classList.add('opacity-100', 'transition-opacity', 'duration-300');
        });
    }

    function resetAccordionButton(button) {
        button.classList.remove('active');
        button.querySelector('svg').classList.remove('rotate-180');
    }

    const accordionButtons = sectionContainer.querySelectorAll('#accordion-button');
    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            const icon = button.querySelector('svg');
            const index = parseInt(button.dataset.index);

            accordionButtons.forEach(otherButton => {
                if (otherButton !== button) {
                    const otherContent = otherButton.nextElementSibling;
                    closeAccordionContent(otherContent);
                    resetAccordionButton(otherButton);
                }
            });

            button.classList.toggle('active');
            icon.classList.toggle('rotate-180');

            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }

            const containerRotate = sectionContainer.querySelector('#container-rotate');
            const itemContainer = sectionContainer.querySelectorAll('#item-container');
            degree = index * 90;
            containerRotate.style.transform = `rotateY(-${degree}deg)`;
            itemContainer.forEach((item, idx) => {
                item.style.transform = `rotateY(${degree}deg)`;
                const overlay = item.querySelector('#overlay-image');
                if (idx === index && button.classList.contains('active')) {
                    overlay.classList.remove('opacity-100');
                    overlay.classList.add('opacity-0', 'transition-opacity', 'duration-300');
                } else {
                    overlay.classList.remove('opacity-0');
                    overlay.classList.add('opacity-100', 'transition-opacity', 'duration-300');
                }
            });
        });
    });


    const firstOverlay = sectionContainer.querySelector('#overlay-image');
    if (firstOverlay) {
        firstOverlay.classList.remove('opacity-100');
        firstOverlay.classList.add('opacity-0');
    }


    block.textContent = '';
    block.append(sectionContainer);
}

function processDivsToObject(divs) {
    const result = [];

    for (let i = 0; i < divs.length; i += 4) {
        console.log('divs[i]', divs[i])
        console.log('divs[i +1]', divs[i + 1])
        console.log('divs[i +2]', divs[i + 2])
        console.log('divs[i +3]', divs[i + 3])
        const imageDiv = divs[i];
        const iconDiv = divs[i + 1];
        const titleDiv = divs[i + 2];
        const descriptionDiv = divs[i + 3];

        const image = imageDiv?.querySelector('img')?.getAttribute('src') || '';
        const icon = iconDiv?.querySelector('img')?.getAttribute('src') || '';
        const title = titleDiv?.textContent.trim();
        const description = descriptionDiv?.textContent.trim() || null;

        result.push({
            image,
            icon,
            title,
            description,
        });
    }

    return result;
}
