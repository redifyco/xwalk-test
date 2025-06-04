export default function decorate(block) {

    const mainTitle = block.querySelector(':scope > div:nth-child(1) div p')?.textContent;
    const secondTitle = block.querySelector(':scope > div:nth-child(2) div p')?.textContent;
    const description = block.querySelector(':scope > div:nth-child(3) div')?.innerHTML;
    const tags = block.querySelector(':scope > div:nth-child(4) div p')?.textContent;


    const containerSection = document.createElement('section');
    const body = document.querySelector('body');
    containerSection.className = 'absolute flex items-center justify-center inset-0 top-0 left-0 h-full w-full bg-black/20 z-30 py-32 w-full px-32';

    body.classList.add('overflow-hidden');
    window.scrollTo(0, 0);


    containerSection.innerHTML = `
        <div class="bg-white shadow relative flex flex-col gap-8 p-10 rounded-lg">
                <h5 class="text-5xl border-b w-full pb-3">${mainTitle}</h5>
                <h6 class="text-3xl text-primary">${secondTitle}</h6>
                <div class="font-light">${description}</div>
            <button class="text-primary cursor-pointer absolute right-8 top-4" id="close-button">
                <ion-icon class="text-5xl" name="close-outline"></ion-icon>
            </button>
        </div>
    `;
    console.log('block', block);


    containerSection.querySelector('#close-button').addEventListener('click', () => {
        body.classList.remove('overflow-hidden');
        containerSection.remove();
    })


    block.textContent = '';
    block.append(containerSection);
}
