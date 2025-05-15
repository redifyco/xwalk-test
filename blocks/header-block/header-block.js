import '../../scripts/customTag.js'


export default function decorate(block) {
    const darkLogo = block.querySelector(':scope > div:nth-child(1) div img')?.src;
    const lightLogo = block.querySelector(':scope > div:nth-child(2) div img')?.src;
    const buttonLink = block.querySelector(':scope > div:nth-child(3) div a')?.href;
    const buttonText = block.querySelector(':scope > div:nth-child(4) div p')?.textContent;
    const facebookLink = block.querySelector(':scope > div:nth-child(5) div a')?.href;
    const instagramLink = block.querySelector(':scope > div:nth-child(6) div a')?.href;
    const linkedinLink = block.querySelector(':scope > div:nth-child(7) div a')?.href;
    const youtubeLink = block.querySelector(':scope > div:nth-child(8) div a')?.href;
    const menuItemsDiv = block.querySelectorAll(':scope > div:nth-child(n+9) div');
    const resultMenuItems = processDivsToObject(menuItemsDiv)
    let state = {menuOpen: false, currentMenu: 0};
    let containerSection = document.createElement('section');
    console.log('resultMenuItems', resultMenuItems)

    function setState(newState) {
        state = {...state, ...newState};
        console.log('state', state)
        render();
    }


    containerSection.className = 'container-layout-padding bg-white w-full z-20 fixed !py-8';

    const desktopMenu = document.createElement('nav');
    desktopMenu.innerHTML = `
        <div class="flex justify-between items-center">
            <a href="/">
                <img src="${darkLogo}" alt="MSC Foundation logo">
            </a>
            <div>
                <ul class="flex gap-4">
                    ${resultMenuItems.length > 0 && resultMenuItems.map((item, index) => {
        console.log('item', item)
        return `
               <li class="flex items-center gap-1 relative">
                                ${item.isSubMenu
            ? `<a href="${item.firstLevelMenuLink}">${item.firstLevelMenuText}</a>`
            : `<button onclick="window.setState({menuOpen: true, currentMenu: ${index}})">${item.firstLevelMenuText}</button>`}
                                ${item.isSubMenu ? `<ion-icon name="chevron-down-outline"></ion-icon>` : ''}
                                ${item.isSubMenu && state.menuOpen ?
            window.SubMenu(item)
            : ''}
                            </li>
                        `
    }).join('')}
                </ul>
            </div>
            <div>
                <custom-button class="bg-orange" color="primary" href="${buttonLink}">${buttonText}</custom-button>
            </div>
        </div>
    `

    function render() {
        containerSection.innerHTML = `
        <!--DESKTOP NAV-->
        ${desktopMenu.outerHTML}
    `
    }


    const aemEnv = block.getAttribute('data-aue-resource');
    if (!aemEnv) {
        block.textContent = '';
    } else {
        const menuItemsDiv = block.querySelectorAll(':scope > div:nth-child(n+9) div');
        menuItemsDiv.forEach(item => item.classList.add('hidden'));
    }

    block.append(containerSection);
    render();

    window.setState = setState;
}


const SubMenu = (item) => {

    return `
    <ul class="absolute top-16  bg-white px-6 py-4 min-w-72">
                                        ${item.subMenuItems.length > 0 && item.subMenuItems.map(submenuItem => `
                                            <li class="flex py-1.5 items-center gap-1">
                                                ${submenuItem.subMenuLink
        ? `<a href="${submenuItem.subMenuLink}">${submenuItem.subMenuText}</a>
                                                       <ion-icon name="chevron-forward-outline"></ion-icon>`
        : `<p>${submenuItem.subMenuText}</p>`}
                                            </li>
                                        `).join('')}
                                    </ul>
    `
}


function processDivsToObject(divs) {
    const result = [];
    const MENU_ITEMS = 15;

    // Process the divs in groups
    for (let i = 0; i < divs.length; i += 33) {
        const resultSubMenu = [];
        const firstLevelMenuText = divs[i].querySelector('p')?.textContent;
        const firstLevelMenuLink = divs[i + 1].querySelector('a')?.href;
        const isSubMenu = divs[i + 2].querySelector('p')?.textContent === 'true';

        for (let j = 0; j < MENU_ITEMS; j++) {
            const textIndex = i + 3 + (j * 2);
            const linkIndex = i + 4 + (j * 2);
            resultSubMenu.push({
                subMenuText: divs[textIndex]?.querySelector('p')?.textContent,
                subMenuLink: divs[linkIndex]?.querySelector('a')?.href
            });
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


window.SubMenu = SubMenu;
