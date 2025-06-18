import '../../scripts/customTag.js';

export default function getDesktopHeaderBlock(block, menuItems, logo, button,) {
  const SCROLL_THRESHOLD = 200;
  const desktopMenu = document.createElement('nav');
  desktopMenu.className = 'container-layout-padding w-full z-20 !py-8 fixed';
  desktopMenu.innerHTML = `
        <div class="flex justify-between items-center">
            <a href="/">
                <img class="max-w-32" src="${logo.light}" id="logo-image" alt="MSC Foundation logo">
            </a>
            <div>
                <ul class="flex gap-4">
                    ${menuItems.length > 0 && menuItems.map(generateMenuItem)
    .join('')}
                </ul>
            </div>
            <div id="custom-button-container">
                <custom-link color="white" href="${button.link}">${button.text}</custom-link>
            </div>
        </div>
    `;

  // Get all menu items with submenus
  const menuItemsWithSubmenus = desktopMenu.querySelectorAll('li');

  // Add hover event listeners to each menu item
  // Add hover event listeners to each menu item
  // Add hover event listeners to each menu item
  menuItemsWithSubmenus.forEach(menuItem => {
    const submenu = menuItem.querySelector('ul');
    const button = menuItem.querySelector('#subMenuButton');
    const icon = button?.querySelector('ion-icon');
    let closeTimeout;

    if (!submenu) return;

    // Show submenu on mouse enter menu item
    menuItem.addEventListener('mouseenter', () => {
      clearTimeout(closeTimeout); // Cancel any pending close action
      submenu.classList.remove('opacity-0', 'pointer-events-none');
      if (icon) icon.setAttribute('name', 'chevron-up-outline');
    });

    // Also keep submenu open when mouse enters the submenu itself
    submenu.addEventListener('mouseenter', () => {
      clearTimeout(closeTimeout); // Cancel any pending close action
    });

    // Handle mouse leaving menu item
    menuItem.addEventListener('mouseleave', (event) => {
      // Check if mouse moved to the submenu
      if (event.relatedTarget === submenu || submenu.contains(event.relatedTarget)) {
        return; // Don't close if mouse moved to submenu
      }

      // Start delay timer to close submenu
      closeTimeout = setTimeout(() => {
        submenu.classList.add('opacity-0', 'pointer-events-none');
        if (icon) icon.setAttribute('name', 'chevron-down-outline');
      }, 300); // 300ms delay
    });

    // Handle mouse leaving submenu
    submenu.addEventListener('mouseleave', (event) => {
      // Check if mouse moved back to parent menu item
      if (event.relatedTarget === menuItem || menuItem.contains(event.relatedTarget)) {
        return; // Don't close if mouse moved to parent menu item
      }

      // Start delay timer to close submenu
      closeTimeout = setTimeout(() => {
        submenu.classList.add('opacity-0', 'pointer-events-none');
        if (icon) icon.setAttribute('name', 'chevron-down-outline');
      }, 300); // 300ms delay
    });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      desktopMenu.classList.add('bg-white');
      desktopMenu.classList.add('shadow-md');
      document.querySelector('#custom-button-container').innerHTML = `
            <custom-link color="primary" href="${button.link}">${button.text}</custom-link>
            `;

      document.querySelectorAll('#submenuText')
        .forEach(item => {
          item.classList.remove('text-white');
          item.classList.add('text-primary');
        });
      document.querySelectorAll('#subMenuButton')
        .forEach(item => {
          item.classList.remove('text-white');
          item.classList.add('text-primary');
        });
      document.querySelector('#logo-image').src = logo.dark;
    } else {
      desktopMenu.classList.remove('bg-white');
      desktopMenu.classList.remove('shadow-md');
      document.querySelector('#logo-image').src = logo.light;
      document.querySelectorAll('#submenuText')
        .forEach(item => {
          item.classList.remove('text-primary');
          item.classList.add('text-white');
        });
      document.querySelectorAll('#subMenuButton')
        .forEach(item => {
          item.classList.remove('text-primary');
          item.classList.add('text-white');
        });
      document.querySelector('#custom-button-container').innerHTML = `
            <custom-link color="white" href="${button.link}">${button.text}</custom-link>
            `;
    }
  });

  if (window.scrollY > SCROLL_THRESHOLD) {
    desktopMenu.classList.add('bg-white');
    desktopMenu.classList.add('shadow-md');
    if (document.querySelector('#logo-image')) {
      document.querySelector('#logo-image').src = logo.light;
    }
  }

  block.append(desktopMenu);
}

function generateMenuItem(item) {
  return `
        <li class="flex items-center gap-1 relative">
            ${item.isSubMenu
    ? `<button class="cursor-pointer text-lg text-white font-medium flex items-center gap-1" id="subMenuButton">
                ${item.firstLevelMenuText}
                <ion-icon id="chevron-down-outline" name="chevron-down-outline"></ion-icon>
            </button>`
    : `<a id="submenuText" class="cursor-pointer text-white text-lg font-medium" href="${item.firstLevelMenuLink}">${item.firstLevelMenuText}</a>`}
            ${generateSubMenu(item)}
        </li>
    `;
}

function generateSubMenu(item) {
  if (!item.isSubMenu) return '';
  return `
        <ul class="absolute shadow-md transition-all max-h-[80vh] duration-300 top-16 left-0 bg-white px-6 py-4 min-w-72 opacity-0 pointer-events-none">
            ${item.subMenuItems.map(submenuItem => `
                <li class="flex py-2 items-center gap-1">
                    ${submenuItem.subMenuLink
    ? `<a class="font-light text-black text-lg cursor-pointer" href="${submenuItem.subMenuLink}">${submenuItem.subMenuText}</a>
            <ion-icon name="chevron-forward-outline"></ion-icon>`
    : `<p class="font-light text-black text-lg">${submenuItem.subMenuText}</p>`}
                </li>
            `)
    .join('')}
        </ul>
    `;
}
