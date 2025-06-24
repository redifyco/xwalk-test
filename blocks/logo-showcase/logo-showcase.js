import { buildHeight } from '../../scripts/utils.js';
import '../../scripts/customTag.js';

export default function decorate(block) {
  // Default values definition at the beginning of the function
  const DEFAULT_VALUES = {
    text: {
      title: 'Our Partners',
      subtitle: 'Trusted by leading organizations worldwide',
      buttonText: 'View All Partners',
      partnerName: 'Partner',
      noContentMessage: 'No partners to display at the moment'
    },
    images: {
      placeholder: '/content/dam/placeholder-logo.svg',
      hideOnMissing: false
    },
    links: {
      placeholder: '#',
      hideOnMissing: true
    },
    heights: {
      mobile: '800',
      desktop: '1000'
    },
    minItems: 1
  };

  // Helper function to sanitize and provide defaults for texts
  const sanitizeText = (text, defaultValue = '') => {
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return defaultValue;
    }
    return text.trim();
  };

  // Helper function to sanitize HTML content and provide defaults
  const sanitizeHtmlContent = (htmlContent, defaultValue = '') => {
    if (!htmlContent || typeof htmlContent !== 'string' || htmlContent.trim() === '') {
      return defaultValue;
    }
    return htmlContent.trim();
  };

  // Helper function to handle missing images
  const handleMissingImage = (imageUrl) => {
    if (!imageUrl || imageUrl.trim() === '') {
      return DEFAULT_VALUES.images.hideOnMissing ? null : DEFAULT_VALUES.images.placeholder;
    }
    return imageUrl;
  };

  // Helper function to validate and sanitize links
  const sanitizeLink = (link) => {
    if (!link || typeof link !== 'string' || link.trim() === '') {
      return DEFAULT_VALUES.links.hideOnMissing ? null : DEFAULT_VALUES.links.placeholder;
    }
    const trimmedLink = link.trim();
    
    // Basic URL validation
    if (trimmedLink === '#' || trimmedLink.startsWith('http') || trimmedLink.startsWith('/')) {
      return trimmedLink;
    }
    
    // If it looks like a domain, add https://
    if (trimmedLink.includes('.') && !trimmedLink.includes(' ')) {
      return `https://${trimmedLink}`;
    }
    
    return DEFAULT_VALUES.links.hideOnMissing ? null : DEFAULT_VALUES.links.placeholder;
  };

  // Safe DOM element data extraction with defaults
  const titleRaw = block.querySelector(':scope > div:nth-child(1) div')?.innerHTML;
  const title = sanitizeHtmlContent(titleRaw, DEFAULT_VALUES.text.title);
  
  const subtitleRaw = block.querySelector(':scope > div:nth-child(2) div')?.innerHTML;
  const subtitle = sanitizeHtmlContent(subtitleRaw, DEFAULT_VALUES.text.subtitle);
  
  const buttonTextRaw = block.querySelector(':scope > div:nth-child(3) div a')?.textContent;
  const buttonText = sanitizeText(buttonTextRaw);
  
  const buttonLinkRaw = block.querySelector(':scope > div:nth-child(3) div a')?.href;
  const buttonLink = sanitizeLink(buttonLinkRaw);
  
  const mobileHeightRaw = block.querySelector(':scope > div:nth-child(4) div')?.textContent;
  const mobileHeight = sanitizeText(mobileHeightRaw) || DEFAULT_VALUES.heights.mobile;
  
  const desktopHeightRaw = block.querySelector(':scope > div:nth-child(5) div')?.textContent;
  const desktopHeight = sanitizeText(desktopHeightRaw) || DEFAULT_VALUES.heights.desktop;
  
  const items = block.querySelectorAll(':scope > div:nth-child(n+6) div');
  const resultItems = processDivsToObject(items, DEFAULT_VALUES);

  // Validate minimum items requirement
  const hasValidItems = resultItems.length >= DEFAULT_VALUES.minItems;
  
  const containerSection = document.createElement('section');
  containerSection.className = `flex flex-col items-center justify-center gap-8 px-4 py-14 text-center lg:gap-16 lg:px-16 lg:py-24 ${buildHeight(mobileHeight, desktopHeight)}`;

  // Function to create carousel content
  const createCarouselContent = () => {
    if (!hasValidItems) {
      return `
        <div class="flex items-center justify-center py-20">
          <p class="text-gray-400 text-lg">${DEFAULT_VALUES.text.noContentMessage}</p>
        </div>
      `;
    }

    // Filter out items with missing critical data for mobile carousel
    const validMobileItems = resultItems.filter(item => 
      item.image && item.image !== DEFAULT_VALUES.images.placeholder && item.link
    );

    // For desktop, we can show items even with placeholder images
    const validDesktopItems = resultItems.filter(item => item.image);

    const mobileCarouselItems = validMobileItems.length > 0 ? validMobileItems : validDesktopItems;

    return `
      <div class="relative w-full overflow-hidden">
        <!-- Mobile carousel -->
        <div class="flex md:hidden items-center gap-12 sm:gap-20 w-max ${mobileCarouselItems.length > 0 ? 'animate-[slide_10s_linear_infinite]' : ''}">
          ${mobileCarouselItems.length > 0 ? 
            [...mobileCarouselItems, ...mobileCarouselItems]
              .map((item) => createCarouselItem(item, 'mobile'))
              .join('') 
            : `<p class="text-gray-400">No logos available for mobile display</p>`
          }
        </div>
        <!-- Desktop carousel -->
        <div id="desktop-carousel" class="hidden md:flex gap-10 py-20 justify-center ${validDesktopItems.length === 0 ? 'items-center' : ''}">
          ${validDesktopItems.length > 0 ? 
            validDesktopItems
              .map((item, index) => createCarouselItem(item, 'desktop', index))
              .join('')
            : `<p class="text-gray-400">No logos available for desktop display</p>`
          }
        </div>
      </div>
    `;
  };

  // Function to create individual carousel items
  const createCarouselItem = (item, type, index = 0) => {
    const imageUrl = item.image ?? DEFAULT_VALUES.images.placeholder;
    const altText = item.title ?? DEFAULT_VALUES.text.partnerName;
    const linkUrl = item.link;

    if (type === 'mobile') {
      // For mobile, only show items with valid links
      if (!linkUrl || linkUrl === DEFAULT_VALUES.links.placeholder) {
        return '';
      }
      return `
        <a class="flex items-center" href="${linkUrl}" aria-label="Visit ${altText}">
          <img class="object-contain h-20 sm:h-32 w-auto bg-contain" src="${imageUrl}" alt="${altText}" />
        </a>
      `;
    } else {
      // Desktop carousel
      const translation = index % 2 === 0 ? 'translate-y-0 hover:-translate-y-8' : '-translate-y-20 hover:-translate-y-8';
      
      const content = `
        <img class="object-contain h-48 w-auto bg-contain" src="${imageUrl}" alt="${altText}" />
      `;

      if (!linkUrl || linkUrl === DEFAULT_VALUES.links.placeholder) {
        // No valid link, render as div
        return `
          <div class="size-48 flex ${translation} opacity-0 translate-y-20 transition-all duration-700 ease-out carousel-item" 
               style="transition-delay: ${index * 100}ms">
            ${content}
          </div>
        `;
      } else {
        // Valid link, render as anchor
        return `
          <a class="size-48 flex ${translation} opacity-0 translate-y-20 transition-all duration-700 ease-out carousel-item" 
             style="transition-delay: ${index * 100}ms" 
             href="${linkUrl}" aria-label="Visit ${altText}">
            ${content}
          </a>
        `;
      }
    }
  };

  // Function to create button content
  const createButtonContent = () => {
    if (!buttonText || !buttonLink || buttonLink === DEFAULT_VALUES.links.placeholder) {
      return '';
    }
    return `
      <custom-link href="${buttonLink}">
        ${buttonText}
      </custom-link>
    `;
  };

  // Build the complete HTML
  containerSection.innerHTML = `
    <div class="text-primary prose-em:font-joyful text-3xl uppercase lg:text-7xl">
      ${title}
    </div>
    <div class="text-sm lg:text-xl">
      ${subtitle}
    </div>
    ${createCarouselContent()}
    ${createButtonContent()}
  `;

  // Setup Intersection Observer only if we have valid desktop items
  const desktopCarousel = containerSection.querySelector('#desktop-carousel');
  const carouselItems = desktopCarousel?.querySelectorAll('.carousel-item');
  
  if (desktopCarousel && carouselItems && carouselItems.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          carouselItems.forEach(item => {
            item.classList.remove('opacity-0', 'translate-y-20');
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(desktopCarousel);
  }

  // Handle AEM environment
  const aemEnv = block.getAttribute('data-aue-resource');
  if (!aemEnv) {
    block.textContent = '';
    block.append(containerSection);
  } else {
    block.querySelectorAll(':scope > div:nth-child(n+1) div')
      .forEach(item => item.classList.add('hidden'));
    block.append(containerSection);
  }
}

/**
 * Process logo showcase items with robust error handling
 * @param {NodeList} divs - DOM elements containing logo data
 * @param {Object} defaults - Default values configuration
 * @returns {Array} Processed and validated logo items
 */
function processDivsToObject(divs, defaults) {
  const result = [];

  // Ensure we have divs to process
  if (!divs || divs.length === 0) {
    return result;
  }

  // Process the divs in groups of 3
  for (let i = 0; i < divs.length; i += 3) {
    const imageDiv = divs[i];
    const titleDiv = divs[i + 1];
    const linkDiv = divs[i + 2];

    // Skip incomplete groups
    if (!imageDiv || !titleDiv || !linkDiv) {
      continue;
    }

    // Extract and validate image
    const imageElement = imageDiv.querySelector('img');
    const imageSrc = imageElement?.getAttribute('src')?.trim();
    const image = imageSrc || (defaults.images.hideOnMissing ? null : defaults.images.placeholder);

    // Extract and validate title
    const titleText = titleDiv.textContent?.trim();
    const title = titleText || defaults.text.partnerName;

    // Extract and validate link
    const linkText = linkDiv.textContent?.trim();
    let link = null;
    
    if (linkText) {
      // Basic URL validation and sanitization
      if (linkText === '#' || linkText.startsWith('http') || linkText.startsWith('/')) {
        link = linkText;
      } else if (linkText.includes('.') && !linkText.includes(' ')) {
        link = `https://${linkText}`;
      } else if (!defaults.links.hideOnMissing) {
        link = defaults.links.placeholder;
      }
    } else if (!defaults.links.hideOnMissing) {
      link = defaults.links.placeholder;
    }

    // Only add item if it has at least an image (even if placeholder)
    if (image) {
      result.push({
        image,
        title,
        link
      });
    }
  }

  return result;
}
