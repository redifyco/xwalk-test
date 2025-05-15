import '../../scripts/customTag.js'

export default function getMobileHeaderBlock(block, menuItems, logo, button, socialLinks) {

    const mobileMenu = document.createElement('nav');
    mobileMenu.className = 'w-full fixed z-20';
    mobileMenu.innerHTML = `
        <div id="menu" class="flex items-center justify-between bg-white h-full !py-8 container-layout-padding">
            <button id="hamburger-menu-closed">
                <ion-icon size="large" class="text-primary" name="menu-outline"></ion-icon>
            </button>
            <a href="/">
                <img class="w-40" src="${logo.dark}" alt="">
            </a>
            <div>
                <a class="font-semibold text-sm text-primary" href="${button.link}">${button.text}</a>
            </div>
        </div>
        <div id="overlay-menu-first" class="absolute z-30 py-8 px-4 transition-all duration-300 bg-white inset-0 h-0 w-full opacity-0 pointer-events-none">
            <button id="hamburger-menu-open">
                <ion-icon size="large" class="text-primary" name="close-outline"></ion-icon>
            </button>
            <ul class="pt-8 px-4">
                ${menuItems.length > 0 && menuItems.map((item, index) => `
                    <li class="p-2 font-light text-lg border-gray-200 ${index % 0 ? 'border-t' : 'border-b'}">
                        ${item.isSubMenu
        ? `<button id="subMenuButtonMobile" data-menu-index="${index}" class="flex items-center justify-between w-full">
                                ${item.firstLevelMenuText}
                                <ion-icon name="chevron-forward-outline"></ion-icon>
                            </button>`
        : `<a href="${item.firstLevelMenuLink}">${item.firstLevelMenuText}</a>`}
                    </li>
                `).join('')}
            </ul>
            <div class="mt-5 flex flex-col gap-8 pt-8 px-4">
                <custom-link color="primary" href="${button.link}">${button.text}</custom-link>
                <social-icons 
                    facebook="${socialLinks.facebook}"
                    instagram="${socialLinks.instagram}" 
                    linkedin="${socialLinks.linkedin}" 
                    youtube="${socialLinks.youtube}" 
                    className="!text-black/50" 
                >
                </social-icons>
            </div>
        </div>
        <div id="overlay-menu-second" class="absolute z-30 py-8 px-4 transition-all duration-300 bg-white inset-0 h-screen w-full opacity-0 pointer-events-none">
            <div class="w-full flex justify-between items-center">      
                <button id="hamburger-menu-back" class="flex gap-1 items-center cursor-pointer">
                    <ion-icon size="small" name="chevron-back-outline"></ion-icon>
                    <span>Back</span>
                </button>
                <button id="hamburger-menu-open">
                    <ion-icon size="large" class="text-primary" name="close-outline"></ion-icon>
                </button>
            </div>
            <div id="subMenuSecond"/>
        </div>
    `

    const subMenuButtons = mobileMenu.querySelectorAll('#subMenuButtonMobile');
    subMenuButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const menuIndex = e.currentTarget.dataset.menuIndex;
            const overlaySecond = mobileMenu.querySelector('#overlay-menu-second');
            const subMenuList = mobileMenu.querySelector('#subMenuSecond');
            overlaySecond.classList.add('opacity-100', 'pointer-events-auto');
            overlaySecond.classList.remove('opacity-0', 'pointer-events-none');

            subMenuList.innerHTML = `
                <ul class="pt-8 px-4 overflow-scroll max-h-screen">
                    <li>
                        <p class="text-primary font-semibold pb-2 text-2xl border-b border-b-primary w-full">
                            ${menuItems[menuIndex].firstLevelMenuText}
                        </p>
                    </li>
                    ${menuItems[menuIndex].subMenuItems.map((item, index) => {
                return `
                            <li class="py-2 px-2 font-light text-lg border-gray-200 ${index % 0 ? 'border-t' : 'border-b'}">
                                ${item.subMenuLink ? `<a href="${item.subMenuLink}">${item.subMenuText}</a>` : `<p>${item.subMenuText}</p>`}
                            </li>
                        `
            }).join('')}
                </ul>
            `

        })
    })


    mobileMenu.querySelector('#hamburger-menu-closed').addEventListener('click', (e) => {
        const overlay = document.querySelector('#overlay-menu-first');
        overlay.classList.remove('h-0', 'opacity-0', 'pointer-events-none');
        overlay.classList.add('h-screen', 'opacity-100', 'pointer-events-auto');
        document.body.classList.add('overflow-hidden');
    });

    mobileMenu.querySelectorAll('#hamburger-menu-open').forEach(button => button.addEventListener('click', (e) => {
        const overlayFirst = document.querySelector('#overlay-menu-first');
        const overlaySecond = document.querySelector('#overlay-menu-second');
        overlaySecond.classList.add('opacity-0', 'pointer-events-none')
        overlaySecond.classList.remove('opacity-100', 'pointer-events-auto');
        overlayFirst.classList.remove('h-screen', 'opacity-100', 'pointer-events-auto');
        overlayFirst.classList.add('h-0', 'opacity-0', 'pointer-events-none');
        document.body.classList.remove('overflow-hidden');
    }))

    mobileMenu.querySelector('#hamburger-menu-back').addEventListener('click', (e) => {
        const overlaySecond = document.querySelector('#overlay-menu-second');
        overlaySecond.classList.add('opacity-0', 'pointer-events-none')
        overlaySecond.classList.remove('opacity-100', 'pointer-events-auto');
    })

    block.append(mobileMenu)
}
