import '../../scripts/customTag.js';
import {buildHeight, processDivsToObjectStatisticsData, returnBoolean} from "../../scripts/utils.js";

export default function decorate(block) {
    const backgroundImage = block.querySelector(":scope > div:nth-child(1) img")?.src;
    const isWhiteText = returnBoolean(block, 2);
    const title = block.querySelector(":scope > div:nth-child(3) div p")?.textContent;
    const buttonText = block.querySelector(":scope > div:nth-child(4) div p")?.textContent;
    const buttonLink = block.querySelector(":scope > div:nth-child(5) div a")?.href;
    const mobileHeight = block.querySelector(":scope > div:nth-child(6) div p")?.textContent;
    const desktopHeight = block.querySelector(":scope > div:nth-child(7) div p")?.textContent;
    const statsList = Array.from(block.querySelectorAll(":scope > div:nth-child(n+8)"));
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
      <h2 class="relative block px-4 text-center text-3xl font-semibold uppercase lg:px-16 lg:text-start lg:text-6xl 2xl:text-7xl ${isWhiteText ? 'text-white' : 'text-primary'}">
        ${title}
        <span class="absolute left-0 mt-5 hidden border-b-2 lg:block lg:w-[50%] xl:w-[90%] ${isWhiteText ? 'border-b-white' : 'border-b-primary'}"></span>
      </h2>
    </div>

    <div class="grid grid-cols-2 justify-items-center gap-8 px-4 lg:justify-items-start lg:gap-24 lg:px-24 xl:gap-32 xl:px-32">
      ${JSONStatisticsData.length > 0 ? JSONStatisticsData.map((item) => `
        <div class="flex flex-col items-center  lg:flex-row lg:items-end lg:gap-6 ${isWhiteText ? 'text-white' : 'text-primary'}">
          <h6 class="text-6xl md:text-7xl leading-tight font-semibold 2xl:text-9xl 2xl:leading-24">
            ${item.value}
          </h6>
          <span class="w-full text-center lg:translate-y-5 lg:text-start lg:max-w-lg text-base 2xl:text-3xl ${isWhiteText ? 'text-white' : 'text-black'}">
            ${item.label}
          </span>
        </div>
      `).join("") : ""}
      
      ${buttonLink ? `
      <div class="col-span-2">
        <custom-link href="${buttonLink}" color="${isWhiteText ? 'white' : 'primary'}">${buttonText}</custom-link>
      </div>
      ` : ''}
    </div>
  `;
    block.textContent = "";
    block.append(containerSection);
}
