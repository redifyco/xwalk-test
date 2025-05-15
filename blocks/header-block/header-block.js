import '../../scripts/customTag.js';

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

    const containerSection = document.createElement('section');
    containerSection.className = 'container-layout-padding w-full z-20 fixed !py-8';

    const desktopMenu = document.createElement('nav');
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
            <div>
                <custom-button class="bg-orange" color="primary" href="${button.link}">${button.text}</custom-button>
            </div>
        </div>
    `;

    containerSection.innerHTML = `
        <!--DESKTOP NAV-->
        ${desktopMenu.outerHTML}
    `

    let currentOpenSubmenu = null;
    const subMenuButtons = containerSection.querySelectorAll('#subMenuButton');

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
            containerSection.classList.add('bg-white');
            containerSection.classList.add('shadow-md');
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
            containerSection.classList.remove('bg-white');
            containerSection.classList.remove('shadow-md');
            document.querySelector('#logo-image').src = logo.light;
            document.querySelectorAll('#submenuText').forEach(item => {
                item.classList.remove('text-primary')
                item.classList.add('text-white')
            });
            document.querySelectorAll('#subMenuButton').forEach(item => {
                item.classList.remove('text-primary')
                item.classList.add('text-white')
            });
        }
    });

    if (window.scrollY > SCROLL_THRESHOLD) {
        containerSection.classList.add('bg-white');
        containerSection.classList.add('shadow-md');
        document.querySelector('#logo-image').src = logo.light;
    }


    const aemEnv = block.getAttribute('data-aue-resource');
    if (!aemEnv) {
        block.textContent = '';
    } else {
        block.querySelectorAll(':scope > div:nth-child(n+1) div').forEach(item => item.classList.add('hidden'));
        // const menuItemsDiv = block.querySelectorAll(':scope > div:nth-child(n+9) div');
        // menuItemsDiv.forEach(item => item.classList.add('hidden'));
    }

    block.append(containerSection);

}


const MENU_ITEMS = 15;
const SCROLL_THRESHOLD = 200;

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
        <ul class="absolute shadow-md transition-all duration-300 top-16 left-0 bg-white px-6 py-4 min-w-72 opacity-0 pointer-events-none">
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


