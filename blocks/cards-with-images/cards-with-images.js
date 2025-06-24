import { processDivsToObjectCardsWithImages } from '../../scripts/utils.js';

export default function decorate(block) {
  // Default values configuration (in English)
  const DEFAULT_VALUES = {
    section: {
      title: 'Our Solutions',
      subTitle: 'Discover our innovative services and solutions designed for your needs.',
      buttonText: 'Learn More',
      buttonLink: '#'
    },
    card: {
      image: '/content/dam/mscfoundation/placeholders/placeholder-card.jpg', // Background placeholder
      icon: '/content/dam/mscfoundation/placeholders/placeholder-icon.svg', // Icon placeholder
      title: 'Service Available',
      description: 'Service description not yet available.',
      style: 'titleOnTop',
      hideOnMissing: false // true to hide empty cards
    },
    validation: {
      minTextLength: 1,
      maxCardsToShow: 4 // Maximum cards limit
    }
  };

  // Helper functions for validation and sanitization
  const isValidUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    return trimmed !== '' && !trimmed.startsWith('data:') && trimmed !== '#' && trimmed !== '';
  };

  const sanitizeText = (text, fallback = '') => {
    if (!text || typeof text !== 'string') return fallback;
    const cleaned = text.trim();
    return cleaned.length >= DEFAULT_VALUES.validation.minTextLength ? cleaned : fallback;
  };

  const sanitizeHtml = (html, fallback = '') => {
    if (!html || typeof html !== 'string') return fallback;
    
    // Remove script tags and other dangerous elements
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const dangerousElements = tempDiv.querySelectorAll('script, object, embed, iframe, form, input, button');
    dangerousElements.forEach(el => el.remove());
    
    const cleaned = tempDiv.innerHTML.trim();
    return cleaned.length >= DEFAULT_VALUES.validation.minTextLength ? cleaned : fallback;
  };

  const validateImageUrl = (url, fallback) => {
    return isValidUrl(url) ? url : fallback;
  };

  const validateStyle = (style) => {
    const validStyles = ['titleOnTop', 'titleOnBottom'];
    return validStyles.includes(style) ? style : DEFAULT_VALUES.card.style;
  };

  // Safe section data extraction
  const extractSectionData = () => {
    try {
      const sectionTitle = sanitizeHtml(
        block.querySelector(':scope > div:nth-child(1) div p')?.textContent,
        DEFAULT_VALUES.section.title
      );
      
      const sectionSubTitle = sanitizeHtml(
        block.querySelector(':scope > div:nth-child(2) div p')?.textContent,
        DEFAULT_VALUES.section.subTitle
      );
      
      const sectionButtonText = sanitizeText(
        block.querySelector(':scope > div:nth-child(3) div p')?.textContent,
        DEFAULT_VALUES.section.buttonText
      );
      
      const sectionButtonLink = validateImageUrl(
        block.querySelector(':scope > div:nth-child(4) div p a')?.href,
        DEFAULT_VALUES.section.buttonLink
      );

      return {
        sectionTitle,
        sectionSubTitle,
        sectionButtonText,
        sectionButtonLink
      };
    } catch (error) {
      console.warn('Cards with Images: Error extracting section data:', error);
      return {
        sectionTitle: DEFAULT_VALUES.section.title,
        sectionSubTitle: DEFAULT_VALUES.section.subTitle,
        sectionButtonText: DEFAULT_VALUES.section.buttonText,
        sectionButtonLink: DEFAULT_VALUES.section.buttonLink
      };
    }
  };

  // Safe card processing
  const processCards = () => {
    try {
      const cards = Array.from(block.querySelectorAll(':scope > div:nth-child(n+5)'));
      
      if (!cards || cards.length === 0) {
        console.warn('Cards with Images: No cards found');
        return [];
      }

      const JSONCards = processDivsToObjectCardsWithImages(cards);
      
      if (!Array.isArray(JSONCards)) {
        console.warn('Cards with Images: processDivsToObjectCardsWithImages did not return an array');
        return [];
      }

      // Validation and sanitization of each card
      const validatedCards = JSONCards
        .slice(0, DEFAULT_VALUES.validation.maxCardsToShow) // Limit number of cards
        .map((card, index) => {
          try {
            const validatedCard = {
              image: validateImageUrl(card?.image, DEFAULT_VALUES.card.image),
              icon: validateImageUrl(card?.icon, DEFAULT_VALUES.card.icon),
              title: sanitizeText(card?.title, DEFAULT_VALUES.card.title),
              description: sanitizeText(card?.description, DEFAULT_VALUES.card.description),
              style: validateStyle(card?.style)
            };

            // Check if card has valid content (not all fallbacks)
            const hasValidContent = (
              (validatedCard.image !== DEFAULT_VALUES.card.image) ||
              (validatedCard.icon !== DEFAULT_VALUES.card.icon) ||
              (validatedCard.title !== DEFAULT_VALUES.card.title) ||
              (validatedCard.description !== DEFAULT_VALUES.card.description)
            );

            // If hiding empty cards is enabled and card has no valid content
            if (DEFAULT_VALUES.card.hideOnMissing && !hasValidContent) {
              return null;
            }

            return validatedCard;
          } catch (error) {
            console.warn(`Cards with Images: Error processing card ${index}:`, error);
            return DEFAULT_VALUES.card.hideOnMissing ? null : {
              image: DEFAULT_VALUES.card.image,
              icon: DEFAULT_VALUES.card.icon,
              title: DEFAULT_VALUES.card.title,
              description: DEFAULT_VALUES.card.description,
              style: DEFAULT_VALUES.card.style
            };
          }
        })
        .filter(card => card !== null); // Remove null cards

      return validatedCards;
    } catch (error) {
      console.error('Cards with Images: Error processing cards:', error);
      return [];
    }
  };

  // Safe HTML generation for cards
  const generateCardHTML = (validatedCards) => {
    if (!validatedCards || validatedCards.length === 0) {
      return `
        <div class="vertical-card-container transition-all duration-1000 ease-in-out group relative xl:translate-y-28 hover:xl:translate-y-20" style="background-image: url('${DEFAULT_VALUES.card.image}')">
          <div class="vertical-card-content black-gradient-from-bottom lg:flex-col xl:flex-col xl:black-gradient-from-bottom">
            <div class="rounded-full xl:border xl:border-white xl:bg-white/30 xl:p-5">
              <img class="size-14" src="${DEFAULT_VALUES.card.icon}" alt="${DEFAULT_VALUES.card.title}" onerror="this.style.display='none'"/>
            </div>
            <h6 class="text-lg font-semibold lg:text-xl 2xl:text-3xl transition-transform duration-700 group-hover:-translate-y-20">
              ${DEFAULT_VALUES.card.title}
            </h6>
            <div class="hidden xl:block absolute mx-2 p-2 bg-white/10 backdrop-blur-sm text-xs border border-white opacity-0 transition-all duration-1000 group-hover:opacity-100 bottom-10">
              ${DEFAULT_VALUES.card.description}
            </div>
          </div>
        </div>
      `;
    }

    return validatedCards.map((card, index) => {
      const buildFlexReverseClass = (styleString) => styleString === 'titleOnBottom';
      const isFlexReverse = buildFlexReverseClass(card.style);
      const translationY = index % 2 === 0 
        ? 'xl:translate-y-28 hover:xl:translate-y-20' 
        : 'xl:translate-y-0 hover:xl:-translate-y-10';

      // Escape HTML to prevent XSS
      const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      };

      return `
        <div class="vertical-card-container transition-all duration-1000 ease-in-out group relative ${translationY}" 
             style="background-image: url('${card.image}')"
             data-card-index="${index}">
          <div class="vertical-card-content black-gradient-from-bottom lg:flex-col ${
            isFlexReverse 
              ? 'xl:flex-col-reverse xl:black-gradient-from-top' 
              : 'xl:flex-col xl:black-gradient-from-bottom'
          }">
            <div class="rounded-full xl:border xl:border-white xl:bg-white/30 xl:p-5">
              <img class="size-14" 
                   src="${card.icon}" 
                   alt="${escapeHtml(card.title)}"
                   onerror="this.style.display='none'"/>
            </div>
            <h6 class="text-lg font-semibold lg:text-xl 2xl:text-3xl transition-transform duration-700 ${
              isFlexReverse ? '' : 'group-hover:-translate-y-20'
            }">
              ${escapeHtml(card.title)}
            </h6>
            <div class="hidden xl:block absolute mx-2 p-2 bg-white/10 backdrop-blur-sm text-xs border border-white opacity-0 transition-all duration-1000 group-hover:opacity-100 ${
              isFlexReverse ? 'top-40' : 'bottom-10'
            }">
              ${escapeHtml(card.description)}
            </div>
          </div>
        </div>
      `;
    }).join('');
  };

  // Verify block is valid
  if (!block) {
    console.error('Cards with Images: Invalid block');
    return;
  }

  try {
    // Extract section data
    const sectionData = extractSectionData();
    
    // Process cards
    const validatedCards = processCards();
    
    // Generate cards HTML
    const cardsHTML = generateCardHTML(validatedCards);
    
    // Escape HTML for section data
    const escapeHtml = (text) => {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    };

    // Create container section
    const containerSection = document.createElement('section');
    containerSection.className = 'small-layout-padding bg-white bg-cover bg-center bg-no-repeat text-center lg:text-start';
    containerSection.setAttribute('data-block-type', 'cards-with-images');
    containerSection.setAttribute('data-cards-count', validatedCards.length);

    containerSection.innerHTML = `
      <h2 class="text-primary hidden w-9/12 xl:w-1/2 xl:block text-3xl uppercase lg:text-5xl xl:text-7xl xl:font-normal">
        ${sectionData.sectionTitle}
      </h2>
      <div class="flex flex-col justify-between items-center xl:items-start gap-4 pb-10 lg:flex-row">
        <div class="flex lg:w-1/2 flex-col items-center gap-8 lg:items-start">
          <h2 class="text-primary block xl:hidden text-3xl uppercase lg:text-5xl xl:text-7xl xl:font-normal">
            ${sectionData.sectionTitle}
          </h2>
          <p class="text-sm font-light lg:text-xl 2xl:w-9/12">
            ${sectionData.sectionSubTitle}
          </p>
          <!--CUSTOM BUTTON-->
          <custom-link href="${sectionData.sectionButtonLink}">${sectionData.sectionButtonText}</custom-link>
        </div>
        <!--CARDS CONTAINER-->
        <div class="mt-3 w-fit gap-4 grid grid-cols-2 justify-items-center xl:flex xl:flex-nowrap xl:justify-center xl:gap-6">
          ${cardsHTML}
        </div>
      </div>
    `;

    // Replace block content
    block.textContent = '';
    block.append(containerSection);

    // Add error handling for failed images
    const images = containerSection.querySelectorAll('img');
    images.forEach(img => {
      img.addEventListener('error', function() {
        console.warn('Cards with Images: Failed image:', this.src);
        this.style.display = 'none';
      });
    });

  } catch (error) {
    console.error('Cards with Images: Critical error in processing:', error);
    
    // Create error section
    const errorSection = document.createElement('section');
    errorSection.className = 'small-layout-padding bg-white text-center';
    errorSection.innerHTML = `
      <div class="text-red-500 p-8">
        <h2 class="text-2xl mb-4">Content Loading Error</h2>
        <p>An error occurred while loading the cards. Please try again later.</p>
      </div>
    `;
    
    block.textContent = '';
    block.append(errorSection);
  }
}
