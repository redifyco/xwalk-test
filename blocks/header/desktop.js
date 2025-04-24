import {handleScrollClasses} from "../../scripts/utils.js";
import {createWhiteBorderButton} from "../../components/button.js";

export function headerDesktop(block, fragment, scrollThreshold, darkLogo, lightLogo, containerListMenu) {
  // Create the main desktop container
  const desktopContainer = document.createElement('div');
  desktopContainer.className = 'hidden lg:flex h-24 z-20 px-4 fixed transition-colors duration-300 w-full justify-between items-center gap-2';
  handleScrollClasses(desktopContainer, scrollThreshold, 'bg-white', true);

  // Retrieve button data from the fragment
  const buttonLink = fragment.querySelector('.default-content-wrapper > *:nth-last-child(6) a');
  const buttonText = fragment.querySelector('.default-content-wrapper > *:nth-last-child(5)')?.innerHTML;

  // Create chevron icon
  const chevronDownIcon = createChevronIcon();

  // Handle logo visibility on scroll
  if (darkLogo && lightLogo) {
    setupLogoVisibility(darkLogo, lightLogo, desktopContainer, scrollThreshold);
  }

  // Handle menu items
  if (containerListMenu) {
    setupMenuItems(containerListMenu, chevronDownIcon, scrollThreshold);
    desktopContainer.appendChild(containerListMenu);
  }

  // Add button to the desktop container
  if (buttonLink && buttonText) {
    const button = createWhiteBorderButton(buttonText, buttonLink.href, false, scrollThreshold);
    desktopContainer.appendChild(button);
  }

  return desktopContainer;
}

// Helper function to create a chevron icon
function createChevronIcon() {
  const chevronIcon = document.createElement('span');
  chevronIcon.className = 'flex';
  chevronIcon.innerHTML = `<ion-icon class='' size="large" name="chevron-down-outline"></ion-icon>`;
  return chevronIcon;
}

// Helper function to handle logo visibility on scroll
function setupLogoVisibility(darkLogo, lightLogo, container, scrollThreshold) {
  darkLogo.className = 'lg:hidden';
  container.appendChild(darkLogo);
  container.appendChild(lightLogo);

  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
      lightLogo.classList.add('hidden');
      darkLogo.classList.remove('lg:hidden');
      darkLogo.classList.add('block');
    } else {
      darkLogo.classList.add('lg:hidden');
      darkLogo.classList.remove('block');
      lightLogo.classList.add('block');
      lightLogo.classList.remove('hidden');
    }
  });
}

// Helper function to setup menu items
function setupMenuItems(containerListMenu, chevronDownIcon, scrollThreshold) {
  containerListMenu.className = 'flex gap-4';
  const subMenuStates = new Map();

  containerListMenu.querySelectorAll(':scope > li').forEach((menu) => {
    const subMenu = menu.querySelector('ul');
    if (subMenu) {
      subMenu.className = 'invisible absolute p-4 pt-10 text-lg bg-white flex flex-col gap-2 w-max';
    }

    const menuWrapper = document.createElement('div');
    const menuParagraph = menu.querySelector('p');
    if (!menuParagraph) return;

    const menuTitle = document.createElement('div');
    menuTitle.innerHTML = menuParagraph.innerHTML;
    menuWrapper.appendChild(menuTitle);

    if (subMenu) {
      menuTitle.appendChild(chevronDownIcon.cloneNode(true));
    }
    menuTitle.className = 'text-white text-lg flex items-center after:mt-2 gap-2 after:size-4 !font-medium cursor-pointer';
    handleScrollClasses(menuTitle, scrollThreshold, '!text-primary', true);

    if (subMenu) {
      menuWrapper.appendChild(menuTitle);
      menuWrapper.appendChild(subMenu);
      subMenuStates.set(menuTitle, false);
    } else {
      menuWrapper.appendChild(menuTitle);
    }
    if (subMenu) {
      menuWrapper.appendChild(subMenu);
      subMenuStates.set(menuTitle, false);
    }

    setupMenuInteractions(menuTitle, subMenu, subMenuStates);
    containerListMenu.appendChild(menuWrapper);
  });
}

// Helper function to setup menu interactions
function setupMenuInteractions(menuTitle, subMenu, subMenuStates) {
  const closeAllMenus = () => {
    subMenuStates.forEach((_, title) => {
      const targetMenu = title.nextElementSibling;
      targetMenu.classList.remove('visible');
      targetMenu.classList.add('invisible');
      subMenuStates.set(title, false);
    });
  };

  document.addEventListener('click', (event) => {
    if (!event.target.closest('header')) {
      closeAllMenus();
    }
  });

  menuTitle.addEventListener('click', () => {
    const isCurrentlyOpen = subMenuStates.get(menuTitle);

    // Close all submenus
    closeAllMenus();

    // Toggle the clicked submenu
    if (!isCurrentlyOpen) {
      subMenu.classList.remove('invisible');
      subMenu.classList.add('visible');
      subMenu.querySelectorAll(':scope > li').forEach((item) => {
        item.className = 'after:size-4 flex items-center gap-2 after:bg-[url(/assets/icons/chevron-right-black.svg)] after:bg-contain after:bg-no-repeat after:block';
      });
      subMenuStates.set(menuTitle, true);
    }
  });
}
