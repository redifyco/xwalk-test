import {getMetadata} from '../../scripts/aem.js';
import {loadFragment} from '../fragment/fragment.js';
import {createWhiteBorderButton} from "../../components/button.js";
import {handleScrollClasses} from "../../scripts/utils.js";


export default async function decorate(block) {
  const scrollThreshold = 400;
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  console.log('fragment', fragment)
  console.log('block', block)

  block.textContent = ''

  block.className = 'flex px-4 fixed w-full justify-between items-center gap-2';
  handleScrollClasses(block, scrollThreshold, 'bg-white', true);


  const logoImage = fragment.querySelector('picture img')
  if (logoImage) {
    block.appendChild(logoImage)
  }

  const containerListMenu = fragment.querySelector('.default-content-wrapper ul');
  if (containerListMenu) {
    containerListMenu.className = 'flex gap-4'
    const subMenuStates = new Map();
    containerListMenu.querySelectorAll(':scope > li').forEach((menu) => {
      const subMenu = menu.querySelector('ul');
      subMenu.className = 'invisible absolute p-4 pt-10 text-lg bg-white shadow-lg flex flex-col gap-2 w-max';
      const menuWrapper = document.createElement('div');
      const menuTitle = menuWrapper.appendChild(menu.querySelector('p'));
      const afterCSS = 'after:bg-[url(/assets/icons/chevron-down-theme.svg)] after:flex after:bg-contain after:bg-no-repeat'
      menuTitle.className = 'text-white text-lg flex items-center after:mt-2 gap-2 after:size-4 !font-medium cursor-pointer';
      handleScrollClasses(menuTitle, scrollThreshold, '!text-primary', true);

      menuWrapper.appendChild(menuTitle);
      menuWrapper.appendChild(subMenu);

      subMenuStates.set(menuTitle, false);

      const closeAllMenu = () => {
        // Close all submenus
        subMenuStates.forEach((_, title) => {
          const targetMenu = title.nextElementSibling;
          targetMenu.classList.remove('visible')
          targetMenu.classList.add('invisible')

          subMenuStates.set(title, false);
        });
      }

      document.addEventListener('click', (event) => {
        if (!event.target.closest('header')) {
          closeAllMenu();
        }
      });

      menuTitle.addEventListener("click", () => {
        const isCurrentlyOpen = subMenuStates.get(menuTitle);

        // Close all submenus
        closeAllMenu()

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
      containerListMenu.appendChild(menuWrapper);
    });

    block.appendChild(containerListMenu)
  }

  const buttonLink = fragment.querySelector('.default-content-wrapper > *:nth-last-child(2)')?.innerHTML;
  const buttonText = fragment.querySelector('.default-content-wrapper > *:last-child')?.innerHTML;
  if (buttonLink && buttonText) {
    block.appendChild(createWhiteBorderButton(buttonText, buttonLink, false, scrollThreshold))
  }

}
