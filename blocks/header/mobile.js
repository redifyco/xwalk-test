export function headerMobile(block, fragment, scrollThreshold, darkLogo, lightLogo, containerListMenu) {
  const body = document.querySelector('body');
  const buttonLink = fragment.querySelector('.default-content-wrapper > *:nth-last-child(2) a');
  const buttonText = fragment.querySelector('.default-content-wrapper > *:last-child')?.innerHTML;
  const menuState = new Map();

  // Menu container
  const containerMenu = document.createElement('div');
  containerMenu.className = 'hidden h-0 px-4 text-xl w-full';

  const divContainerSocial = document.createElement('div')
  divContainerSocial.className = 'bg-gray-200 flex mt-10'

  // Chevron icon
  const chevronRightIcon = document.createElement('span');
  chevronRightIcon.className = 'flex';
  chevronRightIcon.innerHTML = `<ion-icon class='' size="large" name="chevron-forward-outline"></ion-icon>`;

  if (containerListMenu) {
    containerListMenu.querySelectorAll(':scope > li').forEach((menu) => {
      const title = menu.querySelector('*:first-child');
      const overlayContainer = document.createElement('div');
      const divItems = document.createElement('div');

      divItems.className = 'px-4 flex flex-col';
      overlayContainer.className = 'hidden w-full h-screen overflow-hidden z-10 absolute left-0 px-4 top-0 flex flex-col bg-white';

      const subMenu = menu.querySelector('*:nth-child(2)');
      if (subMenu) {
        subMenu.querySelectorAll(':scope > li').forEach((item) => {
          const link = item.querySelector('a');
          if (link) {
            link.className = 'border-b flex items-center justify-between border-black/20 px-4 w-full py-4';
          }
        });
      }

      title.className = 'border-b flex items-center justify-between border-black/20 px-4 w-full py-4';
      if (menu.querySelector('ul')) {
        title.appendChild(chevronRightIcon.cloneNode(true));

        title.addEventListener('click', () => {
          menuState.set('menu', true);
          toggleOverlay(overlayContainer, menuState.get('menu'));
        });
      } else {
        const text = menu.querySelector('p a').textContent;
        const link = menu.querySelector('p a').href;
        title.innerHTML = `<a href='${link}'>${text}</a>`;
      }

      containerMenu.appendChild(title);

      if (subMenu) {
        const closeOverlayButton = createCloseButton(() => {
          toggleMenu(menuState, mobileContainer, containerMenu, body);
          toggleOverlay(overlayContainer, false)
        });

        const backButton = createBackButton(() => {
          toggleOverlay(overlayContainer, false);
        });

        const subMenuTitle = document.createElement('h6');
        subMenuTitle.textContent = title.textContent;
        subMenuTitle.className = 'text-2xl uppercase py-4 font-semibold text-primary border-b border-primary w-full';

        const containerController = document.createElement('div');
        containerController.className = 'flex justify-between items-center h-24';
        containerController.appendChild(backButton);
        containerController.appendChild(closeOverlayButton);

        overlayContainer.appendChild(containerController);
        divItems.appendChild(subMenuTitle);
        divItems.appendChild(subMenu);
        overlayContainer.appendChild(divItems);
        containerMenu.appendChild(overlayContainer);
      }
    });
  }

  // Mobile container
  const mobileContainer = document.createElement('div');
  const navigationContainer = document.createElement('div');
  navigationContainer.className = 'w-full h-24 justify-between px-4 items-center flex';
  mobileContainer.className = 'h-24 flex flex-col items-center overflow-hidden duration-1000 fixed lg:hidden z-20 w-full bg-white';

  // Hamburger button
  const hamburgerButton = createHamburgerButton(menuState, mobileContainer, containerMenu, body);

  // Button link
  const button = document.createElement('a');
  button.className = 'text-primary font-semibold';
  button.textContent = buttonText;
  button.href = buttonLink.href;

  // Append elements
  navigationContainer.appendChild(hamburgerButton);
  if (darkLogo) {
    darkLogo.classList.remove('hidden');
    navigationContainer.appendChild(darkLogo.cloneNode(true));
  }

  navigationContainer.appendChild(button);
  mobileContainer.appendChild(navigationContainer);
  mobileContainer.appendChild(containerMenu);
  if (button) {
    const buttonContainerSocial = button.cloneNode(true)
    buttonContainerSocial.className = 'border border-primary text-base py-2 px-4 text-primary h-full'

    divContainerSocial.appendChild(buttonContainerSocial)
  }
  containerMenu.appendChild(divContainerSocial)

  return mobileContainer;
}

// Helper function to toggle overlay visibility
function toggleOverlay(overlayContainer, isVisible) {
  if (isVisible) {
    overlayContainer.classList.add('block');
    overlayContainer.classList.remove('hidden');
  } else {
    overlayContainer.classList.remove('block');
    overlayContainer.classList.add('hidden');
  }
}

// Helper function to create a close button
function createCloseButton(onClick) {
  const closeButton = document.createElement('button');
  closeButton.className = 'flex text-primary';
  closeButton.innerHTML = `<ion-icon class='' size="large" name="close-outline"></ion-icon>`;
  closeButton.addEventListener('click', onClick);
  return closeButton;
}

// Helper function to create a back button
function createBackButton(onClick) {
  const backButton = document.createElement('button');
  backButton.className = 'flex';
  backButton.innerHTML = `<span class="flex items-center text-sm"><ion-icon class='' size="small" name="chevron-back-outline"></ion-icon>Back</span>`;
  backButton.addEventListener('click', onClick);
  return backButton;
}

// Helper function to create a hamburger button
function createHamburgerButton(menuState, mobileContainer, containerMenu, body) {
  const hamburgerButton = document.createElement('button');
  hamburgerButton.className = 'cursor-pointer relative size-8';

  const hamburgerIconOpen = document.createElement('span');
  hamburgerIconOpen.innerHTML = `<ion-icon class='text-primary absolute inset-0 transition-transform opacity-100 rotate-0 ease-in-out duration-500' id="hamburgerIconOpen" size="large" name="menu-outline"></ion-icon>`;

  const hamburgerIconClose = document.createElement('span');
  hamburgerIconClose.innerHTML = `<ion-icon class='text-primary absolute inset-0 opacity-0 transition-all rotate-0 ease-in-out duration-500' id="hamburgerIconClose" size="large" name="close-outline"></ion-icon>`;

  hamburgerButton.appendChild(hamburgerIconOpen);
  hamburgerButton.appendChild(hamburgerIconClose);

  hamburgerButton.addEventListener('click', () => {
    toggleMenu(menuState, mobileContainer, containerMenu, body);
  });

  return hamburgerButton;
}

// Helper function to toggle menu visibility
function toggleMenu(menuState, mobileContainer, containerMenu, body) {
  const isOpen = menuState.get('menu');
  menuState.set('menu', !isOpen);

  const hamburgerIconClose = document.getElementById('hamburgerIconClose');
  const hamburgerIconOpen = document.getElementById('hamburgerIconOpen');

  if (menuState.get('menu')) {
    hamburgerIconClose.classList.remove('opacity-0', 'rotate-0');
    hamburgerIconClose.classList.add('opacity-100', 'rotate-90');
    hamburgerIconOpen.classList.remove('opacity-100', 'rotate-0');
    hamburgerIconOpen.classList.add('opacity-0', 'rotate-90');

    mobileContainer.classList.add('h-screen', 'items-start');
    mobileContainer.classList.remove('h-24', 'items-center');
    body.classList.add('overflow-hidden');

    containerMenu.classList.add('block');
    containerMenu.classList.remove('hidden');
  } else {
    hamburgerIconClose.classList.add('opacity-0', 'rotate-90');
    hamburgerIconClose.classList.remove('opacity-100', 'rotate-90');
    hamburgerIconOpen.classList.remove('opacity-0', 'rotate-90');
    hamburgerIconOpen.classList.add('opacity-100', 'rotate-0');

    mobileContainer.classList.remove('h-screen');
    mobileContainer.classList.add('h-24');
    body.classList.remove('overflow-hidden');

    containerMenu.classList.remove('block');
    containerMenu.classList.add('hidden');
  }
}
