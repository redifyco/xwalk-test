import '../../scripts/customTag.js';

const DESKTOP_BREAKPOINT = 1024;

export default function decorate(block) {
    const logo = {
        dark: block.querySelector(':scope > div:nth-child(1) div img')?.src,
    };

    const button = {
        link: block.querySelector(':scope > div:nth-child(3) div a')?.href,
        text: block.querySelector(':scope > div:nth-child(4) div p')?.textContent
    };

    const socialLinks = {
        facebook: block.querySelector(':scope > div:nth-child(5) div a')?.href,
        instagram: block.querySelector(':scope > div:nth-child(6) div a')?.href,
        linkedin: block.querySelector(':scope > div:nth-child(7) div a')?.href,
        youtube: block.querySelector(':scope > div:nth-child(8) div a')?.href
    };

    const menuItemsDiv = block.querySelectorAll(':scope > div:nth-child(n+9) div');
    const menuItems = processDivsToObject(menuItemsDiv);

    const containerSection = document.createElement('section');
    containerSection.innerHTML = `
  <div class="bg-primary px-4 lg:p-20 gap-10 w-full xl:flex-nowrap flex-wrap lg:flex-row lg:gap-20 flex items-center p-14 flex-col justify-center lg:justify-between text-white">
      <div>
        <img class="max-w-80" src="${logo.dark}" alt="" />
      </div>

      <div class="flex w-full lg:max-w-none max-w-96 items-center lg:items-start flex-col gap-10 lg:flex-row lg:justify-between">
        menu
      </div>

      <div class="text-white gap-2 flex items-center">
        <a href="${socialLinks.facebook}">
          <ion-icon size="large" name="logo-facebook"></ion-icon>
        </a>
        <a href="${socialLinks.instagram}">
          <ion-icon size="large" name="logo-instagram"></ion-icon>
        </a>
        <a href="${socialLinks.linkedin}">
          <ion-icon size="large" name="logo-linkedin"></ion-icon>
        </a>
        <a href="${socialLinks.youtube}">
          <ion-icon size="large" name="logo-youtube"></ion-icon>
        </a>
      </div>

    </div>
  `

    const aemEnv = block.getAttribute('data-aue-resource');
    if (!aemEnv) {
        block.textContent = '';
        block.append(containerSection);

    } else {
        block.querySelectorAll(':scope > div:nth-child(n+1) div').forEach(item => item.classList.add('hidden'));
    }


}


const MENU_ITEMS = 15;

function processDivsToObject(divs) {
    const result = [];

    for (let i = 0; i < divs.length; i += 33) {
        const resultSubMenu = [];
        const firstLevelMenuText = divs[i].querySelector('p')?.textContent;
        const firstLevelMenuLink = divs[i + 1].querySelector('a')?.href;
        const isSubMenu = divs[i + 2].querySelector('p')?.textContent === 'true';

        for (let j = 0; j < MENU_ITEMS; j++) {
            const textIndex = i + 3 + (j * 2);
            const linkIndex = i + 4 + (j * 2);
            const subMenuText = divs[textIndex]?.querySelector('p')?.textContent;
            const subMenuLink = divs[linkIndex]?.querySelector('a')?.href;

            if (subMenuText || subMenuLink) {
                resultSubMenu.push({
                    ...(subMenuText && {subMenuText}),
                    ...(subMenuLink && {subMenuLink})
                });
            }
        }

        result.push({
            firstLevelMenuText,
            firstLevelMenuLink,
            isSubMenu,
            subMenuItems: resultSubMenu
        });
    }

    return result;
}
