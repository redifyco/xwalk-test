export default function decorate(block) {
  // === CONFIGURAZIONE VALORI DI DEFAULT ===
  const DEFAULT_VALUES = {
    backgroundImage: '/content/dam/placeholder-image.jpg', // Placeholder image
    title: 'Welcome to our platform',
    subtitle: 'Discover opportunities worldwide',
    boxTitle: 'Get Started',
    boxDescription: 'Choose your preferred option to continue',
    boxButtonText: 'Continue',
    placeholderImage: '/content/dam/default-flag.png',
    countryName: 'Country',
    countryLink: '#'
  };

  // === ESTRAZIONE SICURA DEI DATI ===
  // Funzione helper per l'estrazione sicura del testo
  const safeExtractText = (element, defaultValue = '') => {
    if (!element) return defaultValue;
    const text = element.textContent?.trim() || element.innerHTML?.trim();
    return text && text !== 'undefined' && text !== 'null' ? text : defaultValue;
  };

  // Funzione helper per l'estrazione sicura delle immagini
  const safeExtractImageSrc = (element, defaultSrc = DEFAULT_VALUES.backgroundImage) => {
    if (!element) return defaultSrc;
    const src = element.src?.trim();
    return src && src !== 'undefined' && src !== 'null' && src !== '' ? src : defaultSrc;
  };

  // Estrazione dei dati con fallback
  const backgroundImage = safeExtractImageSrc(
    block.querySelector(":scope > div:nth-child(1) img"),
    DEFAULT_VALUES.backgroundImage
  );

  const title = safeExtractText(
    block.querySelector(":scope > div:nth-child(2) div"),
    DEFAULT_VALUES.title
  );

  const subtitle = safeExtractText(
    block.querySelector(":scope > div:nth-child(3) div"),
    DEFAULT_VALUES.subtitle
  );

  const boxTitle = safeExtractText(
    block.querySelector(":scope > div:nth-child(4) div p"),
    DEFAULT_VALUES.boxTitle
  );

  const boxDescription = safeExtractText(
    block.querySelector(":scope > div:nth-child(5) div p"),
    DEFAULT_VALUES.boxDescription
  );

  const boxButtonText = safeExtractText(
    block.querySelector(":scope > div:nth-child(6) div p"),
    DEFAULT_VALUES.boxButtonText
  );

  const countryItems = block.querySelectorAll(":scope > div:nth-child(n+7) div");
  const processCountryItems = processDivsToObject(countryItems, DEFAULT_VALUES);

  // === RENDERING SICURO DELL'HTML ===
  const containerSection = document.createElement('section');
  containerSection.className = 'bg-no-repeat relative bg-cover bg-center min-h-96 pb-14 lg:container-layout-padding';
  
  // Template HTML con gestione condizionale
  containerSection.innerHTML = `
<div class="flex flex-col items-end lg:flex-row gap-8 lg:gap-24 justify-between">
    ${renderBackgroundImages(backgroundImage)}
    ${renderTitleSection(title, subtitle)}
    <div class="z-10 lg:max-w-xl w-full">   
        <div class="bg-white h-full w-full px-4 lg:p-8 flex flex-col gap-4">
            ${renderBoxHeader(boxTitle, boxDescription)}
            <div class="mt-3 flex flex-col gap-4">
                ${renderSearchInput()}
                ${renderCountryList(processCountryItems)}
                ${renderContinueButton(boxButtonText)}
            </div>
        </div>   
    </div>
</div>
`;

  // === GESTIONE DEL DOM ===
  const aemEnv = block.getAttribute('data-aue-resource');
  if (!aemEnv) {
    block.textContent = '';
    block.append(containerSection);
  } else {
    block.append(containerSection);
    block.querySelectorAll(":scope > div:nth-child(n+1) div").forEach(item => item.classList.add('hidden'));
  }

  // Aggiungi CSS e event listeners
  addCustomStyles();
  setupEventListeners(containerSection);
}

// === FUNZIONI DI RENDERING MODULARI ===
function renderBackgroundImages(backgroundImage) {
  return `
    <img src="${backgroundImage}" class="object-cover max-h-72 lg:hidden object-center inset-0 h-full w-full z-0" alt="Background">
    <img src="${backgroundImage}" class="absolute lg:block hidden object-cover object-center inset-0 h-full w-full z-0" alt="Background">
  `;
}

function renderTitleSection(title, subtitle) {
  return `
    <div class="lg:block z-10 hidden">
        <div class="text-7xl text-white prose-em:font-joyful prose-em:text-9xl">
            ${title}
        </div>
        <div class="text-sm text-white lg:text-xl font-light">
            ${subtitle}
        </div>
    </div>
  `;
}

function renderBoxHeader(boxTitle, boxDescription) {
  return `
    <div class="flex flex-col gap-2 justify-center items-center text-center">  
        <h3 class="text-2xl lg:text-4xl font-medium">${boxTitle}</h3>
        <p class="font-light">${boxDescription}</p>
    </div>
  `;
}

function renderSearchInput() {
  return `
    <div class="relative w-full">
        <input id="country-search" type="text" class="border-primary w-full border-r-2 border-b-2 focus:outline-0 p-1 ring-0" placeholder="Search your country"/>
        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"><ion-icon size="large" name="search-outline"></ion-icon></span>
    </div>
  `;
}

function renderCountryList(processCountryItems) {
  return `
    <div class="px-8 py-2 h-[140px] overflow-y-auto scrollbar-hide">
        <div class="flex flex-wrap justify-center" style="gap: 8px;">
            <span id='no-result' class="hidden w-full text-center">No countries found</span>
            ${processCountryItems.length > 0 ? processCountryItems.map(item => `
                <button data-country-link="${item.link}" id="country-button" class="flex cursor-pointer flex-col justify-center items-center gap-2 flex-none mb-8" style="width: calc(33.333% - 8px);">
                    <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                        <img src="${item.image}" alt="icon-${item.name}" class="w-full h-full object-cover object-center">
                    </div>
                    <span id="country-name" class="capitalize text-xs text-center leading-tight w-full font-medium">${item.name}</span>
                </button>
            `).join('') : '<div class="w-full text-center text-gray-500">No countries available</div>'}
        </div>
    </div>
  `;
}

function renderContinueButton(boxButtonText) {
  return `
    <a target="_blank" id="continue-button" href="#" class="border text-center cursor-pointer mt-5 border-primary w-full py-2 text-primary">
        ${boxButtonText}
    </a>
  `;
}

// === FUNZIONE MIGLIORATA PER PROCESSARE I PAESI ===
function processDivsToObject(divs, defaultValues) {
  if (!divs || divs.length === 0) return [];

  const result = [];

  // Process the divs in groups of 3
  for (let i = 0; i < divs.length; i += 3) {
    const imageDiv = divs[i];
    const nameDiv = divs[i + 1];
    const linkDiv = divs[i + 2];

    // Controlli di sicurezza più robusti
    if (!imageDiv && !nameDiv) continue;

    const image = safeExtractImageSrc(
      imageDiv?.querySelector('img'),
      defaultValues.placeholderImage
    );

    const name = safeExtractText(nameDiv, defaultValues.countryName);

    const link = safeExtractText(linkDiv, defaultValues.countryLink);

    // Aggiungi solo se almeno il nome è valido
    if (name && name !== defaultValues.countryName) {
      result.push({
        image,
        name,
        link: link || '#' // Fallback per link vuoti
      });
    }
  }

  return result;
}

// === FUNZIONI HELPER SICURE ===
function safeExtractText(element, defaultValue = '') {
  if (!element) return defaultValue;
  const text = element.textContent?.trim() || element.innerHTML?.trim();
  return text && text !== 'undefined' && text !== 'null' && text !== '' ? text : defaultValue;
}

function safeExtractImageSrc(element, defaultSrc = '') {
  if (!element) return defaultSrc;
  const src = element.getAttribute('src')?.trim();
  return src && src !== 'undefined' && src !== 'null' && src !== '' ? src : defaultSrc;
}

// === FUNZIONI DI SUPPORTO ===
function addCustomStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    
    /* Gradiente per indicare scroll */
    .scrollbar-hide:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 15px;
        background: linear-gradient(transparent, rgba(255,255,255,0.9));
        pointer-events: none;
    }
  `;
  document.head.appendChild(style);
}

function setupEventListeners(containerSection) {
  // Event listener per i pulsanti dei paesi
  const countryButtons = containerSection.querySelectorAll('#country-button');
  const continueButton = containerSection.querySelector('#continue-button');
  
  countryButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const link = button.dataset.countryLink;
      if (link && link !== '#') {
        continueButton.setAttribute('href', link);
      }
      containerSection.querySelectorAll('#country-name').forEach(item => item.classList.remove('font-semibold'));
      button.querySelector('#country-name').classList.add('font-semibold');
    });
  });

  // Event listener per la ricerca
  const searchInput = containerSection.querySelector('#country-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const value = e.target.value.toLowerCase();
      const items = containerSection.querySelectorAll('#country-button');
      const noResult = containerSection.querySelector('#no-result');
      
      if (value.length > 0) {
        let hasVisibleItems = false;
        items.forEach(item => {
          const nameElement = item.querySelector('#country-name');
          if (nameElement) {
            const name = nameElement.textContent.toLowerCase();
            if (name.includes(value)) {
              item.classList.remove('hidden');
              hasVisibleItems = true;
            } else {
              item.classList.add('hidden');
            }
          }
        });
        
        if (noResult) {
          if (!hasVisibleItems) {
            noResult.classList.remove('hidden');
          } else {
            noResult.classList.add('hidden');
          }
        }
      } else {
        items.forEach(item => item.classList.remove('hidden'));
        if (noResult) {
          noResult.classList.add('hidden');
        }
      }
    });
  }
}

// === FUNZIONE RENDERELEMENTS MIGLIORATA ===
const RenderElements = (items, defaultValues = {}) => {
  const safeItems = Array.isArray(items) ? items : [];
  
  return `
<div class="px-8 py-2 h-[140px] overflow-y-auto scrollbar-hide">
    <div class="flex flex-wrap justify-center" style="gap: 8px;">
        ${safeItems.length > 0 ? safeItems.map(item => `
        <button data-country-link="${item.link || '#'}" id="country-button" class="flex cursor-pointer flex-col justify-center items-center gap-2 flex-none mb-8" style="width: calc(33.333% - 8px);">
            <div class="w-10 h-15 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                <img src="${item.image || defaultValues.placeholderImage || '/content/dam/default-flag.png'}" alt="icon-${item.name || 'country'}" class="w-full h-full object-cover object-center">
            </div>
            <span id="country-name" class="capitalize text-xs text-center leading-tight w-full font-medium">${item.name || 'Country'}</span>
        </button>
        `).join('') : '<div class="w-full text-center text-gray-500">No countries available</div>'}
    </div>
</div>
    `;
};
