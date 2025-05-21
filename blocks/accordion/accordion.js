export default function decorate(block) {
    const title = block.querySelector(':scope > div:nth-child(1) div')?.innerHTML || '';
    const accordionItems = block.querySelectorAll(':scope > div:nth-child(n+2) div');
    const resultData = processDivsToObject(accordionItems);

    let degree = 0;
    const sectionContainer = document.createElement('section');
    sectionContainer.className = 'container-layout-padding w-full';

    sectionContainer.innerHTML = `
        <div class="w-full bg-gray-100">
            <div class="text-primary prose-em:lg:text-9xl prose-em:font-joyful text-center text-3xl lg:text-7xl">
                ${title}
            </div>
            <div class="h-full flex justify-center items-center">
                <div class="relative h-[500px] flex items-center justify-center w-screen perspective-[1000px]">
                    <div id="container-rotate" class="absolute transition-all duration-1000 transform-3d w-[180px] h-[200px] lg:w-[280px] lg:h-[300px]">
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
                        <div id="item-container" class="absolute transition-all duration-1000 ${buildTransform} w-[180px] h-[200px] lg:w-[280px] lg:h-[300px]">
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

    console.log('block', block);
    block.textContent = '';
    block.append(sectionContainer);

}

function processDivsToObject(divs) {
    const result = [];

    for (let i = 0; i < divs.length; i += 3) {
        const imageDiv = divs[i];
        const titleDiv = divs[i + 1];
        const descriptionDiv = divs[i + 2];

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
