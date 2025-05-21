export default function decorate(block) {
    const title = block.querySelector(':scope > div:nth-child(1) div')?.innerHTML || '';
    const accordionItems = block.querySelectorAll(':scope > div:nth-child(n+2) div');
    const resultData = processDivsToObject(accordionItems);

    console.log('resultData', resultData)

    let degree = 0;
    const sectionContainer = document.createElement('section');
    sectionContainer.className = 'container-layout-padding';

    sectionContainer.innerHTML = `
        <div class="w-full">
            <div class="text-primary prose-em:lg:text-9xl prose-em:font-joyful text-center text-3xl lg:text-7xl mb-8">
                ${title}
            </div>
            
            
            <div class="flex justify-between gap-4 w-full items-center">
            <div class="space-y-2 w-3/4">
            ${resultData.length > 0 ? resultData.map((item, index) => {
        return `
        <div class="w-full">
            <button id="accordion-button" class="cursor-pointer w-full py-3 text-left font-medium flex justify-between items-center" data-index="${index}">
                <span class="text-4xl text-primary">${item.title}</span>
                <svg class="w-6 text-primary h-8 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
            </button>
            <div class="accordion-content overflow-hidden max-h-0 transition-all duration-200 ease-out">
                <p class="font-light py-3">${item.description}</p>
            </div>
        </div>`
    }).join('') : ''}
            </div>
            
                <div class="relative w-full h-[500px] flex items-center justify-center perspective-[1000px]">
                    <div id="container-rotate" class="absolute transition-all duration-1000 transform-3d w-[180px] h-[200px] lg:w-[200px] lg:h-[300px]">
                        ${resultData.length > 0 ? resultData.map((item, index) => {

        const buildTransform = (() => {
            switch (index % 4) {
                case 0:
                    return 'translate-z-[100px] lg:translate-z-[200px]';
                case 1:
                    return 'translate-x-[100px] lg:translate-x-[200px]';
                case 2:
                    return '-translate-z-[100px] lg:-translate-z-[200px]';
                case 3:
                    return '-translate-x-[100px] lg:-translate-x-[200px]';
                default:
                    return '';
            }
        })();

        return `
                        <div id="item-container" class="absolute transition-all duration-1000 ${buildTransform} w-[180px] h-[200px] lg:w-[200px] lg:h-[300px]">
                            <img alt="image" class="w-full h-full object-cover object-center" src="${item.image}" />
                        </div>
                    `
    }).join('') : ''}

                    </div>
                </div>
            </div>
            <button id="button-rotate" class="px-4 py-2 bg-blue-500 text-white rounded-lg mt-4">Rotate + 90</button>
        </div>
      
    `;

    const buttonRotate = sectionContainer.querySelector('#button-rotate');
    buttonRotate.addEventListener('click', () => {
        console.log('degree', degree);
        const containerRotate = sectionContainer.querySelector('#container-rotate');
        const itemContainer = sectionContainer.querySelectorAll('#item-container');
        degree += 90;
        containerRotate.style.transform = `rotateY(${degree}deg)`;
        itemContainer.forEach(item => item.style.transform = `rotateY(-${degree}deg)`);
    })

    function closeAccordionContent(content) {
        content.style.maxHeight = null;
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

            // Close all other accordions
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
            containerRotate.style.transform = `rotateY(${degree}deg)`;
            itemContainer.forEach(item => item.style.transform = `rotateY(-${degree}deg)`);
        });
    });

    const aemEnv = block.getAttribute('data-aue-resource');
    if (!aemEnv) {
        block.textContent = '';
        block.append(sectionContainer);
    } else {
        block.append(sectionContainer);
        block.querySelectorAll(":scope > div:nth-child(n+1) div").forEach(item => item.classList.add('hidden'));
    }

}

function processDivsToObject(divs) {
    const result = [];

    for (let i = 0; i < divs.length; i += 3) {
        const imageDiv = divs[i];
        const icon = divs[i + 1];
        const titleDiv = divs[i + 2];
        const descriptionDiv = divs[i + 3];

        const image = imageDiv?.querySelector('img')?.getAttribute('src') || '';
        const title = titleDiv?.textContent.trim() || 'Untitled';
        const description = descriptionDiv?.textContent.trim() || null;

        result.push({
            image,
            title,
            description,
        });
    }

    return result;
}
