import {extractTagsByType, returnFocusAreaIcon} from "../../scripts/utils.js";
import '../../scripts/customTag.js';

export default function decorate(block) {

    const mainTitle = block.querySelector(':scope > div:nth-child(1) div p')?.textContent;
    const secondTitle = block.querySelector(':scope > div:nth-child(2) div p')?.textContent;
    const description = block.querySelector(':scope > div:nth-child(3) div')?.innerHTML;
    const tags = block.querySelector(':scope > div:nth-child(4) div p')?.textContent;
    const facebookLink = block.querySelector(':scope > div:nth-child(5) div p')?.textContent;
    const instagramLink = block.querySelector(':scope > div:nth-child(6) div p')?.textContent;
    const linkedinLink = block.querySelector(':scope > div:nth-child(7) div p')?.textContent;
    const youtubeLink = block.querySelector(':scope > div:nth-child(8) div p')?.textContent;
    const extractedTags = extractTagsByType(tags, 'mscfoundation:focus-area/');


    const containerSection = document.createElement('section');
    containerSection.className = 'fixed flex items-center justify-center inset-0 top-0 left-0 h-full w-full bg-black/30 z-30 py-32 w-full px-32';

    containerSection.innerHTML = `
        <div class="bg-white shadow relative flex flex-col gap-8 p-10 rounded-lg">
                <h5 class="text-5xl border-b w-full pb-3">${mainTitle}</h5>
                <h6 class="text-3xl text-primary">${secondTitle}</h6>
                <div class="font-light">${description}</div>
            <button class="text-primary cursor-pointer absolute right-8 top-4" id="close-button">
                <ion-icon class="text-5xl" name="close-outline"></ion-icon>
            </button>
            <div class="flex justify-end gap-2">
                <div class="w-full">          
                 <social-icons 
                 className="!text-primary"
                        facebook="${facebookLink}" 
                        instagram="${instagramLink}" 
                        linkedin="${linkedinLink}" 
                        youtube="${youtubeLink}">
                    </social-icons>
</div>
                ${extractedTags.length > 0 ? extractedTags.map(tag => returnFocusAreaIcon(tag)).join('') : ''}
            </div>
        </div>
    `;

    containerSection.querySelector('#close-button').addEventListener('click', () => {
        containerSection.remove();
    })


    block.textContent = '';
    block.append(containerSection);
}
