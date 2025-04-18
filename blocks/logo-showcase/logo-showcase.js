import { processDivsToObject } from "../../scripts/utils.js";
import "../../scripts/customTag.js";

export default async function decorate(block) {
    console.log('block', block)
    const titleSection = block.querySelector(":scope > div:nth-child(1) div") || "No title";
    const textSection = block.querySelector(":scope > div:nth-child(2) div") || "No description";
    const partners = Array.from(block.querySelectorAll(":scope > div:nth-child(n+3):not(:last-child)"));
    const buttonData = block.querySelectorAll(":scope > div:last-child");
    const buttonTitle =  buttonData[0].querySelector("p")?.textContent.trim() || "No button title";
    const buttonLink =  buttonData[0].querySelector("div a")?.textContent.trim() || "#";
    const partnersData = processDivsToObject(partners);
    const containerSection = document.createElement('section')

    block.textContent = "";

    containerSection.innerHTML = `
    <div class="flex flex-col items-center justify-center gap-8 px-4 py-14 text-center lg:gap-16 lg:px-16 lg:pb-32">
      <h2 class="text-primary text-3xl uppercase lg:text-7xl">
        ${titleSection.textContent}
      </h2>
      <p class="text-sm lg:text-xl">
        ${textSection.textContent}
      </p>
      <div class="relative w-full overflow-hidden">
        <!-- Mobile carousel -->
        <div class="flex xl:hidden items-center gap-10 w-max animate-[slide_10s_linear_infinite]">
          ${[...partnersData, ...partnersData]
        .map((item) => {
            if (!item.image || !item.title || !item.link) return "";
            return `
                <a class="size-20 md:size-28 lg:size-36 flex items-center" href="${item.link}">
                  <img class="object-contain h-16 md:h-28 lg:h-32 w-auto bg-contain" src="${item.image}" alt="${item.title}" />
                </a>`;
        })
        .join("")}
        </div>
        <!-- Desktop carousel -->
        <div class="hidden xl:flex gap-10 py-20 justify-center">
          ${partnersData
        .map((item, index) => {
            if (!item.image || !item.title || !item.link) return "";
            const translation =
                index % 2 === 0 ? "translate-y-0" : "-translate-y-20";
            return `
                <a class="size-48 flex ${translation}" href="${item.link}">
                  <img class="object-contain h-48 w-auto bg-contain" src="${item.image}" alt="${item.title}" />
                </a>`;
        })
        .join("")}
        </div>
      </div>
      <custom-button href="${buttonLink}">
        ${buttonTitle}
      </custom-button>
    </div>
  `;

    block.append(containerSection)
}
