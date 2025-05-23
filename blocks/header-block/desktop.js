import '../../scripts/customTag.js';

export default function getDesktopHeaderBlock(block, menuItems, logo, button,) {
    const SCROLL_THRESHOLD = 200;
    const desktopMenu = document.createElement('nav');
    desktopMenu.className = 'container-layout-padding w-full z-20 !py-8 fixed';
    desktopMenu.innerHTML = `
        <div class="flex justify-between items-center">
            <a href="/">
                <img src="${logo.light}" id="logo-image" alt="MSC Foundation logo">
            </a>
            <div>
                <ul class="flex gap-4">
                    ${menuItems.length > 0 && menuItems.map(generateMenuItem).join('')}
                </ul>
            </div>
            <div id="custom-button-container">
                <custom-link color="white" href="${button.link}">${button.text}</custom-link>
            </div>
        </div>
    `;

    let currentOpenSubmenu = null;
    const subMenuButtons = desktopMenu.querySelectorAll('#subMenuButton');

    const closeSubmenu = (submenu) => {
        if (!submenu) return;
        submenu.classList.add('opacity-0', 'pointer-events-none');
        const icon = submenu.closest('li').querySelector('ion-icon');
        icon.setAttribute('name', 'chevron-down-outline');
        currentOpenSubmenu = null;
    };

    subMenuButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const submenu = button.closest('li').querySelector('ul');
            const icon = button.querySelector('ion-icon');

            if (currentOpenSubmenu && currentOpenSubmenu !== submenu) {
                closeSubmenu(currentOpenSubmenu);
            }

            submenu.classList.toggle('opacity-0');
            submenu.classList.toggle('pointer-events-none');
            icon.setAttribute('name', submenu.classList.contains('opacity-0') ? 'chevron-down-outline' : 'chevron-up-outline');
            currentOpenSubmenu = submenu.classList.contains('opacity-0') ? null : submenu;
        });
    });

    window.addEventListener('click', (e) => {
        if (currentOpenSubmenu && !currentOpenSubmenu.contains(e.target) &&
            !e.target.closest('#subMenuButton')) {
            closeSubmenu(currentOpenSubmenu);
        }
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > SCROLL_THRESHOLD) {
            desktopMenu.classList.add('bg-white');
            desktopMenu.classList.add('shadow-md');
            document.querySelector('#custom-button-container').innerHTML = `
            <custom-link color="primary" href="${button.link}">${button.text}</custom-link>
            `

            document.querySelectorAll('#submenuText').forEach(item => {
                item.classList.remove('text-white')
                item.classList.add('text-primary')
            });
            document.querySelectorAll('#subMenuButton').forEach(item => {
                item.classList.remove('text-white')
                item.classList.add('text-primary')
            });
            document.querySelector('#logo-image').src = logo.dark;
        } else {
            desktopMenu.classList.remove('bg-white');
            desktopMenu.classList.remove('shadow-md');
            document.querySelector('#logo-image').src = logo.light;
            document.querySelectorAll('#submenuText').forEach(item => {
                item.classList.remove('text-primary')
                item.classList.add('text-white')
            });
            document.querySelectorAll('#subMenuButton').forEach(item => {
                item.classList.remove('text-primary')
                item.classList.add('text-white')
            });
            document.querySelector('#custom-button-container').innerHTML = `
            <custom-link color="white" href="${button.link}">${button.text}</custom-link>
            `
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
        ? `<a class="font-light text-black text-lg" href="${submenuItem.subMenuLink}">${submenuItem.subMenuText}</a>
            <ion-icon name="chevron-forward-outline"></ion-icon>`
        : `<p class="font-light text-black text-lg">${submenuItem.subMenuText}</p>`}
                </li>
            `).join('')}
        </ul>
    `;
}
