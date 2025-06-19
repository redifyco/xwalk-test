import '../../scripts/customTag.js';
import getDesktopHeaderBlock from './desktop.js';
import getMobileHeaderBlock from './mobile.js';

const DESKTOP_BREAKPOINT = 1024;

export default function decorate(block) {
  const logo = {
    dark: block.querySelector(':scope > div:nth-child(1) div img')?.src,
    light: block.querySelector(':scope > div:nth-child(2) div img')?.src
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

  const DESKTOP_BREAKPOINT = 1024;
  const aemEnv = block.getAttribute('data-aue-resource');
  if (!aemEnv) {
    block.textContent = '';
    if (window.innerWidth >= DESKTOP_BREAKPOINT) {
      getDesktopHeaderBlock(block, menuItems, logo, button);
    } else {
      getMobileHeaderBlock(block, menuItems, logo, button, socialLinks);
    }
  } else {
    block.querySelectorAll(':scope > div:nth-child(n+1) div')
      .forEach(item => item.classList.add('hidden'));
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
          ...(subMenuText && { subMenuText }),
          ...(subMenuLink && { subMenuLink })
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



