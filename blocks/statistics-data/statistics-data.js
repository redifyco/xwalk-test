import {buildHeight, processDivsToObjectStatisticsData} from "../../scripts/utils.js";

export default function decorate(block) {
    const backgroundImage = block.querySelector(":scope > div:nth-child(1) img")?.src;
    const title = block.querySelector(":scope > div:nth-child(2) div p").textContent;
    const buttonText = block.querySelector(":scope > div:nth-child(3) div p").textContent;
    const buttonLink = block.querySelector(":scope > div:nth-child(4) div a").href;
    const mobileHeight = block.querySelector(":scope > div:nth-child(5) div p").textContent;
    const desktopHeight = block.querySelector(":scope > div:nth-child(6) div p").textContent;
    const statsList = Array.from(block.querySelectorAll(":scope > div:nth-child(n+7)"));
    const JSONStatisticsData = processDivsToObjectStatisticsData(statsList);

    const containerSection = document.createElement("section");
    containerSection.className = `
    flex flex-col gap-14 bg-cover bg-center justify-center bg-no-repeat py-30
    lg:gap-40 lg:py-36 xl:gap-56 xl:py-64
    ${buildHeight(mobileHeight, desktopHeight)}
  `.trim();
    containerSection.style.backgroundImage = `url('${backgroundImage}')`;

    containerSection.innerHTML = `
    <div class="flex flex-col items-center lg:items-start">
      <h2 class="relative block px-4 text-center text-3xl font-semibold text-white uppercase lg:px-16 lg:text-start lg:text-6xl 2xl:text-7xl">
        ${title}
        <span class="absolute left-0 mt-5 hidden border-b-2 border-b-white lg:block lg:w-[50%] xl:w-[90%]"></span>
      </h2>
    </div>

    <div class="grid grid-cols-2 justify-items-center gap-8 px-4 lg:justify-items-start lg:gap-24 lg:px-24 xl:gap-32 xl:px-32">
      ${JSONStatisticsData.length > 0 ? JSONStatisticsData.map((item) => `
        <div class="flex flex-col items-center text-white lg:flex-row lg:items-end lg:gap-6">
          <h6 class="text-6xl md:text-7xl leading-tight font-semibold 2xl:text-9xl 2xl:leading-24">
            ${item.value}
          </h6>
          <span class="w-full text-center lg:text-start text-base 2xl:text-3xl">
            ${item.label}
          </span>
        </div>
      `).join("") : ""}
      
      <div class="col-span-2">
        <custom-link href="${buttonLink}" color="white">${buttonText}</custom-link>
      </div>
    </div>
  `;

    block.textContent = "";
    block.append(containerSection);
}
