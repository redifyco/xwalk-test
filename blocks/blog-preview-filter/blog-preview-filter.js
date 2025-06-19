import '../../scripts/customTag.js'
import {
  extractTagsByType,
  getDataFromJson,
  returnFocusAreaIcon,
  stringToBoolean,
  isEditorMode // Importa la funzione per detectare la modalità editor
} from "../../scripts/utils.js";

let currentPage = 1;

// Costanti per i valori di default - allineate con blog-preview-single
const DEFAULT_CONFIG = {
  TITLE: '',
  BUTTON_TEXT: 'View All',
  BUTTON_LINK: '#',
  CARD_STYLE: 'primary',
  API_STRING: '',
  ITEMS_TO_SHOW: 6, // Default più alto per il filtro
  CARD_BEHAVIOUR: 'page-link'
};


export default async function decorate(block) {
  try {
    // Estrazione e validazione della configurazione
    const config = extractBlockConfig(block);

    // Usa isEditorMode() da utils.js come in blog-preview-single
    const isAuthorMode = isEditorMode();

    console.log('Blog Preview Filter configuration:', {
      isAuthorMode,
      apiString: config.apiString,
      itemsToShow: config.itemsToShow,
      filters: {
        focusArea: config.isFilterFocusArea,
        date: config.isFilterDate,
        category: config.isFilterCategory
      }
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

    // Caricamento dei dati usando getDataFromJson - stessa logica di blog-preview-single
    const resultData = await getDataFromJson(config.apiString);
    console.log('Raw API data received:', resultData);

    if (!resultData) {
      throw new Error('No data received from API');
    }

    // Gestione più flessibile della struttura dati - stessa logica di blog-preview-single
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

    // Per il filtro, non limitiamo inizialmente i risultati come in single
    const structuredData = {
      data: articles
    };

    console.log('Rendering', structuredData.data.length, 'articles for filtering');

    // Rendering del componente
    await renderComponent(block, config, structuredData, false);

  } catch (error) {
    console.error('Error in Blog Preview Filter component:', error);
    renderErrorState(block, error.message);
  }
}

/**
 * Genera dati fittizi per la modalità autore - stessa logica di blog-preview-single
 * @param {number} count - Numero di elementi da generare
 * @returns {Object} Dati fittizi
 */
function generateMockData(count = 6) {
  const validCount = parseInt(count) || 6;
  const mockArticles = [];

  console.log(`Generating ${validCount} mock articles for filter component`);

  const mockCategories = ['Technology', 'Education', 'Healthcare', 'Environment'];
  const mockFocusAreas = ['education', 'healthcare', 'technology', 'environment'];
  const mockStatuses = ['ongoing', 'complete', 'published'];

  for (let i = 0; i < validCount; i++) {
    const randomCategory = mockCategories[Math.floor(Math.random() * mockCategories.length)];
    const randomFocusArea = mockFocusAreas[Math.floor(Math.random() * mockFocusAreas.length)];
    const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];

    mockArticles.push({
      title: `Sample Article ${i + 1} - ${randomCategory}`,
      description: `This is a sample description for article ${i + 1} in ${randomCategory}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      path: `/articles/sample-article-${i + 1}`,
      published_time: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      thumbImg: `/content/dam/mscfoundation/hero-images/hero-placeholder.jpg`,
      pageType: `mscfoundation:focus-area/${randomFocusArea},mscfoundation:status/${randomStatus}`,
      category: randomCategory
    });
  }

  return {
    data: mockArticles
  };
}

/**
 * Rendering del messaggio di configurazione - con sfondo bianco
 * @param {HTMLElement} block - Elemento DOM del blocco
 */
function renderConfigurationMessage(block) {
  const configContainer = document.createElement('section');
  configContainer.className = 'bg-white'; // Aggiunto sfondo bianco

  configContainer.innerHTML = `
    <section class="flex flex-col items-center justify-center gap-8 px-4 pb-14 lg:gap-20 lg:px-20 lg:py-14 bg-white">
      <div class="text-center">
        <div class="text-6xl text-orange-500 mb-4">⚙️</div>
        <h3 class="text-2xl font-bold text-primary mb-4">Blog Preview Filter Configuration</h3>
        <p class="text-gray-600 mb-4">Please configure the API URL in the component settings to display articles.</p>
        <p class="text-sm text-gray-500">This message is only visible in author mode.</p>
      </div>
    </section>
  `;

  block.textContent = '';
  block.append(configContainer);
}

/**
 * Rendering dello stato di caricamento - con sfondo bianco
 * @param {HTMLElement} block - Elemento DOM del blocco
 */
function renderLoadingState(block) {
  const loadingContainer = document.createElement('section');
  loadingContainer.className = 'bg-white'; // Aggiunto sfondo bianco

  loadingContainer.innerHTML = `
    <section class="flex flex-col items-center justify-center gap-8 px-4 pb-14 lg:gap-20 lg:px-20 lg:py-14 bg-white">
      <div class="text-center">
        <div class="animate-spin text-6xl text-blue-500 mb-4">🔄</div>
        <h3 class="text-2xl font-semibold text-gray-800 mb-2">Loading Content...</h3>
        <p class="text-gray-600">Please wait while we fetch the latest articles.</p>
      </div>
    </section>
  `;

  block.textContent = '';
  block.append(loadingContainer);
}

/**
 * Rendering dello stato di errore - con sfondo bianco
 * @param {HTMLElement} block - Elemento DOM del blocco
 * @param {string} errorMessage - Messaggio di errore
 */
function renderErrorState(block, errorMessage = 'Error loading content') {
  const errorContainer = document.createElement('section');
  errorContainer.className = 'bg-white'; // Aggiunto sfondo bianco

  errorContainer.innerHTML = `
    <section class="flex flex-col items-center justify-center gap-8 px-4 pb-14 lg:gap-20 lg:px-20 lg:py-14 bg-white">
      <div class="text-center">
        <div class="text-6xl text-red-500 mb-4">⚠️</div>
        <h3 class="text-xl font-semibold text-red-600 mb-2">Error</h3>
        <p class="text-gray-600 mb-4">${errorMessage}</p>
        <button onclick="location.reload()" class="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors">
          Retry
        </button>
      </div>
    </section>
  `;

  block.textContent = '';
  block.append(errorContainer);
}

/**
 * Rendering principale del componente - aggiornata per chiamare addMasonryStyles
 */
async function renderComponent(block, config, resultData, isMockData = false) {
  const sectionContainer = document.createElement('section');
  sectionContainer.className = 'bg-white';
  sectionContainer.setAttribute('data-component', 'blog-preview-filter');
  sectionContainer.setAttribute('data-card-behaviour', config.cardBehaviour);
  sectionContainer.setAttribute('data-items-to-show', config.itemsToShow);

  if (isMockData) {
    sectionContainer.setAttribute('data-mock-mode', 'true');
  }

  // Validazione dei dati ricevuti
  let articles = [];
  let displayArticles = [];

  if (resultData.data) {
    articles = Array.isArray(resultData.data) ? resultData.data : [];
    displayArticles = resultData.displayData || articles.slice(0, config.itemsToShow);
  } else if (Array.isArray(resultData)) {
    articles = resultData;
    displayArticles = articles.slice(0, config.itemsToShow);
  }

  console.log(`Rendering ${displayArticles.length} articles out of ${articles.length} available (limit: ${config.itemsToShow})`);

  // Rendering del contenuto con caricamento asincrono dei filtri
  try {
    const filtersAndContentHTML = await renderFiltersAndContent(config, displayArticles, articles, isMockData);

    sectionContainer.innerHTML = `
      ${isMockData ? renderAuthorModeNotice() : ''}
      <section class="flex flex-col items-center justify-center gap-8 px-4 pb-14 lg:gap-20 lg:px-20 lg:py-14 bg-white">
        ${renderTitle(config.title)}
        ${filtersAndContentHTML}
        ${renderActionButton(config.buttonText || '', config.buttonLink || '#', isMockData)}
      </section>
    `;

    block.textContent = '';
    block.append(sectionContainer);

    // Aggiungi CSS personalizzato per il layout responsivo - CHIAMATA CORRETTA
    addMasonryStyles(block);

    // Setup degli event listeners per i filtri
    setupFilterEventListeners(sectionContainer, config, articles, isMockData);

    // Setup degli event listeners generali
    setupEventListeners(sectionContainer, isMockData);

  } catch (error) {
    console.error('Error rendering filters and content:', error);
    renderErrorState(block, 'Error loading filter options');
  }
}


// Modifica la funzione createSectionContainer per usare FilterByFocusArea asincrona e sfondo bianco
const createSectionContainer = async (config, data, isMockData = false) => {
  console.log('Creating section container with config:', config);

  // Crea il container principale con sfondo bianco
  const container = document.createElement('section');
  container.className = 'bg-white'; // Aggiunto sfondo bianco
  container.setAttribute('data-component', 'blog-preview-filter');
  container.setAttribute('data-card-behaviour', config.cardBehaviour);
  container.setAttribute('data-items-to-show', config.itemsToShow);

  if (isMockData) {
    container.setAttribute('data-mock-mode', 'true');
  }

  let sectionHTML = `
    <section class="flex flex-col items-center justify-center gap-8 px-4 pb-14 lg:gap-20 lg:px-20 lg:py-14 bg-white">
      ${config.title ? `<h2 class="text-3xl lg:text-5xl font-bold text-primary mb-4">${config.title}</h2>` : ''}
      ${isMockData ? `<div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded mb-4">
        <span class="font-medium">Preview Mode:</span> Showing sample data for demonstration
      </div>` : ''}
  `;

  // Sezione dei filtri
  if (config.isFilterFocusArea || config.isFilterDate || config.isFilterCategory) {
    sectionHTML += `<div class="w-full flex flex-col lg:flex-row gap-8">`;

    // Sidebar filtri
    sectionHTML += `<aside class="lg:w-1/4">`;

    if (config.isFilterDate) {
      sectionHTML += FilterByDate();
    }

    if (config.isFilterCategory) {
      sectionHTML += FilterByCategory();
    }

    if (config.isFilterFocusArea) {
      const focusAreaFilter = await FilterByFocusArea();
      sectionHTML += focusAreaFilter;
    }

    sectionHTML += `</aside>`;

    // Contenuto principale
    sectionHTML += `
      <main class="lg:w-3/4">
        <div id="articles-container">
          ${RenderCards(data, config.cardStyle, config.itemsToShow, config.cardBehaviour, isMockData)}
        </div>
      </main>
    `;

    sectionHTML += `</div>`;
  } else {
    // Senza filtri, mostra solo gli articoli
    sectionHTML += `
      <div id="articles-container" class="w-full">
        ${RenderCards(data, config.cardStyle, config.itemsToShow, config.cardBehaviour, isMockData)}
      </div>
    `;
  }

  sectionHTML += `</section>`;

  container.innerHTML = sectionHTML;
  return container;
};

/**
 * Rendering delle card con layout responsivo - VERSIONE AGGIORNATA SENZA MASONRY
 */
const RenderCards = (data, cardStyle, perPage, cardBehaviour = 'page-link', isMockData = false) => {
  console.log('RenderCards called with:', {
    dataLength: data?.length,
    cardStyle,
    perPage,
    cardBehaviour,
    isMockData
  });

  if (!Array.isArray(data) || data.length === 0) {
    return renderEmptyState();
  }

  const totalPages = Math.ceil(data.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const result = data.slice(startIndex, endIndex);

  console.log('Rendering articles:', {
    totalItems: data.length,
    currentPage,
    totalPages,
    itemsThisPage: result.length
  });

  const articlesHTML = result.map((item, index) => {
    console.log(`Rendering card ${index + 1}:`, {
      title: item.title,
      pageType: item.pageType
    });

    // Gestione sicura dell'estrazione dei tag
    let pageTypesObject = {
      focusAreas: '',
      status: ''
    };

    try {
      if (item.pageType) {
        pageTypesObject.focusAreas = extractTagsByType(item.pageType, 'mscfoundation:focus-area') || '';
        pageTypesObject.status = extractTagsByType(item.pageType, 'mscfoundation:status') || '';
      }
    } catch (error) {
      console.warn('Error extracting tags for card:', error);
    }

    // Gestione del comportamento della card
    const cardProps = getCardProps(item, cardBehaviour, isMockData);

    // Crea l'oggetto con tutti i dati della card
    const cardData = {
      title: item.title || '',
      subTitle: item.description || '',
      topLabel: pageTypesObject.status,
      backgroundImage: item.thumbImg || '',
      icons: pageTypesObject.focusAreas,
      date: item.published_time || '',
      href: cardProps.href,
      variant: cardStyle,
      isMockData: isMockData,
      download: cardProps.download || '',
      onclick: cardProps.onclick || ''
    };

    return `
      <div class="cards-grid-item">
        <article-card 
          data-card='${JSON.stringify(cardData).replace(/'/g, '&apos;')}'
          data-behaviour="${cardBehaviour}"
        >
        </article-card>
      </div>
    `;
  }).join('');

  return `
    <div class="w-full">
      <div class="cards-grid-container">
        ${articlesHTML}
      </div>
      ${totalPages > 1 ? generatePagination(totalPages) : ''}
    </div>
  `;
};


// Funzione helper per renderizzare stato vuoto come HTML
function renderEmptyStateHTML() {
  return `
    <div class="flex flex-col justify-center items-center w-full text-center py-16">
      <div class="text-2xl font-semibold text-gray-600 mb-2">No data to display</div>
    </div>
  `;
}

// Le altre funzioni (FilterByFocusArea, FilterByDate, FilterByCategory, attachEventListeners, generatePagination)
// rimangono uguali al codice originale...

// Placeholder per le funzioni di filtro - implementa secondo le tue specifiche
async function FilterByFocusArea() {
  return `
    <div class="mb-6">
      <h3 class="font-semibold text-lg mb-3">Focus Area</h3>
      <div class="space-y-2">
        <!-- Implementa i filtri focus area -->
      </div>
    </div>
  `;
}

function FilterByDate() {
  return `
    <div class="mb-6">
      <h3 class="font-semibold text-lg mb-3">Date</h3>
      <div class="space-y-2">
        <!-- Implementa i filtri data -->
      </div>
    </div>
  `;
}

function FilterByCategory() {
  return `
    <div class="mb-6">
      <h3 class="font-semibold text-lg mb-3">Category</h3>
      <div class="space-y-2">
        <!-- Implementa i filtri categoria -->
      </div>
    </div>
  `;
}

function attachEventListeners(container, config, data, originalData) {
  // Implementa gli event listeners per i filtri
  console.log('Attaching event listeners for filters');
}

function generatePagination(totalPages) {
  if (totalPages <= 1) return '';

  return `
    <div class="w-full flex justify-center mt-8">
      <div class="flex gap-2">
        ${Array.from({length: totalPages}, (_, i) => i + 1).map(page => `
          <button 
            class="px-4 py-2 border ${page === currentPage ? 'bg-primary text-white' : 'bg-white text-primary'} rounded hover:bg-primary hover:text-white transition-colors"
            onclick="changePage(${page})"
          >
            ${page}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

// Funzione globale per cambio pagina
window.changePage = function(page) {
  currentPage = page;
  // Re-render dei card con la nuova pagina
  console.log('Changing to page:', page);
};

/**
 * Carica le categorie dal JSON esterno con normalizzazione
 * @param {boolean} isMockData - Se true, restituisce dati fittizi
 * @returns {Promise<Array>} Lista delle categorie
 */
async function loadCategories(isMockData = false) {
  if (isMockData) {
    return [
      { name: 'Technology', value: 'technology' },
      { name: 'Education', value: 'education' },
      { name: 'Healthcare', value: 'healthcare' },
      { name: 'Environment', value: 'environment' }
    ];
  }

  try {
    console.log('Loading categories from /news-categories.json');
    const categoriesData = await getDataFromJson('/news-categories.json');

    if (!categoriesData) {
      console.warn('No categories data received');
      return [];
    }

    // Gestione flessibile della struttura dati
    let categories = [];
    if (Array.isArray(categoriesData.data)) {
      categories = categoriesData.data;
    } else if (Array.isArray(categoriesData)) {
      categories = categoriesData;
    } else if (categoriesData && typeof categoriesData === 'object') {
      const possibleArrays = ['items', 'categories', 'data', 'content'];
      for (const prop of possibleArrays) {
        if (Array.isArray(categoriesData[prop])) {
          categories = categoriesData[prop];
          break;
        }
      }
    }

    // ESCLUDE IL PRIMO ELEMENTO prima della trasformazione
    if (categories.length > 1) {
      categories = categories.slice(1);
      console.log('Categories: removed first element, remaining:', categories.length);
    }


    // Trasforma i dati in formato standard con normalizzazione
    return categories.map(category => {
      const name = category.name || category.title || category.category || 'Unknown';
      let value = category.value || category.slug || name.toLowerCase().replace(/\s+/g, '-');

      // Normalizza il valore per la comparazione
      value = value.toLowerCase().trim();

      return {
        name: name,
        value: value
      };
    });

  } catch (error) {
    console.error('Error loading categories:', error);
    return []; // Restituisce array vuoto in caso di errore
  }
}


/**
 * Carica le focus area dal JSON esterno con normalizzazione dei valori
 * @param {boolean} isMockData - Se true, restituisce dati fittizi
 * @returns {Promise<Array>} Lista delle focus area
 */
async function loadFocusAreas(isMockData = false) {
  if (isMockData) {
    return [
      { name: 'Education', value: 'mscfoundation:focus-area/education', icon: returnFocusAreaIcon('mscfoundation:focus-area/education') },
      { name: 'Community Support', value: 'mscfoundation:focus-area/community-support', icon: returnFocusAreaIcon('mscfoundation:focus-area/community-support') },
      { name: 'Environmental Conservation', value: 'mscfoundation:focus-area/environmental-conservation', icon: returnFocusAreaIcon('mscfoundation:focus-area/environmental-conservation') },
      { name: 'Emergency Relief', value: 'mscfoundation:focus-area/emergency-relief', icon: returnFocusAreaIcon('mscfoundation:focus-area/emergency-relief') }
    ];
  }

  try {
    console.log('Loading focus areas from /focus-area.json');
    const focusAreaData = await getDataFromJson('/focus-area.json');

    if (!focusAreaData) {
      console.warn('No focus area data received, using fallback');
      return getDefaultFocusAreas();
    }

    // Gestione flessibile della struttura dati
    let focusAreas = [];
    if (Array.isArray(focusAreaData.data)) {
      focusAreas = focusAreaData.data;
    } else if (Array.isArray(focusAreaData)) {
      focusAreas = focusAreaData;
    } else if (focusAreaData && typeof focusAreaData === 'object') {
      const possibleArrays = ['items', 'focusAreas', 'areas', 'data', 'content'];
      for (const prop of possibleArrays) {
        if (Array.isArray(focusAreaData[prop])) {
          focusAreas = focusAreaData[prop];
          break;
        }
      }
    }

    if (focusAreas.length === 0) {
      console.warn('No focus areas found in data, using fallback');
      return getDefaultFocusAreas();
    }

    // ESCLUDE IL PRIMO ELEMENTO prima della trasformazione
    if (focusAreas.length > 1) {
      focusAreas = focusAreas.slice(1);
      console.log('Focus Areas: removed first element, remaining:', focusAreas.length);
    }


    // Trasforma i dati in formato standard con normalizzazione
    return focusAreas.map(area => {
      const name = area.name || area.title || area.area || 'Unknown';
      let value = area.value || `mscfoundation:focus-area/${area.slug || name.toLowerCase().replace(/\s+/g, '-')}`;

      // Assicurati che il valore sia nel formato corretto
      if (!value.startsWith('mscfoundation:focus-area/')) {
        value = `mscfoundation:focus-area/${value}`;
      }

      return {
        name: name,
        value: value,
        icon: area.icon || returnFocusAreaIcon(value) || '📌'
      };
    });

  } catch (error) {
    console.error('Error loading focus areas:', error);
    return getDefaultFocusAreas();
  }
}

/**
 * Restituisce le focus area di default
 * @returns {Array} Focus area di default
 */
function getDefaultFocusAreas() {
  return [
    { name: 'Education', value: 'mscfoundation:focus-area/education', icon: returnFocusAreaIcon('mscfoundation:focus-area/education') },
    { name: 'Community Support', value: 'mscfoundation:focus-area/community-support', icon: returnFocusAreaIcon('mscfoundation:focus-area/community-support') },
    { name: 'Environmental Conservation', value: 'mscfoundation:focus-area/environmental-conservation', icon: returnFocusAreaIcon('mscfoundation:focus-area/environmental-conservation') },
    { name: 'Emergency Relief', value: 'mscfoundation:focus-area/emergency-relief', icon: returnFocusAreaIcon('mscfoundation:focus-area/emergency-relief') }
  ];
}



/**
 * Ottieni opzioni di data fisse
 * @returns {Array} Lista delle opzioni di data
 */
function getDateFilterOptions() {
  return [
    { name: 'Last 30 days', value: '30', days: 30 },
    { name: 'Last 3 months', value: '90', days: 90 },
    { name: 'Last 6 months', value: '180', days: 180 },
    { name: 'Last year', value: '365', days: 365 },
    { name: 'All time', value: 'all', days: null }
  ];
}

/**
 * Rendering della sezione filtri - aggiornata per usare i caricatori esterni
 * @param {Object} config - Configurazione del componente
 * @param {Array} articles - Tutti gli articoli per estrarre le opzioni di filtro
 * @param {boolean} isMockData - Se true, indica dati fittizi
 * @returns {Promise<string>} HTML della sezione filtri
 */
async function renderFiltersSection(config, articles, isMockData) {
  let filtersHTML = '<div class="space-y-6">';

  // Carica i dati dei filtri in parallelo per migliorare le performance
  const [categories, focusAreas] = await Promise.all([
    config.isFilterCategory ? loadCategories(isMockData) : Promise.resolve([]),
    config.isFilterFocusArea ? loadFocusAreas(isMockData) : Promise.resolve([])
  ]);

  if (config.isFilterFocusArea) {
    filtersHTML += await renderFocusAreaFilter(focusAreas, isMockData);
  }

  if (config.isFilterDate) {
    filtersHTML += renderDateFilter(isMockData);
  }

  if (config.isFilterCategory) {
    filtersHTML += await renderCategoryFilter(categories, isMockData);
  }

  filtersHTML += '</div>';
  return filtersHTML;
}
/**
 * Rendering del filtro per Focus Area - VERSIONE CON BOX STYLING
 */
async function renderFocusAreaFilter(focusAreas, isMockData) {
  console.log('renderFocusAreaFilter called with:', { focusAreas, isMockData });

  if (!focusAreas || focusAreas.length === 0) {
    console.warn('No focus areas available for filtering');
    return '';
  }

  const focusAreaOptions = focusAreas.map(area => {
    console.log('Creating focus area option:', area);

    // Verifica che abbiamo name e value validi
    const name = area.name || 'Unknown Focus Area';
    const value = area.value || 'unknown';

    // Gestione dell'icona
    const iconHTML = typeof area.icon === 'string' && area.icon.includes('<svg>')
      ? area.icon
      : `<span class="text-xl">${area.icon || '📌'}</span>`;

    return `
      <label class="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors">
        <input type="checkbox" value="${value}" class="focus-area-filter rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500">
        <div class="w-6 h-6 flex items-center justify-center">
          ${iconHTML}
        </div>
        <span class="text-sm text-gray-700 font-medium">${name}</span>
      </label>
    `;
  }).join('');

  return `
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-primary mb-3 flex items-center">
        Filter By Focus Area
      </h3>
      <div class="border border-gray-200 rounded-l-lg p-4 bg-white shadow-sm">
        <div class="space-y-2">
          ${focusAreaOptions}
        </div>
      </div>
    </div>
  `;
}

/**
 * Rendering del filtro per data - VERSIONE CON BOX STYLING
 */
function renderDateFilter(isMockData) {
  return `
    <div class="mb-6">
     <h3 class="text-lg font-semibold text-primary mb-3 flex items-center">
        Filter By Date
      </h3>
      <div class="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
        <select class="date-filter w-full px-3 py-2 border border-gray-300 rounded-l-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm">
          <option value="">All Time</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 3 months</option>
          <option value="365">Last year</option>
        </select>
      </div>
    </div>
  `;
}

/**
 * Rendering del filtro per categoria - VERSIONE CON BOX STYLING
 */
async function renderCategoryFilter(categories, isMockData) {
  console.log('renderCategoryFilter called with:', { categories, isMockData });

  if (!categories || categories.length === 0) {
    console.warn('No categories available for filtering');
    return '';
  }

  const categoryOptions = categories.map(category => {
    console.log('Creating category option:', category);

    // Verifica che abbiamo name e value validi
    const name = category.name || 'Unknown Category';
    const value = category.value || 'unknown';

    return `
      <label class="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors">
        <input type="checkbox" value="${value}" class="category-filter rounded border-gray-300 text-blue-600 focus:ring-blue-500">
        <span class="text-sm text-gray-700 font-medium">${name}</span>
      </label>
    `;
  }).join('');

  return `
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-primary mb-3 flex items-center">
        Filter By Category
      </h3>
      <div class="border border-gray-200 rounded-l-lg p-4 bg-white shadow-sm">
        <div class="space-y-2">
          ${categoryOptions}
        </div>
      </div>
    </div>
  `;
}


/**
 * Rendering dei filtri e contenuto
 */
async function renderFiltersAndContent(config, displayArticles, allArticles, isMockData) {
  let filtersHTML = '';

  if (config.isFilterFocusArea || config.isFilterDate || config.isFilterCategory) {
    filtersHTML = '<div class="w-full flex flex-col lg:flex-row gap-8">';
    filtersHTML += '<aside class="lg:w-1/4 space-y-6">';

    // ORDINE MODIFICATO: Date, Category, Focus Area
    if (config.isFilterDate) {
      filtersHTML += renderDateFilter(isMockData);
    }

    if (config.isFilterCategory) {
      const categories = await loadCategories(isMockData);
      filtersHTML += await renderCategoryFilter(categories, isMockData);
    }

    if (config.isFilterFocusArea) {
      const focusAreas = await loadFocusAreas(isMockData);
      filtersHTML += await renderFocusAreaFilter(focusAreas, isMockData);
    }

    filtersHTML += '</aside>';
    filtersHTML += '<main class="lg:w-3/4">';
    filtersHTML += '<div id="articles-container">';
    filtersHTML += RenderCards(displayArticles, config.cardStyle, config.itemsToShow, config.cardBehaviour, isMockData);
    filtersHTML += '</div>';
    filtersHTML += '</main>';
    filtersHTML += '</div>';
  } else {
    filtersHTML = '<div id="articles-container" class="w-full">';
    filtersHTML += RenderCards(displayArticles, config.cardStyle, config.itemsToShow, config.cardBehaviour, isMockData);
    filtersHTML += '</div>';
  }

  return filtersHTML;
}

/**
 * Rendering del titolo
 * @param {string} title - Titolo da renderizzare
 * @returns {string} HTML del titolo
 */
function renderTitle(title) {
  if (!title) return '';

  return `
    <div class="w-full flex gap-8 items-end">
      <span class="text-2xl font-semibold w-fit text-black lg:text-5xl">${title}</span>
      <div class="bg-black h-[0.5px] flex-grow"></div>
    </div>
  `;
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
          <span class="text-xl">ℹ️</span>
        </div>
        <div class="ml-3">
          <p class="text-sm">
            <strong>Author Mode:</strong> This component is showing sample data with filtering capabilities. Configure the API settings to display real content.
          </p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Rendering della griglia di articoli con supporto masonry
 * @param {Array} articles - Array di articoli da renderizzare
 * @param {string} cardStyle - Stile delle card
 * @param {string} cardBehaviour - Comportamento delle card
 * @param {boolean} isMockData - Se true, indica dati fittizi
 * @returns {string} HTML della griglia
 */
function renderArticlesGrid(articles, cardStyle, cardBehaviour, isMockData = false) {
  console.log('renderArticlesGrid called with:', {
    articlesCount: articles?.length || 0,
    cardStyle,
    cardBehaviour,
    isMockData
  });

  if (!Array.isArray(articles) || articles.length === 0) {
    return renderEmptyState();
  }

  const articlesHTML = articles.map((article, index) => {
    console.log(`Rendering article ${index + 1}:`, {
      title: article.title,
      pageType: article.pageType,
      category: article.category
    });

    // Gestione sicura dell'estrazione dei tag
    let focusAreas = '';
    let status = '';

    try {
      if (article.pageType) {
        focusAreas = extractTagsByType(article.pageType, 'mscfoundation:focus-area') || '';
        status = extractTagsByType(article.pageType, 'mscfoundation:status') || '';
      }
    } catch (error) {
      console.warn('Error extracting tags for article:', error);
    }

    // Gestione del comportamento della card
    const cardProps = getCardProps(article, cardBehaviour, isMockData);

    // Crea l'oggetto con tutti i dati della card
    const cardData = {
      title: article.title || '',
      subTitle: article.description || '',
      topLabel: status,
      backgroundImage: article.thumbImg || '',
      icons: focusAreas,
      date: article.published_time || '',
      href: cardProps.href,
      variant: cardStyle,
      isMockData: isMockData,
      download: cardProps.download || '',
      onclick: cardProps.onclick || ''
    };

    return `
      <article-card 
        data-card='${JSON.stringify(cardData).replace(/'/g, '&apos;')}'
        data-behaviour="${cardBehaviour}"
      >
      </article-card>
    `;
  }).join('');

  // Usa il layout masonry come in blog-preview-single
  return `
    <div class="flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:gap-8">
      ${articlesHTML}
    </div>
  `;
}


/**
 * Rendering di una singola card articolo - adattata da blog-preview-single
 * @param {Object} item - Dati dell'articolo
 * @param {string} cardStyle - Stile della card
 * @param {string} cardBehaviour - Comportamento della card
 * @param {number} index - Indice dell'articolo
 * @param {boolean} isMockData - Se true, indica dati fittizi
 * @returns {string} HTML della card
 */
function renderArticleCard(item, cardStyle, cardBehaviour, index, isMockData = false) {
  // Prepara tutti i dati in un oggetto - stesso pattern di blog-preview-single
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

  return `
    <article-card 
        class="lg:h-fit min-w-[280px] lg:min-w-0"
        data-card='${JSON.stringify(cardData)}'
    ></article-card>
  `;
}

/**
 * Ottieni le proprietà della card in base al comportamento
 * @param {Object} item - Articolo
 * @param {string} cardBehaviour - Comportamento della card
 * @param {boolean} isMockData - Se true, indica dati fittizi
 * @returns {Object} Proprietà della card
 */
function getCardProps(item, cardBehaviour, isMockData) {
  console.log('getCardProps called with:', { item, cardBehaviour, isMockData });
  if (isMockData) {
    return {
      href: '#',
      download: '',
      onclick: 'alert("Mock mode"); return false;'
    };
  }

  switch (cardBehaviour) {
    case 'page-link':
      return {
        href: item.path || '#',
        download: '',
        onclick: ''
      };
    case 'download':
      return {
        href: item.path || '#',
        download: 'download',
        onclick: ''
      };
    case 'popup':
      return {
        href: '#',
        download: '',
        onclick: `openArticlePopup('${item.path || '#'}')`
      };
    default:
      return {
        href: item.path || '#',
        download: '',
        onclick: ''
      };
  }
}


/**
 * Rendering del pulsante d'azione - adattata da blog-preview-single
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
 * Setup degli event listeners se necessario - adattata da blog-preview-single
 * @param {HTMLElement} container - Container principale
 * @param {boolean} isMockData - Se true, indica dati fittizi
 */
function setupEventListeners(container, isMockData = false) {
  // Event listeners specifici per il comportamento popup se necessario
  const popupLinks = container.querySelectorAll('[onclick*="openArticlePopup"]');

  popupLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (isMockData) {
        alert('This is a mock popup in author mode');
      } else {
        // Implementa qui la logica del popup reale
        console.log('Popup functionality not yet implemented');
      }
    });
  });
}

/**
 * Aggiunge gli stili CSS personalizzati per il layout responsivo delle card
 * @param {HTMLElement} block - Elemento DOM del blocco
 */
function addMasonryStyles(block) {
  // Rimuovi eventuali stili precedenti
  const existingStyle = block.querySelector('#blog-preview-filter-styles');
  if (existingStyle) {
    existingStyle.remove();
  }

  // Crea nuovo elemento style
  const style = document.createElement('style');
  style.id = 'blog-preview-filter-styles';
  style.textContent = `
    /* Layout responsivo per le card - massimo 3 colonne */
    .cards-grid-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      width: 100%;
    }

    .cards-grid-item {
      width: 100%;
      display: flex;
      flex-direction: column;
    }

    .cards-grid-item article-card {
      width: 100%;
      height: auto;
      display: block;
    }

    /* Tablet - 2 colonne */
    @media (min-width: 768px) {
      .cards-grid-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
        align-items: start;
      }
    }

    /* Desktop - 3 colonne (massimo) */
    @media (min-width: 1024px) {
      .cards-grid-container {
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
      }
    }

    /* Desktop medio - mantiene 3 colonne */
    @media (min-width: 1280px) {
      .cards-grid-container {
        grid-template-columns: repeat(3, 1fr);
        gap: 2.5rem;
      }
    }

    /* Desktop grande - mantiene 3 colonne */
    @media (min-width: 1440px) {
      .cards-grid-container {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 2.5rem;
        max-width: 100%;
      }
      
      .cards-grid-item {
        min-width: 0;
        max-width: 100%;
      }
      
      .cards-grid-item article-card {
        width: 100%;
        max-width: 100%;
      }
    }

    /* Ultra wide - mantiene sempre 3 colonne */
    @media (min-width: 1600px) {
      .cards-grid-container {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 3rem;
      }
    }

    /* 4K e superiori - mantiene sempre 3 colonne */
    @media (min-width: 1920px) {
      .cards-grid-container {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 3rem;
      }
    }

    /* Assicura che le card non si sovrappongano mai */
    .cards-grid-item article-card,
    .cards-grid-item article-card * {
      box-sizing: border-box;
      max-width: 100%;
    }

    /* Fix per altezza delle card */
    .cards-grid-container {
      align-items: stretch;
    }

    .cards-grid-item {
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .cards-grid-item article-card {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* Previene problemi di overflow */
    .cards-grid-container * {
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
  `;

  // Aggiungi gli stili al blocco
  block.appendChild(style);
}


/**
 * Estrae e valida la configurazione dal blocco DOM
 */
function extractBlockConfig(block) {
  const titleElement = block.querySelector(':scope > div:nth-child(1) div');
  const title = titleElement?.innerHTML?.trim() || DEFAULT_CONFIG.TITLE;

  const cardStyle = block.querySelector(':scope > div:nth-child(2) div p')?.textContent?.trim() || DEFAULT_CONFIG.CARD_STYLE;

  const apiString = block.querySelector(':scope > div:nth-child(3) div p')?.textContent?.trim() || DEFAULT_CONFIG.API_STRING;
  const itemsToShow = block.querySelector(':scope > div:nth-child(4) div p')?.textContent?.trim() || DEFAULT_CONFIG.ITEMS_TO_SHOW;

  const filterFocusAreaText = block.querySelector(':scope > div:nth-child(5) div p')?.textContent?.trim() || 'false';
  const isFilterFocusArea = stringToBoolean(filterFocusAreaText);

  const filterDateText = block.querySelector(':scope > div:nth-child(6) div p')?.textContent?.trim() || 'false';
  const isFilterDate = stringToBoolean(filterDateText);

  const filterCategoryText = block.querySelector(':scope > div:nth-child(6) div p')?.textContent?.trim() || 'false';
  const isFilterCategory = stringToBoolean(filterCategoryText);

  const cardBehaviour = block.querySelector(':scope > div:nth-child(8) div p')?.textContent?.trim() || DEFAULT_CONFIG.CARD_BEHAVIOUR;

  return {
    title,
    cardStyle,
    apiString,
    itemsToShow,
    isFilterFocusArea,
    isFilterDate,
    isFilterCategory,
    cardBehaviour
  };
}

/**
 * Setup degli event listeners per i filtri
 * @param {HTMLElement} container - Container principale
 * @param {Object} config - Configurazione del componente
 * @param {Array} allArticles - Tutti gli articoli disponibili
 * @param {boolean} isMockData - Se true, indica dati fittizi
 */
function setupFilterEventListeners(container, config, allArticles, isMockData) {
  console.log('Setting up filter event listeners');

  // Event listeners per focus area checkboxes
  const focusAreaCheckboxes = container.querySelectorAll('.focus-area-filter');
  focusAreaCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      console.log('Focus area filter changed:', checkbox.value, checkbox.checked);
      applyFilters(container, config, allArticles, isMockData);
    });
  });

  // Event listeners per category checkboxes
  const categoryCheckboxes = container.querySelectorAll('.category-filter');
  categoryCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      console.log('Category filter changed:', checkbox.value, checkbox.checked);
      applyFilters(container, config, allArticles, isMockData);
    });
  });

  // Event listener per date select
  const dateSelect = container.querySelector('.date-filter');
  if (dateSelect) {
    dateSelect.addEventListener('change', () => {
      console.log('Date filter changed:', dateSelect.value);
      applyFilters(container, config, allArticles, isMockData);
    });
  }

  console.log('Filter event listeners setup complete');
}

/**
 * Pulisce tutti i filtri - VERSIONE AGGIORNATA
 * @param {HTMLElement} container - Container principale
 * @param {Object} config - Configurazione del componente
 * @param {Array} allArticles - Tutti gli articoli
 * @param {boolean} isMockData - Se true, indica dati fittizi
 */
function clearAllFilters(container, config, allArticles, isMockData) {
  // Deseleziona tutti i checkbox
  container.querySelectorAll('.focus-area-filter, .category-filter').forEach(filter => {
    filter.checked = false;
  });

  // Reset del filtro data
  const dateFilter = container.querySelector('.date-filter');
  if (dateFilter) {
    dateFilter.value = '';
  }

  // Mostra tutti gli articoli
  const articlesContainer = container.querySelector('#articles-container');
  if (articlesContainer) {
    articlesContainer.innerHTML = renderArticlesGrid(
      allArticles.slice(0, config.itemsToShow),
      config.cardStyle,
      config.cardBehaviour,
      isMockData
    );
  }
}

/**
 * Normalizza una stringa di tag per la comparazione
 * Gestisce codifiche URL, caratteri speciali e case sensitivity
 * @param {string} tagString - Stringa di tag da normalizzare
 * @returns {string} Stringa normalizzata
 */
function normalizeTagString(tagString) {
  if (!tagString) return '';

  try {
    // Decodifica URL encoding se presente
    let normalized = decodeURIComponent(tagString);

    // Converte a lowercase per comparazione case-insensitive
    normalized = normalized.toLowerCase();

    // Sostituisce caratteri speciali comuni
    normalized = normalized
      .replace(/[%20]/g, ' ')  // Spazi codificati
      .replace(/[%2C]/g, ',')  // Virgole codificate
      .replace(/[%2F]/g, '/')  // Slash codificati
      .replace(/\s+/g, ' ')    // Multipli spazi in uno singolo
      .trim();

    console.log('Tag normalization:', {
      original: tagString,
      normalized: normalized
    });

    return normalized;
  } catch (error) {
    console.warn('Error normalizing tag string:', tagString, error);
    // Fallback: almeno lowercase e trim
    return tagString.toLowerCase().trim();
  }
}

/**
 * Estrae i tag di un tipo specifico da una stringa pageType
 * Versione migliorata che gestisce codifiche e separatori multipli
 * @param {string} pageType - Stringa pageType contenente i tag
 * @param {string} tagType - Tipo di tag da estrarre (es. 'mscfoundation:focus-area')
 * @returns {Array} Array di tag estratti
 */
function extractTagsOfType(pageType, tagType) {
  if (!pageType || !tagType) return [];

  try {
    const normalizedPageType = normalizeTagString(pageType);
    const normalizedTagType = normalizeTagString(tagType);

    // Suddivide per virgole e altri possibili separatori
    const tags = normalizedPageType.split(/[,;|]/).map(tag => tag.trim());

    // Filtra i tag che iniziano con il tipo richiesto
    const matchingTags = tags.filter(tag => tag.startsWith(normalizedTagType));

    console.log('Tag extraction:', {
      pageType: pageType,
      tagType: tagType,
      extracted: matchingTags
    });

    return matchingTags;
  } catch (error) {
    console.warn('Error extracting tags:', error);
    return [];
  }
}

/**
 * Filtra gli articoli basandosi sui criteri selezionati con logica OR
 * @param {Array} articles - Lista di tutti gli articoli
 * @param {Object} selectedFilters - Filtri selezionati dall'utente
 * @returns {Array} Articoli filtrati
 */
function filterArticles(articles, selectedFilters) {
  console.log('=== FILTER ARTICLES DEBUG (OR Logic) ===');
  console.log('Articles to filter:', articles.length);
  console.log('Selected filters:', selectedFilters);

  return articles.filter(article => {
    console.log('\n--- Filtering article:', article.title);
    console.log('Article pageType:', article.pageType);
    console.log('Article category:', article.category);

    const articlePageType = article.pageType || '';
    const normalizedPageType = normalizeTagString(articlePageType);

    console.log('Normalized pageType:', normalizedPageType);

    let passedFocusArea = true;
    let passedCategory = true;
    let passedDate = true;

    // Filtro Focus Area con logica OR (almeno uno deve essere presente)
    if (selectedFilters.focusAreas.length > 0) {
      console.log('Checking focus areas (OR logic):', selectedFilters.focusAreas);

      passedFocusArea = selectedFilters.focusAreas.some(selectedFocusArea => {
        const normalizedSelected = normalizeTagString(selectedFocusArea);
        const found = normalizedPageType.includes(normalizedSelected);

        console.log(`  - Focus area '${selectedFocusArea}' (normalized: '${normalizedSelected}') found: ${found}`);

        return found;
      });

      console.log('Passed focus area filter (OR):', passedFocusArea);
    }

    // Filtro Category con logica OR (almeno una deve essere presente)
    if (selectedFilters.categories.length > 0) {
      console.log('Checking categories (OR logic):', selectedFilters.categories);

      const articleCategory = article.category || '';
      const normalizedCategory = normalizeTagString(articleCategory);

      passedCategory = selectedFilters.categories.some(selectedCategory => {
        const normalizedSelected = normalizeTagString(selectedCategory);
        const foundInCategory = normalizedCategory.includes(normalizedSelected);
        const foundInPageType = normalizedPageType.includes(normalizedSelected);

        console.log(`  - Category '${selectedCategory}' (normalized: '${normalizedSelected}')`);
        console.log(`    Found in category field: ${foundInCategory}`);
        console.log(`    Found in pageType field: ${foundInPageType}`);

        return foundInCategory || foundInPageType;
      });

      console.log('Passed category filter (OR):', passedCategory);
    }

    // Filtro Data (rimane uguale)
    if (selectedFilters.dateRange && selectedFilters.dateRange !== 'all') {
      console.log('Checking date filter:', selectedFilters.dateRange);

      const articleDate = new Date(article.published_time);
      const now = new Date();
      const daysBack = parseInt(selectedFilters.dateRange);

      if (!isNaN(daysBack) && isFinite(daysBack)) {
        const cutoffDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
        passedDate = articleDate >= cutoffDate;

        console.log(`  - Article date: ${articleDate.toISOString()}`);
        console.log(`  - Cutoff date: ${cutoffDate.toISOString()}`);
        console.log(`  - Date filter passed: ${passedDate}`);
      }
    }

    // L'articolo passa il filtro se passa TUTTI i tipi di filtro attivi
    // Ma per ogni tipo di filtro (focus area, category) usa logica OR
    const finalResult = passedFocusArea && passedCategory && passedDate;

    console.log('Final filter result:', {
      passedFocusArea,
      passedCategory,
      passedDate,
      finalResult
    });

    if (finalResult) {
      console.log('✅ Article passed all filters');
    } else {
      console.log('❌ Article filtered out');
    }

    return finalResult;
  });
}

/**
 * Raccoglie tutti i filtri selezionati dall'interfaccia utente
 * @param {HTMLElement} container - Container principale
 * @returns {Object} Oggetto con tutti i filtri selezionati
 */
function getSelectedFilters(container) {
  const selectedFilters = {
    focusAreas: [],
    categories: [],
    dateRange: null
  };

  // Raccogli focus areas selezionate
  const focusAreaCheckboxes = container.querySelectorAll('.focus-area-filter:checked');
  selectedFilters.focusAreas = Array.from(focusAreaCheckboxes).map(cb => cb.value);

  // Raccogli categorie selezionate
  const categoryCheckboxes = container.querySelectorAll('.category-filter:checked');
  selectedFilters.categories = Array.from(categoryCheckboxes).map(cb => cb.value);

  // Raccogli selezione data
  const dateSelect = container.querySelector('.date-filter');
  if (dateSelect && dateSelect.value) {
    selectedFilters.dateRange = dateSelect.value;
  }

  return selectedFilters;
}

/**
 * Applica i filtri selezionati agli articoli con logging dettagliato
 * @param {HTMLElement} container - Container principale
 * @param {Object} config - Configurazione del componente
 * @param {Array} allArticles - Tutti gli articoli disponibili
 * @param {boolean} isMockData - Se true, indica dati fittizi
 */
function applyFilters(container, config, allArticles, isMockData) {
  console.log('=== APPLYING FILTERS ===');
  console.log('Total articles before filtering:', allArticles.length);

  // Raccogli tutti i filtri selezionati
  const selectedFilters = getSelectedFilters(container);
  console.log('Selected filters:', selectedFilters);

  // Se non ci sono filtri selezionati, mostra tutti gli articoli
  if (selectedFilters.focusAreas.length === 0 &&
    selectedFilters.categories.length === 0 &&
    !selectedFilters.dateRange) {
    console.log('No filters selected, showing all articles');
    currentPage = 1;
    const articlesContainer = container.querySelector('#articles-container');
    if (articlesContainer) {
      articlesContainer.innerHTML = RenderCards(
        allArticles,
        config.cardStyle,
        config.itemsToShow,
        config.cardBehaviour,
        isMockData
      );
    }
    return;
  }

  // Filtra gli articoli in base ai criteri selezionati
  let filteredArticles = filterArticles(allArticles, selectedFilters);
  console.log('=== FILTERING COMPLETE ===');
  console.log('Filtered articles:', filteredArticles.length, 'out of', allArticles.length);

  // Reset della paginazione
  currentPage = 1;

  // Re-render degli articoli filtrati
  const articlesContainer = container.querySelector('#articles-container');
  if (articlesContainer) {
    if (filteredArticles.length > 0) {
      articlesContainer.innerHTML = RenderCards(
        filteredArticles,
        config.cardStyle,
        config.itemsToShow,
        config.cardBehaviour,
        isMockData
      );
    } else {
      showNoResultsMessage(articlesContainer);
    }
  }
}

/**
 * Mostra messaggio quando non ci sono risultati
 * @param {HTMLElement} container - Container dove mostrare il messaggio
 */
function showNoResultsMessage(container) {
  container.innerHTML = `
    <div class="flex flex-col justify-center items-center w-full text-center py-16">
      <div class="text-6xl mb-4">🔍</div>
      <div class="text-2xl font-semibold text-gray-600 mb-2">No articles found</div>
      <div class="text-gray-500">Try adjusting your filters to see more results</div>
    </div>
  `;
}

