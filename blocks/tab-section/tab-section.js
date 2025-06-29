import {
    processDivsToObjectTabSection,
    processDivsToObjectTabSectionInfo,
} from "../../scripts/utils.js";

export default function decorate(block) {
    const tabsItems = block.querySelectorAll(":scope > div:nth-child(n+19)");
    const firstInfoBoxes = block.querySelectorAll(":scope > div:nth-child(n+3):nth-child(-n+12)");
    const CTABox = block.querySelectorAll(":scope > div:nth-child(n+13):nth-child(-n+16)");

    const titleCTABox = CTABox[0]?.querySelector('p')?.textContent || '';
    const descriptionCTABox = CTABox[1]?.querySelector('p')?.textContent || '';
    const buttonTextCTABox = CTABox[2]?.querySelector('p')?.textContent || '';
    const buttonLinkCTABox = CTABox[3]?.querySelector('a')?.href || '';
    const backgroundImage = block.querySelector(":scope > div:nth-child(1) img")?.src;
    const dateTime = block.querySelector(":scope > div:nth-child(2) div p")?.textContent;
    const buttonText = block.querySelector(":scope > div:nth-child(17) p")?.textContent;
    const buttonLink = block.querySelector(":scope > div:nth-child(18) a")?.href;

  const formattedDate = dateTime ? new Date(dateTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  console.log('dateTime', dateTime, 'formatted:', formattedDate);


    const result = processDivsToObjectTabSection(tabsItems) || [];
    const resultInfoBox = processDivsToObjectTabSectionInfo(firstInfoBoxes) || [];
    let state = {currentTab: 0};
    let containerSection = null;

    // Aggiunto controllo per background image
    const backgroundImageHTML = document.createElement('div');
    if (backgroundImage) {
        backgroundImageHTML.innerHTML = `<img class="object-cover w-full h-[500px]" src="${backgroundImage}" alt="">`;
    }

    function setState(newState) {
        state = {...state, ...newState};
        render();
    }

    function render() {
        if (containerSection) {
            containerSection.remove();
        }

        containerSection = document.createElement("div");
        containerSection.className = "w-full";

        const current = result[state.currentTab];

        // Prepariamo i frammenti HTML condizionali
        const mainTitleHTML = current?.mainTitle ?
            `<h2 id="main-title" class="text-2xl font-semibold 2xl:text-5xl">${current.mainTitle}</h2>` : '';

        const descriptionHTML = current?.description ?
            `<p>${current.description}</p>` : '';

        // Prepariamo il contenuto delle info box
        const infoBoxesHTML = resultInfoBox.length > 0 ?
            resultInfoBox.map((infoBox) => {
                // Controllo se title e description sono presenti
                if (!infoBox.title && !infoBox.description) return '';

                const titleHTML = infoBox.title ?
                    `<h4 class="text-primary text-xl 2xl:text-2xl">${infoBox.title}</h4>` : '';

                const descriptionHTML = infoBox.description ?
                    `<p class="text-sm 2xl:text-xl">${infoBox.description}</p>` : '';

                if (titleHTML || descriptionHTML) {
                    return `
                        <div class="flex flex-col gap-2">
                            ${titleHTML}
                            ${descriptionHTML}
                        </div>
                    `;
                }
                return '';
            }).join('') : '';

        // Prepariamo il CTA box condizionale
        let ctaBoxHTML = '';
        if (titleCTABox || descriptionCTABox || (buttonTextCTABox && buttonLinkCTABox)) {
            const ctaTitleHTML = titleCTABox ?
                `<h5 class="text-2xl 2xl:text-4xl">${titleCTABox}</h5>` : '';

            const ctaDescriptionHTML = descriptionCTABox ?
                `<p class="text-sm 2xl:text-xl">${descriptionCTABox}</h5>` : '';

            const ctaButtonHTML = buttonTextCTABox && buttonLinkCTABox ?
                `<a href="${buttonLinkCTABox}" class="flex items-center gap-2 text-base 2xl:text-xl">
                    ${buttonTextCTABox}
                    <img src="/assets/icons/arrow-right-white.svg" alt="" />
                </a>` : '';

            ctaBoxHTML = `
                <div class="bg-primary relative flex lg:w-[400px] xl:w-[500px] flex-col gap-2 overflow-hidden rounded-2xl p-6 text-white shadow-2xl 2xl:p-12">
                    <img class="absolute -right-16 -bottom-14" src="/assets/icons/tavola-disegno.svg" alt="" />
                    ${ctaTitleHTML}
                    ${ctaDescriptionHTML}
                    ${ctaButtonHTML}
                </div>
            `;
        }

        // Costruiamo l'HTML completo con controlli condizionali
        containerSection.innerHTML = `
            <div class="small-layout-padding flex flex-col relative">
            <div class="flex justify-between flex-col lg:!flex-row lg:!gap-14 xl:!gap-32 2xl:!gap-64">
                <div class="absolute left-0 md:left-auto rounded-t-md md:w-fit w-screen overflow-x-auto bg-white/50 -top-[39px] flex font-semibold 2xl:-top-[60px]">
                    ${result.map((tab, index) => `
                        <button
                            data-tab-index="${index}"
                            class="cursor-pointer mt-2 ${state.currentTab === index
                                ? 'text-primary rounded-t-md bg-white px-8 py-2 2xl:py-4 2xl:text-2xl'
                                : 'px-8 py-2 text-black/40 2xl:py-4 2xl:text-2xl'}"
                        >
                            ${tab.tabTitle}
                        </button>
                    `).join("")}
                </div>

                <div class="flex flex-col gap-4 2xl:gap-8">
                    ${mainTitleHTML}
                    ${descriptionHTML}
                </div>

                <div class="flex flex-col gap-8 lg:gap-10 xl:gap-20">
                    ${infoBoxesHTML ? 
                        `<div class="flex w-full flex-col gap-8 rounded-2xl p-6 shadow-2xl lg:w-[400px] xl:w-[500px] 2xl:p-12">
                            ${infoBoxesHTML}
                        </div>` : ''}
                    ${ctaBoxHTML}
                </div>
                </div>
                <a href="${buttonLink}" class="downloadlink flex items-center gap-2">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="Download">
                                <circle id="Ellipse 11" cx="20" cy="20" r="19" stroke="#009BAC" stroke-width="2"/>
                                <path id="Arrow 1" d="M19.6991 23.3631C20.0897 23.7536 20.7228 23.7536 21.1134 23.3631L27.4773 16.9991C27.8678 16.6086 27.8678 15.9754 27.4773 15.5849C27.0868 15.1944 26.4536 15.1944 26.0631 15.5849L20.4062 21.2417L14.7494 15.5849C14.3589 15.1944 13.7257 15.1944 13.3352 15.5849C12.9447 15.9754 12.9447 16.6086 13.3352 16.9991L19.6991 23.3631ZM19.4062 8.84448L19.4062 22.656L21.4062 22.656L21.4062 8.84448L19.4062 8.84448Z" fill="#009BAC"/>
                                <path id="Vector 10" d="M9 19V27H31V19" stroke="#009BAC" stroke-width="2"/>
                            </g>
                        </svg>
                        ${buttonText}
                    </a>
            </div>
        `;

        const buttons = containerSection.querySelectorAll("button[data-tab-index]");
        buttons.forEach((button) => {
            const tabIndex = parseInt(button.dataset.tabIndex);
            button.addEventListener("click", () => setState({currentTab: tabIndex}));
        });

        if (backgroundImageHTML.innerHTML) {
            block.appendChild(backgroundImageHTML);
        }
        block.appendChild(containerSection);
    }

    const aemEnv = block.getAttribute('data-aue-resource');
    if (!aemEnv) {
      block.textContent = ''
      // block.querySelectorAll(':scope > div:nth-child(n+1)').forEach(div => div.classList.add('hidden'));
    } else {
      block.querySelectorAll(':scope > div:nth-child(n+1)').forEach(div => div.classList.add('hidden'));
    }

    render();
}
