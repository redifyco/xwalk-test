import '../../scripts/customTag.js';

const DESKTOP_BREAKPOINT = 1024;

export default function decorate(block) {
    const logo = {
        dark: block.querySelector(':scope > div:nth-child(1) div img')?.src,
    };

    const socialLinks = {
        facebook: block.querySelector(':scope > div:nth-child(2) div a')?.href,
        instagram: block.querySelector(':scope > div:nth-child(3) div a')?.href,
        linkedin: block.querySelector(':scope > div:nth-child(3) div a')?.href,
        youtube: block.querySelector(':scope > div:nth-child(4) div a')?.href
    };

    const menuItemsDiv = block.querySelectorAll(':scope > div:nth-child(n+6) div');
    const menuItems = processDivsToObject(menuItemsDiv);

    //console.log('menuItems', menuItems)

    const containerSection = document.createElement('section');
    containerSection.innerHTML = `
  <div class="bg-primary px-4 lg:p-20 gap-10 w-full xl:flex-nowrap flex-wrap lg:flex-row lg:gap-20 flex items-center p-14 flex-col justify-center lg:justify-between text-white">
      <div>
        <img class="max-w-40" src="${logo.dark}" alt="" />
      </div>

      <div class="flex lg:flex-row lg:items-start text-center lg:text-start flex-col gap-8 items-center justify-center lg:justify-start w-full">
        ${menuItems.length > 0 ? menuItems.map(item => `
        <div class="flex flex-col gap-3">
        <span class="text-2xl font-medium uppercase">${item.firstLevelMenuText}</span>
        <div class="flex flex-col gap-2">
        ${item.subMenuItems.length > 0 ? item.subMenuItems.map(subItem => `
            <a class="text-white font-light cursor-pointer hover:text-secondary" href="${subItem.subMenuLink || '#'}">${subItem.subMenuText}</a>
        `).join('') : ''}
</div>
</div>
        `).join('') : ''}
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
