import {getMetadata} from '../../scripts/aem.js';
import {loadFragment} from '../fragment/fragment.js';


export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = ''


  const logoImage = fragment.querySelector('picture img')
  block.appendChild(logoImage)

  const menuContainer = fragment.querySelector('.default-content-wrapper ul');
  const subMenuStates = new Map();

  menuContainer.querySelectorAll(':scope > li').forEach((menu) => {
    const subMenu = menu.querySelector('ul');
    subMenu.className = 'invisible absolute p-4 pt-10 text-lg bg-white shadow-lg flex flex-col gap-2 w-max';
    const menuWrapper = document.createElement('div');
    const menuTitle = menuWrapper.appendChild(menu.querySelector('p'));
    menuTitle.className = 'text-primary text-lg flex items-center after:mt-2 gap-2 after:size-4 after:bg-[url(/assets/icons/chevron-down-theme.svg)] after:flex after:bg-contain after:bg-no-repeat !font-medium cursor-pointer';

    menuWrapper.appendChild(menuTitle);
    menuWrapper.appendChild(subMenu);

    subMenuStates.set(menuTitle, false);

    menuTitle.addEventListener("click", () => {
      const isCurrentlyOpen = subMenuStates.get(menuTitle);

      // Close all submenus
      subMenuStates.forEach((_, title) => {
        const targetMenu = title.nextElementSibling;
        targetMenu.classList.remove('visible')
        targetMenu.classList.add('invisible')

        subMenuStates.set(title, false);
      });

      // Toggle clicked submenu
      if (!isCurrentlyOpen) {
        subMenu.classList.remove('invisible')
        subMenu.classList.add('visible')
        subMenu.querySelectorAll(':scope > li').forEach((item) => {
          item.className = ' after:size-4 flex items-center gap-2 after:bg-[url(/assets/icons/chevron-right-black.svg)] after:bg-contain after:bg-no-repeat after:block'
        })
        subMenuStates.set(menuTitle, true);
      }
    });

    block.appendChild(menuWrapper);
  });


  const buttonLink = fragment.querySelector('div:nth-child(4) div p a');

  /*WRAPPER*/
  block.className = 'flex fixed items-center gap-2';

  /*CONTAINER*/

  /*APPEND*/

}
