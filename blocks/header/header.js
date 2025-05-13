import {getMetadata} from '../../scripts/aem.js';
import {loadFragment} from '../fragment/fragment.js';
import {headerDesktop} from "./desktop.js";
import {headerMobile} from "./mobile.js";


export default async function decorate(block) {
    console.log('block', block)
    const scrollThreshold = 100;
    const navMeta = getMetadata('nav');
    const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
    const fragment = await loadFragment(navPath);

    const darkLogo = fragment.querySelector('p:nth-child(1) img');
    const lightLogo = fragment.querySelector('p:nth-child(2) img');
    const containerListMenu = fragment.querySelector('.default-content-wrapper ul');

    const desktopMenu = containerListMenu.cloneNode(true)
    const mobileMenu = containerListMenu.cloneNode(true)

    // block.textContent = ''

    // block.appendChild(headerDesktop(block, fragment, scrollThreshold, darkLogo, lightLogo, desktopMenu))
    // block.appendChild(headerMobile(block, fragment, scrollThreshold, darkLogo, lightLogo, mobileMenu))


}
