import {buildHeight, returnBoolean} from "../../scripts/utils.js";
import "../../scripts/customTag.js";

export default async function decorate(block) {
    // Default values definition at the beginning of the function
    const DEFAULT_VALUES = {
        image: {
            placeholder: '/content/dam/mscfoundation/placeholders/placeholder-hero.jpg',
            hideOnMissing: false
        },
        text: {
            title: 'Welcome',
            subTitle: 'Learn more about us',
            noContent: 'Content not available'
        },
        social: {
            defaultLabel: 'Follow us',
            hideOnMissing: true
        },
        heights: {
            mobile: 'h-screen',
            desktop: 'h-screen'
        }
    };

    // Helper function to handle missing images
    const handleMissingImage = (imageUrl) => {
        if (!imageUrl || imageUrl.trim() === '') {
            return DEFAULT_VALUES.image.hideOnMissing ? null : DEFAULT_VALUES.image.placeholder;
        }
        return imageUrl;
    };

    // Helper function to sanitize and provide defaults for texts
    const sanitizeText = (text, defaultValue = '') => {
        if (!text || typeof text !== 'string' || text.trim() === '') {
            return defaultValue;
        }
        return text.trim();
    };

    // Helper function to handle valid social links
    const sanitizeLink = (link) => {
        if (!link || typeof link !== 'string' || link.trim() === '') {
            return null;
        }
        const trimmedLink = link.trim();
        try {
            new URL(trimmedLink);
            return trimmedLink;
        } catch {
            if (trimmedLink.startsWith('www.') || trimmedLink.includes('.')) {
                try {
                    new URL(`https://${trimmedLink}`);
                    return `https://${trimmedLink}`;
                } catch {
                    return null;
                }
            }
            return null;
        }
    };

    // Safe DOM element data extraction
    const backgroundImageRaw = block.querySelector(':scope > div:nth-child(1) img')?.src;
    const backgroundImage = handleMissingImage(backgroundImageRaw);
    
    const titleRaw = block.querySelector(':scope > div:nth-child(2) div')?.innerHTML;
    const title = sanitizeText(titleRaw, DEFAULT_VALUES.text.title);
    
    const subTitleRaw = block.querySelector(':scope > div:nth-child(3)')?.innerHTML;
    const subTitle = sanitizeText(subTitleRaw, DEFAULT_VALUES.text.subTitle);
    
    // Boolean values handling with fallback
    const isSocialBox = returnBoolean(block, 4) ?? false;
    const isCenteredTitle = returnBoolean(block, 5) ?? false;
    const isArrowDown = returnBoolean(block, 6) ?? false;
    
    // Social links handling with validation
    const facebookLink = sanitizeLink(block.querySelector(":scope > div:nth-child(7) a")?.href);
    const linkedinLink = sanitizeLink(block.querySelector(":scope > div:nth-child(8) a")?.href);
    const instagramLink = sanitizeLink(block.querySelector(":scope > div:nth-child(9) a")?.href);
    const youtubeLink = sanitizeLink(block.querySelector(":scope > div:nth-child(10) a")?.href);
    
    // Heights handling with fallback
    const mobileHeightRaw = block.querySelector(":scope > div:nth-child(11) p")?.textContent;
    const mobileHeight = sanitizeText(mobileHeightRaw, DEFAULT_VALUES.heights.mobile);
    
    const desktopHeightRaw = block.querySelector(":scope > div:nth-child(12) p")?.textContent;
    const desktopHeight = sanitizeText(desktopHeightRaw, DEFAULT_VALUES.heights.desktop);
    
    const calculatedSectionHeight = buildHeight(mobileHeight, desktopHeight) ?? 'h-screen';

    // Check if there are valid social links
    const hasValidSocialLinks = [facebookLink, linkedinLink, instagramLink, youtubeLink]
        .some(link => link !== null);

    // Main container creation
    const containerSection = document.createElement('section');
    containerSection.className = 'flex flex-col bg-cover bg-center bg-no-repeat text-white';
    
    // Conditional background image handling
    if (backgroundImage && backgroundImage !== DEFAULT_VALUES.image.placeholder) {
        containerSection.style.backgroundImage = `url('${backgroundImage}')`;
    } else if (backgroundImage === DEFAULT_VALUES.image.placeholder) {
        containerSection.style.backgroundImage = `url('${DEFAULT_VALUES.image.placeholder}')`;
        containerSection.classList.add('hero-placeholder-bg');
    } else {
        containerSection.classList.add('bg-gray-800');
    }

    // Function to create title content
    const createTitleContent = () => {
        if (isCenteredTitle) {
            return `
                <div class="font-medium prose-em:font-joyful flex justify-start text-start md:text-center md:justify-center z-10 text-5xl md:text-6xl lg:text-8xl uppercase text-white">
                    ${title}
                </div>
            `;
        } else {
            return `
                <div class="text-5xl prose-em:font-joyful flex font-semibold lg:text-[130px] 2xl:text-8xl 2xl:text-[180px] justify-start">
                    ${title}
                </div>
            `;
        }
    };

    // Function to create social content
    const createSocialContent = () => {
        if (!isSocialBox || !hasValidSocialLinks) {
            return '';
        }

        const socialAttributes = [
            facebookLink ? `facebook="${facebookLink}"` : '',
            instagramLink ? `instagram="${instagramLink}"` : '',
            linkedinLink ? `linkedin="${linkedinLink}"` : '',
            youtubeLink ? `youtube="${youtubeLink}"` : ''
        ].filter(attr => attr !== '').join(' ');

        return `
            <div class="absolute right-16 bottom-16 hidden h-auto gap-2 lg:flex">
                <social-icons ${socialAttributes}>
                </social-icons>
            </div>
        `;
    };

    // Function to create arrow content
    const createArrowContent = () => {
        if (!isArrowDown) {
            return '';
        }

        return `
            <svg class="flex mt-10 justify-center w-full h-20 md:h-40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 105" fill="none" aria-label="Scroll down">
                <path d="M38.5 101.855L74.416 65.9395L75.4766 67L38 104.477L37.7383 104.215L37.4766 104.477L0 67L1.06055 65.9395L37 101.879V0H38.5V101.855Z" fill="white"/>
            </svg>
        `;
    };

    // Final HTML construction
    containerSection.innerHTML = `
        <div class="relative z-10 flex w-full flex-col justify-end gap-3 px-4 pb-14 md:justify-center xl:px-16 xl:py-11 ${calculatedSectionHeight}">
            ${createTitleContent()}
            
            <div class="text-sm flex font-light lg:text-xl 2xl:text-2xl ${
                isCenteredTitle ? 'justify-start md:justify-center text-start md:text-center' : 'justify-start text-start'
            }">
                ${subTitle}
            </div>
            
            ${createSocialContent()}
            ${createArrowContent()}
        </div>
    `;

    // DOM cleanup and content addition
    block.textContent = '';
    block.append(containerSection);
}
