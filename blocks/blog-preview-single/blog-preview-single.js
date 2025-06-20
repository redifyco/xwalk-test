import '../../scripts/customTag.js'
import { extractTagsByType, getDataFromJson, returnFocusAreaIcon, isEditorMode } from "../../scripts/utils.js";

// Costanti per valori di default - rimangono uguali
const DEFAULT_CONFIG = {
  TITLE: '',
  BUTTON_TEXT: 'Read More',
  BUTTON_LINK: '#',
  CARD_STYLE: 'primary',
  CARD_BEHAVIOUR: 'page-link',
  LAYOUT_STYLE: 'masonry',
  API_STRING: '',
  ITEMS_TO_SHOW: 3
};

export default async function decorate(block) {
  try {
    // Estrazione e validazione della configurazione
    const config = extractBlockConfig(block);

    // Usa isEditorMode() da utils.js
    const isAuthorMode = isEditorMode();

    console.log('Component configuration:', {
      isAuthorMode,
      apiString: config.apiString,
      itemsToShow: config.itemsToShow
    });

    if (isAuthorMode) {
      console.log('Using mock data in author mode');
      const mockData = generateMockData(config.itemsToShow);
      await renderComponent(block, config, mockData, true);
      return;
    }

    // In modalità publish, controlla se l'API è configurata
    if (!config.apiString || config.apiString === DEFAULT_CONFIG.API_STRING) {
      console.log('API not configured, showing configuration message');
      renderConfigurationMessage(block);
      return;
    }

    // Rendering dello stato di caricamento
    console.log('Loading data from API:', config.apiString);
    renderLoadingState(block);

    // Caricamento dei dati usando getDataFromJson
    const resultData = await getDataFromJson(config.apiString);
    console.log('Raw API data received:', resultData);

    if (!resultData) {
      throw new Error('No data received from API');
    }

    // Gestione più flessibile della struttura dati
    let articles = [];
    if (Array.isArray(resultData.data)) {
      articles = resultData.data;
    } else if (Array.isArray(resultData)) {
      articles = resultData;
    } else if (resultData && typeof resultData === 'object') {
      // Cerca in tutte le possibili proprietà array
      const possibleArrays = ['items', 'articles', 'posts', 'data', 'content', 'results'];
      for (const prop of possibleArrays) {
        if (Array.isArray(resultData[prop])) {
          articles = resultData[prop];
          break;
        }
      }
    }

    console.log('Extracted articles:', articles.length, 'items');

    if (articles.length === 0) {
      console.warn('No articles found in API response');
      // Mostra stato vuoto invece di errore
      await renderComponent(block, config, { data: [] }, false);
      return;
    }

    // Limita i risultati al numero richiesto
    const limitedData = {
      data: articles.slice(0, config.itemsToShow)
    };

    console.log('Rendering', limitedData.data.length, 'articles');

    // Rendering del componente
    await renderComponent(block, config, limitedData, false);

  } catch (error) {
    console.error('Error in Blog Preview Single component:', error);
    renderErrorState(block, error.message);
  }
}

/**
 * Rimuovi la vecchia funzione detectAuthorMode() e sostituisci con isEditorMode()
 */

/**
 * Estrae e valida la configurazione dal blocco DOM
 * @param {HTMLElement} block - Elemento DOM del blocco
 * @returns {Object} Configurazione validata
 */
function extractBlockConfig(block) {
  // Estrazione del titolo (supporta HTML/richtext)
  const titleElement = block.querySelector(':scope > div:nth-child(1) div');
  const title = titleElement?.innerHTML?.trim() || DEFAULT_CONFIG.TITLE;

  // Estrazione del testo del pulsante
  const buttonText = block.querySelector(':scope > div:nth-child(2) div p')?.textContent?.trim() || DEFAULT_CONFIG.BUTTON_TEXT;

  // Estrazione del link del pulsante
  const buttonLink = block.querySelector(':scope > div:nth-child(3) div a')?.href?.trim() || DEFAULT_CONFIG.BUTTON_LINK;

  // Estrazione dello stile della card
  const cardStyle = block.querySelector(':scope > div:nth-child(4) div p')?.textContent?.trim() || DEFAULT_CONFIG.CARD_STYLE;

  // Estrazione del comportamento della card
  const cardBehaviour = block.querySelector(':scope > div:nth-child(5) div p')?.textContent?.trim() || DEFAULT_CONFIG.CARD_BEHAVIOUR;

  // Estrazione dell'API URL (ora è il sesto elemento)
  const apiString = block.querySelector(':scope > div:nth-child(6) div p')?.textContent?.trim() || DEFAULT_CONFIG.API_STRING;

  // Estrazione del numero di elementi da mostrare (ora è il settimo elemento)
  const itemsToShowText = block.querySelector(':scope > div:nth-child(7) div p')?.textContent?.trim() || '';
  let itemsToShow = DEFAULT_CONFIG.ITEMS_TO_SHOW;

  if (itemsToShowText && !isNaN(itemsToShowText)) {
    itemsToShow = parseInt(itemsToShowText) || DEFAULT_CONFIG.ITEMS_TO_SHOW;
  }

  // Estrazione dello stile del layout (ora è l'ottavo elemento)
  const layoutStyle = block.querySelector(':scope > div:nth-child(8) div p')?.textContent?.trim() || DEFAULT_CONFIG.LAYOUT_STYLE;

  // Validazione del numero di elementi
  if (itemsToShow <= 0 || itemsToShow > 50) {
    console.warn(`Invalid items-to-show value: ${itemsToShow}. Using default: ${DEFAULT_CONFIG.ITEMS_TO_SHOW}`);
    itemsToShow = DEFAULT_CONFIG.ITEMS_TO_SHOW;
  }

  // Usa isEditorMode() invece di detectAuthorMode()
  const isAuthorMode = isEditorMode();

  // In modalità publish, valida solo se c'è un API path configurato
  if (!isAuthorMode && apiString && apiString !== DEFAULT_CONFIG.API_STRING) {
    try {
      validateConfiguration({ apiString, title, buttonText, buttonLink, itemsToShow });
    } catch (error) {
      console.warn('Configuration validation failed:', error.message);
    }
  }

  return {
    title,
    buttonText,
    buttonLink,
    cardStyle,
    cardBehaviour,
    layoutStyle,
    apiString,
    itemsToShow,
    aemEnv: block.getAttribute('data-aue-resource'),
    isAuthorMode
  };
}


/**
 * Parsing sicuro della configurazione API che supporta JSON paths
 * @param {string} configString - Stringa di configurazione
 * @returns {Object} Configurazione parsata
 */
function parseApiConfiguration(configString) {
    if (!configString) return {};

    try {
        // Tentativo di parsing JSON
        const parsed = JSON.parse(configString);
        return parsed;
    } catch {
        // Se non è JSON, controlla se è un path
        if (configString.endsWith('.json') || configString.startsWith('/') || configString.startsWith('http')) {
            return { url: configString };
        }
        // Altrimenti, restituisci come URL semplice
        return { url: configString };
    }
}

/**
 * Validazione della configurazione per path JSON
 * @param {Object} config - Configurazione da validare
 * @throws {Error} Se la configurazione non è valida
 */
function validateConfiguration(config) {
    // Controllo che l'API path sia presente
    if (!config.apiString || config.apiString.trim() === '') {
        throw new Error('API path is required');
    }

    if (config.itemsToShow <= 0 || config.itemsToShow > 50) {
        throw new Error('Items to show must be between 1 and 50');
    }

    // Validazione per path JSON o URL
    if (config.apiString.startsWith('http')) {
        try {
            new URL(config.apiString);
        } catch {
            throw new Error('Invalid API URL format');
        }
    } else if (!config.apiString.endsWith('.json') && !config.apiString.startsWith('/')) {
        throw new Error('API path must be a valid JSON file path or URL');
    }
}

/**
 * Genera dati fittizi per la modalità autore
 * @param {number} count - Numero di elementi da generare
 * @returns {Object} Dati fittizi
 */
function generateMockData(count = 3) {
  // Assicurati che count sia un numero valido
  const validCount = parseInt(count) || 3;
  const mockArticles = [];

  console.log(`Generating ${validCount} mock articles`);

  for (let i = 0; i < validCount; i++) {
    mockArticles.push({
      title: `Sample Article ${i + 1}`,
      description: `This is a sample description for article ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      path: `/articles/sample-article-${i + 1}`,
      published_time: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      thumbImg: `/content/dam/mscfoundation/hero-images/hero-placeholder.jpg`,
      pageType: 'mscfoundation:focus-area/education,mscfoundation:status/ongoing'
    });
  }

  return {
    data: mockArticles
  };
}


/**
 * Rendering del messaggio di configurazione
 * @param {HTMLElement} block - Elemento DOM del blocco
 */
function renderConfigurationMessage(block) {
    const configContainer = document.createElement('section');
    configContainer.className = 'flex flex-col items-center justify-center gap-8 px-4 pb-14 lg:gap-20 lg:px-20 lg:py-14';

    configContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div class="text-6xl text-orange-500 mb-4">⚙️</div>
            <h3 class="text-2xl font-semibold text-gray-800 mb-2">Configuration Required</h3>
            <p class="text-gray-600 max-w-md">This component requires a JSON API path to be configured (e.g., "/programs-index.json"). Please add the API configuration in the authoring environment.</p>
        </div>
    `;

    block.textContent = '';
    block.append(configContainer);
}

/**
 * Rendering dello stato di caricamento
 * @param {HTMLElement} block - Elemento DOM del blocco
 */
function renderLoadingState(block) {
    const loadingContainer = document.createElement('section');
    loadingContainer.className = 'flex flex-col items-center justify-center gap-8 px-4 pb-14 lg:gap-20 lg:px-20 lg:py-14';

    loadingContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div class="animate-spin text-6xl text-blue-500 mb-4">🔄</div>
            <h3 class="text-2xl font-semibold text-gray-800 mb-2">Loading Content...</h3>
            <p class="text-gray-600">Please wait while we fetch the latest articles.</p>
        </div>
    `;

    block.textContent = '';
    block.append(loadingContainer);
}

/**
 * Rendering dello stato di errore
 * @param {HTMLElement} block - Elemento DOM del blocco
 * @param {string} errorMessage - Messaggio di errore
 */
function renderErrorState(block, errorMessage = 'An error occurred while loading content') {
    const errorContainer = document.createElement('section');
    errorContainer.className = 'flex flex-col items-center justify-center gap-8 px-4 pb-14 lg:gap-20 lg:px-20 lg:py-14';

    errorContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div class="text-6xl text-red-500 mb-4">⚠️</div>
            <h3 class="text-2xl font-semibold text-gray-800 mb-2">Error Loading Content</h3>
            <p class="text-gray-600 max-w-md">${errorMessage}</p>
            <button onclick="window.location.reload()" class="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                Try Again
            </button>
        </div>
    `;

    block.textContent = '';
    block.append(errorContainer);
}

/**
 * Rendering di un avviso per la modalità autore
 * @returns {string} HTML dell'avviso
 */
function renderAuthorModeNotice() {
    return `
        <div class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6">
            <div class="flex">
                <div class="flex-shrink-0">
                    <span class="text-xl">!</span>
                </div>
                <div class="ml-3">
                    <p class="text-sm">
                        <strong>Author Mode:</strong> This component is showing sample data. Configure the API settings to display real content.
                    </p>
                </div>
            </div>
        </div>
    `;
}

/**
 * Rendering principale del componente
 * @param {HTMLElement} block - Elemento DOM del blocco
 * @param {Object} config - Configurazione del componente
 * @param {Object} resultData - Dati ricevuti dall'API o mock
 * @param {boolean} isMockData - Se true, indica che stiamo usando dati fittizi
 */
async function renderComponent(block, config, resultData, isMockData = false) {
  const sectionContainer = document.createElement('section');
  sectionContainer.className = 'bg-white';
  sectionContainer.setAttribute('data-component', 'blog-preview-single');
  sectionContainer.setAttribute('data-card-behaviour', config.cardBehaviour);
  sectionContainer.setAttribute('data-layout-style', config.layoutStyle);
  sectionContainer.setAttribute('data-items-to-show', config.itemsToShow);

  if (isMockData) {
    sectionContainer.setAttribute('data-mock-mode', 'true');
  }

  // Validazione dei dati ricevuti - supporta diversi formati
  let articles = [];

  if (Array.isArray(resultData.data)) {
    articles = resultData.data;
  } else if (Array.isArray(resultData)) {
    articles = resultData;
  } else if (resultData && typeof resultData === 'object') {
    // Cerca array in proprietà comuni
    articles = resultData.items || resultData.articles || resultData.posts || [];
  }

  // Applica il limite di elementi da mostrare
  const limitedArticles = articles.slice(0, config.itemsToShow);

  console.log(`Rendering ${limitedArticles.length} articles out of ${articles.length} available (limit: ${config.itemsToShow})`);
  console.log('Mode check - isMockData:', isMockData);

  // Debug per le immagini
  limitedArticles.forEach((article, index) => {
    console.log(`Article ${index + 1} details:`, {
      title: article.title,
      thumbImg: article.thumbImg,
      path: article.path,
      pageType: article.pageType
    });
  });

  sectionContainer.innerHTML = `
        ${isMockData ? renderAuthorModeNotice() : ''}
        <section class="flex flex-col items-center justify-center gap-8 px-4 pb-14 lg:gap-20 lg:px-20 lg:py-14 bg-white">
            ${renderTitle(config.title)}
            ${limitedArticles.length > 0 ?
    renderArticlesGrid(limitedArticles, config.cardStyle, config.cardBehaviour, config.layoutStyle, isMockData) :
    renderEmptyState()
  }
            ${renderActionButton(config.buttonText, config.buttonLink, isMockData)}
        </section>
    `;

  block.textContent = '';
  block.append(sectionContainer);

  // Aggiungi CSS personalizzato solo se è masonry
  if (config.layoutStyle === 'masonry') {
    addMasonryStyles(block);
  }

  // Setup degli event listeners se necessario
  setupEventListeners(sectionContainer, isMockData);
}

/**
 * Aggiunge stili CSS personalizzati per il layout masonry
 * @param {HTMLElement} block - Elemento DOM del blocco
 */
function addMasonryStyles(block) {
  const styleId = 'masonry-grid-styles';

  // Controlla se gli stili sono già stati aggiunti
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Per schermi più piccoli, usa layout verticale singola colonna */
      @media (max-width: 1023px) {
        [data-component="blog-preview-single"][data-layout-style="masonry"] .lg\\:grid {
          display: flex !important;
          flex-direction: column !important;
          gap: 1.5rem !important;
          padding: 0 1rem !important;
          overflow-x: visible !important;
        }
        
        [data-component="blog-preview-single"][data-layout-style="masonry"] article-card {
          width: 100% !important;
          flex-shrink: 0 !important;
          margin-bottom: 0 !important;
          display: block !important;
          break-inside: initial !important;
        }
      }
      
      /* Tablet - 2 colonne */
      @media (min-width: 768px) and (max-width: 1023px) {
        [data-component="blog-preview-single"][data-layout-style="masonry"] .lg\\:grid {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 1.5rem !important;
          padding: 0 2rem !important;
        }
        
        [data-component="blog-preview-single"][data-layout-style="masonry"] article-card {
          width: 100% !important;
        }
      }

      @media (min-width: 1024px) {
        /* Layout masonry usando CSS columns con padding aumentato */
        [data-component="blog-preview-single"][data-layout-style="masonry"] .lg\\:grid {
          display: block !important;
          columns: 3 !important;
          column-gap: 3rem !important;
          column-fill: balance !important;
          padding: 0 8rem !important;
        }
        
        [data-component="blog-preview-single"][data-layout-style="masonry"] article-card {
          display: inline-block !important;
          width: 100% !important;
          height: fit-content !important;
          break-inside: avoid !important;
          margin-bottom: 2rem !important;
          page-break-inside: avoid !important;
        }
        
        /* Forza le dimensioni del contenuto interno nel layout masonry */
        [data-component="blog-preview-single"][data-layout-style="masonry"] article-card > div {
          min-width: unset !important;
          max-width: unset !important;
          width: 100% !important;
        }
        
        /* Disabilita il troncamento del titolo nel layout masonry */
        [data-component="blog-preview-single"][data-layout-style="masonry"] article-card .title,
        [data-component="blog-preview-single"][data-layout-style="masonry"] article-card h1,
        [data-component="blog-preview-single"][data-layout-style="masonry"] article-card h2,
        [data-component="blog-preview-single"][data-layout-style="masonry"] article-card h3,
        [data-component="blog-preview-single"][data-layout-style="masonry"] article-card h5,
        [data-component="blog-preview-single"][data-layout-style="masonry"] article-card [class*="title"],
        [data-component="blog-preview-single"][data-layout-style="masonry"] article-card [class*="heading"] {
          white-space: normal !important;
          overflow: visible !important;
          text-overflow: initial !important;
          -webkit-line-clamp: unset !important;
          line-clamp: unset !important;
          display: block !important;
          -webkit-box-orient: initial !important;
          word-wrap: break-word !important;
          hyphens: auto !important;
        }
        
        /* Rimuovi eventuali classi di troncamento Tailwind */
        [data-component="blog-preview-single"][data-layout-style="masonry"] article-card .truncate,
        [data-component="blog-preview-single"][data-layout-style="masonry"] article-card .line-clamp-1,
        [data-component="blog-preview-single"][data-layout-style="masonry"] article-card .line-clamp-2,
        [data-component="blog-preview-single"][data-layout-style="masonry"] article-card .line-clamp-3,
        [data-component="blog-preview-single"][data-layout-style="masonry"] article-card .line-clamp-4,
        [data-component="blog-preview-single"][data-layout-style="masonry"] article-card .line-clamp-5,
        [data-component="blog-preview-single"][data-layout-style="masonry"] article-card .line-clamp-6 {
          white-space: normal !important;
          overflow: visible !important;
          text-overflow: initial !important;
          display: block !important;
          -webkit-line-clamp: unset !important;
          line-clamp: unset !important;
          -webkit-box-orient: initial !important;
        }
      }
      
      /* Breakpoint per schermi molto grandi */
      @media (min-width: 1440px) {
        [data-component="blog-preview-single"][data-layout-style="masonry"] .lg\\:grid {
          padding: 0 10rem !important;
          column-gap: 4rem !important;
        }
      }
      
      /* Breakpoint per schermi extra-large */
      @media (min-width: 1920px) {
        [data-component="blog-preview-single"][data-layout-style="masonry"] .lg\\:grid {
          padding: 0 12rem !important;
          column-gap: 5rem !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
}




/**
 * Rendering del titolo
 * @param {string} title - Titolo da renderizzare
 * @returns {string} HTML del titolo
 */
function renderTitle(title) {
    if (!title) return '';

    return `
        <div class="text-center mb-8">
            <h2 class="text-3xl lg:text-5xl font-bold text-primary mb-4">${title}</h2>
        </div>
    `;
}

/**
 * Rendering della griglia degli articoli
 * @param {Array} articles - Lista degli articoli
 * @param {string} cardStyle - Stile delle card
 * @param {string} cardBehaviour - Comportamento delle card
 * @param {string} layoutStyle - Stile del layout (masonry o flexible)
 * @param {boolean} isMockData - Se true, indica dati fittizi
 * @returns {string} HTML della griglia
 */
function renderArticlesGrid(articles, cardStyle, cardBehaviour, layoutStyle, isMockData = false) {
  const isMasonry = layoutStyle === 'masonry';

  const gridClasses = isMasonry
    ? ' md:grid gap-4 md:grid-cols-3'
    : 'flex max-w-full justify-start gap-6 overflow-x-auto pb-5 lg:overflow-x-visible lg:flex lg:flex-wrap lg:justify-start lg:pb-0 scrollbar-thin scrollbar-thumb-primary scrollbar-thumb-rounded scrollbar-track-transparent lg:scrollbar-none';

  console.log('Rendering articles grid:', {
    articlesCount: articles.length,
    isMockData: isMockData,
    cardBehaviour: cardBehaviour
  });

  return `
        <div class="${gridClasses}" data-layout-style="${layoutStyle}">
            ${articles.map((item, index) => renderArticleCard(item, cardStyle, cardBehaviour, index, isMockData, layoutStyle)).join('')}
        </div>
    `;
}

/**
 * Restituisce l'icona SVG per il tag di focus area
 * @param {string} focusAreaTag - Tag della focus area
 * @returns {string} SVG dell'icona
 */
function getFocusAreaIcon(focusAreaTag) {
  const focusAreaIcons = {
    "mscfoundation:focus-area/environmental-conservation": `/icons/environmental-conservation.svg`,
    "mscfoundation:focus-area/community-support": `/icons/community-support.svg`,
    "mscfoundation:focus-area/education": `/icons/education.svg`,
    "mscfoundation:focus-area/emergency-relief": `/icons/emergency-relief.svg`
  };

  // Se hai i tag, restituisci l'icona corrispondente
  if (focusAreaTag && focusAreaIcons[focusAreaTag]) {
    return focusAreaIcons[focusAreaTag];
  }

  // Icona di default
  return `/icons/default-article.svg`;
}


/**
 * Rendering di una singola card articolo
 */
function renderArticleCard(item, cardStyle, cardBehaviour, index, isMockData = false, layoutStyle = 'masonry') {
  // Prepara tutti i dati in un oggetto
  const cardData = {
    title: item.title || '',
    subTitle: item.description || item.summary || 'Read more about this article',
    date: item.published_time || '',
    topLabel: extractTagsByType(item.pageType || '', 'mscfoundation:status') || '',
    icons: returnFocusAreaIcon(extractTagsByType(item.pageType || '', 'mscfoundation:focus-area')),
    backgroundImage: item.thumbImg || '/content/dam/mscfoundation/hero-images/hero-placeholder.jpg',
    href: getCardProps(item, cardBehaviour, isMockData).href,
    variant: cardStyle,
    isMockData: isMockData
  };

  // Classi CSS dinamiche
  const cardClasses = layoutStyle === 'masonry' ? 'lg:h-fit' : 'lg:h-fit lg:w-80 lg:flex-shrink-0';

  return `
    <article-card 
        class="${cardClasses}"
        data-card='${JSON.stringify(cardData)}'
    ></article-card>
  `;
}

/**
 * Gestisce i props della card basati sul comportamento
 * @param {Object} item - Dati dell'articolo
 * @param {string} cardBehaviour - Comportamento della card
 * @param {boolean} isMockData - Se true, indica dati fittizi
 * @returns {Object} Props della card
 */
function getCardProps(item, cardBehaviour, isMockData = false) {
  console.log('Getting card props:', {
    isMockData,
    cardBehaviour,
    itemPath: item.path,
    itemDownloadLink: item.downloadLink
  });

  const baseProps = {
    href: item.path || '#',
    download: '',
    onclick: '',
    target: ''
  };

  // Se siamo in modalità mock, restituisci props di mock
  if (isMockData) {
    console.log('Returning mock props');
    return {
      ...baseProps,
      href: item.path || '/mock-article-path'
    };
  }

  // Gestione del comportamento in modalità live
  switch (cardBehaviour) {
    case 'page-link':
      console.log('Page link behavior - using path:', item.path);
      return {
        ...baseProps,
        href: item.path || '#'
      };

    case 'download-link':
      console.log('Download link behavior');
      return {
        ...baseProps,
        href: item.downloadLink || item.path || '#',
        download: 'download'
      };

    case 'popup':
      console.log('Popup behavior');
      return {
        ...baseProps,
        href: '#',
        onclick: `openArticlePopup('${item.path || ''}')`,
      };

    default:
      console.log('Default behavior - page link');
      return {
        ...baseProps,
        href: item.path || '#'
      };
  }
}



/**
 * Rendering del pulsante d'azione
 * @param {string} buttonText - Testo del pulsante
 * @param {string} buttonLink - Link del pulsante
 * @param {boolean} isMockData - Se true, indica dati fittizi
 * @returns {string} HTML del pulsante
 */
function renderActionButton(buttonText, buttonLink, isMockData = false) {
  if (!buttonText || buttonText.trim() === '') return '';

  const href = isMockData ? '#' : buttonLink;
  const clickHandler = isMockData ? 'onclick="alert(\'This is a sample button in author mode\')"' : '';

  return `
        <div class="text-center mt-8">
            <custom-link className="mt-4" color="primary" href="${href}" ${clickHandler}>
                ${buttonText}
            </custom-link>
        </div>
    `;
}


/**
 * Rendering dello stato vuoto
 * @returns {string} HTML dello stato vuoto
 */
function renderEmptyState() {
    return `
        <div class="flex flex-col justify-center items-center w-full text-center py-16">
            <div class="text-4xl mb-4">📝</div>
            <div class="text-2xl font-semibold text-gray-600 mb-2">No Content Available</div>
            <div class="text-gray-500">There are no articles to display at the moment.</div>
        </div>
    `;
}

/**
 * Setup degli event listeners
 * @param {HTMLElement} container - Container principale
 * @param {boolean} isMockData - Se true, indica dati fittizi
 */
function setupEventListeners(container, isMockData = false) {
    // Gestione click sulle card in modalità mock
    if (isMockData) {
        const mockCards = container.querySelectorAll('[data-mock="true"]');
        mockCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (card.getAttribute('href') === '#') {
                    e.preventDefault();
                    alert('This is a sample article in author mode');
                }
            });
        });
    }
}
