import {processDivsToObjectContactsItems} from "../../scripts/utils.js";

export default function decorate(block) {
    const mapConfig = {
        apiKey: block.querySelector('div:nth-child(1)')?.textContent.trim() || '',
        centerLat: parseFloat(block.querySelector('div:nth-child(2)')?.textContent.trim() || '41.9028'),
        centerLng: parseFloat(block.querySelector('div:nth-child(3)')?.textContent.trim() || '12.4964'),
        zoom: parseInt(block.querySelector('div:nth-child(4)')?.textContent.trim() || '12', 10),
    };

    const sectionTitle = block.querySelector('div:nth-child(5)')?.textContent.trim() || ''
    const boxTitle = block.querySelector('div:nth-child(6)')?.textContent.trim() || ''
    const contactInfoItems = block.querySelectorAll('div:nth-child(n+7)')
    const resultItems = processDivsToObjectContactsItems(contactInfoItems) || [];
    const sectionContainer = document.createElement('section');
    sectionContainer.className = 'container-layout-padding justify-between gap-8 flex w-full'

    sectionContainer.innerHTML = `
        <div class=" border-t w-full pt-10 border-solid border-t-black">
            <h3 class="font-semibold text-5xl">${sectionTitle}</h3>
            <div class="content-center h-full">
                <h4 class="font-bold text-xl">${boxTitle}</h4>
                <div class="flex p-4 flex-col gap-2">
                    ${resultItems.length > 0 && resultItems.map((item) => `
                        <a class="flex gap-2 items-center" href="${item.link}">
                            <img src="${item.image}" class="size-6 rounded-full" alt="">
                            <p>${item.label}</p>
                        </a>
                    `).join('')}
                </div>
            </div>
        </div>
        <div class="">
        <img class="bg-gray-100 h-[700px] w-[700px]" src="" alt="">
</div>
    `;

    const aemEnv = block.getAttribute('data-aue-resource');
    if (!aemEnv) {
        block.textContent = '';
        block.append(sectionContainer);
    } else {
        block.append(sectionContainer);
        block.querySelector('div:nth-child(1)').classList.add('hidden');
        block.querySelector('div:nth-child(2)').classList.add('hidden');
        block.querySelector('div:nth-child(3)').classList.add('hidden');
        block.querySelector('div:nth-child(4)').classList.add('hidden');
        resultItems.forEach(item => item.classList.add('hidden'));
    }
}
