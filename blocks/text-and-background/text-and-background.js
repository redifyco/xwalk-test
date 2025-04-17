import { buildHeight, classNames, isEditorMode } from "../../scripts/utils.js";
import { createWhiteBorderButton } from "../../components/button.js";

export default async function decorate(block) {
  const backgroundImage = block.querySelector(":scope > div:nth-child(1) div img")?.src || "";
  const title = block.querySelector(":scope > div:nth-child(2) div")?.innerHTML || "";
  const subTitle = block.querySelector(":scope > div:nth-child(3) div")?.textContent || "";
  const buttonText = block.querySelector(":scope > div:nth-child(4) div p")?.textContent || "";
  const buttonLink = block.querySelector(":scope > div:nth-child(4) div p a")?.href || "";
  const mobileHeight = block.querySelector(":scope > div:nth-child(5) div p")?.textContent || "";
  const desktopHeight = block.querySelector(":scope > div:nth-child(6) div p")?.textContent || "";

  const containerSection = document.createElement("section");
  containerSection.className = `
    flex items-center justify-end bg-cover bg-no-repeat text-white 
    text-end px-4 md:text-start md:px-10 lg:px-20 xl:px-26 2xl:px-40 
    ${buildHeight(mobileHeight, desktopHeight)}
  `.trim();
  containerSection.style.backgroundImage = `url(${backgroundImage})`;

  containerSection.innerHTML = `
    <div class="flex flex-col md:flex-row md:justify-between gap-10 w-3/4 md:w-full">
      <span class="text-6xl md:text-8xl">${title}</span>
      <div class="flex flex-col gap-4 md:translate-y-40 md:w-1/2">
        <p class="text-sm md:text-2xl">${subTitle}</p>
        <custom-button color="white" href="${buttonLink}">${buttonText}</custom-button>
      </div>
    </div>
  `;

  block.textContent = "";
  block.append(containerSection);
}
