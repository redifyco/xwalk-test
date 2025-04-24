import { processDivsToObjectTabSection } from "../../scripts/utils.js";

export default function decorate(block) {
    const tabsItems = block.querySelectorAll(":scope > div:nth-child(n+3)");
    const backgroundImage = block.querySelector(":scope > div:nth-child(1) img")?.src;
    const result = processDivsToObjectTabSection(tabsItems) || [];

    let state = { currentTab: 0 };
    let containerSection = null;

    const backgroundImageHTML = document.createElement('div')
    backgroundImageHTML.innerHTML = `<img class="object-cover w-full h-[500px]" src="${backgroundImage}" alt="">`

    function setState(newState) {
        state = { ...state, ...newState };
        render();
    }

    function render() {
        if (containerSection) {
            containerSection.remove();
        }

        containerSection = document.createElement("div");
        containerSection.className = "w-full";

        const current = result[state.currentTab];

        containerSection.innerHTML = `
      <div class="small-layout-padding relative flex justify-between lg:!flex-row lg:!gap-14 xl:!gap-32 2xl:!gap-64">
        <div class="absolute rounded-t-md overflow-hidden bg-white/50 -top-[39px] flex font-semibold 2xl:-top-[60px]">
          ${result.map((tab, index) => `
            <button
              data-tab-index="${index}"
              class="${state.currentTab === index
            ? 'text-primary rounded-t-md bg-white px-8 py-2 2xl:py-4 2xl:text-2xl'
            : '  px-8 py-2 text-black/40 2xl:py-4 2xl:text-2xl'
        }"
            >
              ${tab.tabTitle}
            </button>
          `).join("")}
        </div>
        <div class="flex flex-col gap-4 2xl:gap-8">
          <h2 id="main-title" class="text-2xl font-semibold 2xl:text-5xl">
            ${current?.mainTitle}
          </h2>
          <p>${current?.description}</p>
          <button class="flex items-center gap-2">
            <img src="/assets/icons/download.svg" alt="" />
            Download FAQS
          </button>
        </div>

        <!-- SIDEBAR -->
        <div class="flex flex-col gap-8 lg:gap-10 xl:gap-20">
          <div class="flex w-full flex-col gap-8 rounded-2xl p-6 shadow-2xl lg:w-[400px] xl:w-[500px] 2xl:p-12">
            <div class="flex flex-col gap-2">
              <h4 class="text-primary text-xl 2xl:text-2xl">Aim</h4>
              <p class="text-sm 2xl:text-xl">Lorem ipsum dolor sit amet...</p>
            </div>
            <!-- Altri box... -->
          </div>
          <div class="bg-primary relative flex flex-col gap-2 overflow-hidden rounded-2xl p-6 text-white shadow-2xl 2xl:p-12">
            <img class="absolute -right-16 -bottom-14" src="/assets/icons/tavola-disegno.svg" alt="" />
            <h5 class="text-2xl 2xl:text-4xl">Help make difference!</h5>
            <p class="text-sm 2xl:text-xl">Lorem ipsum dolor sit amet...</p>
            <button class="flex items-center gap-2 text-base 2xl:text-xl">
              Lorem Ipsum
              <img src="/assets/icons/arrow-right-white.svg" alt="" />
            </button>
          </div>
        </div>
      </div>
    `;

        const buttons = containerSection.querySelectorAll("button[data-tab-index]");
        buttons.forEach((button) => {
            const tabIndex = parseInt(button.dataset.tabIndex);
            button.addEventListener("click", () => setState({ currentTab: tabIndex }));
        });
        block.appendChild(backgroundImageHTML)
        block.appendChild(containerSection);
    }

    block.textContent = "";
    render();
}
