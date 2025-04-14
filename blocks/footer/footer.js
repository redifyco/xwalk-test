import { getJsonFromHtml } from "../../scripts/utils.js";
import { getMetadata } from "../../scripts/aem.js";
import { loadFragment } from "../fragment/fragment.js";

export default async function decorate(block) {
    const navMeta = getMetadata("footer");
    const navPath = navMeta ? new URL(navMeta, window.location).pathname : "/footer";
    const fragment = await loadFragment(navPath);

    const data = fragment.querySelector(".default-content-wrapper");
    const darkLogo = data.querySelector("p:nth-child(1) img");
    const facebookLink = fragment.querySelector(".default-content-wrapper p:nth-child(4) a")?.href;
    const instagramLink = fragment.querySelector(".default-content-wrapper p:nth-child(5) a")?.href;
    const linkedinLink = fragment.querySelector(".default-content-wrapper p:nth-child(6) a")?.href;
    const youtubeLink = fragment.querySelector(".default-content-wrapper p:nth-child(7) a")?.href;

    const navigationListHTML = data.querySelector("ul");
    const navigationListJson = getJsonFromHtml(navigationListHTML);
    const copyRightText = fragment.querySelector(".default-content-wrapper p:nth-child(3)");

    block.textContent = "";

    const footerDiv = document.querySelector(".footer-wrapper");

    footerDiv.innerHTML = /* html */ `
    <div class="bg-primary px-4 lg:p-20 gap-10 w-full xl:flex-nowrap flex-wrap lg:flex-row lg:gap-20 flex items-center p-14 flex-col justify-center lg:justify-between text-white">
      <div>
        <img class="max-w-80" src="${darkLogo.src}" alt="" />
      </div>

      <div class="flex w-full lg:max-w-none max-w-96 items-center lg:items-start flex-col gap-10 lg:flex-row lg:justify-between">
        ${navigationListJson
        .map(
            (item) => `
              <ul class="flex flex-col justify-center lg:items-start items-center gap-2">
                <h6 class="text-2xl hidden lg:block uppercase font-semibold">${item.title}</h6>
                ${item.subItems
                .map(
                    (subItem) => `
                      <li class="text-xs py-1 lg:text-xl font-light">
                        <a href="${subItem.href}">${subItem.title}</a>
                      </li>`
                )
                .join("")}
              </ul>`
        )
        .join("")}
      </div>

      <div class="text-white gap-2 flex items-center">
        <a href="${facebookLink}">
          <ion-icon size="large" name="logo-facebook"></ion-icon>
        </a>
        <a href="${instagramLink}">
          <ion-icon size="large" name="logo-instagram"></ion-icon>
        </a>
        <a href="${linkedinLink}">
          <ion-icon size="large" name="logo-linkedin"></ion-icon>
        </a>
        <a href="${youtubeLink}">
          <ion-icon size="large" name="logo-youtube"></ion-icon>
        </a>
      </div>

      <p class="lg:hidden block text-xs">${copyRightText.textContent}</p>
    </div>
  `;
}
