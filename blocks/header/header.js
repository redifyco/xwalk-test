import {getMetadata} from '../../scripts/aem.js';
import {loadFragment} from '../fragment/fragment.js';


export default async function decorate(block) {
    // load nav as fragment
    const navMeta = getMetadata('nav');
    const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
    const fragment = await loadFragment(navPath);
    const section1 = fragment.querySelector('section');
    console.log('section1', section1)

    // decorate nav DOM
    block.textContent = '';
    const nav = document.createElement('nav');
    console.log('nav', nav)
    nav.id = 'nav';

    block.append(section1)


}
