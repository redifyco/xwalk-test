// blocks/blog-preview-filter/blog-preview-filter.js

import '../../scripts/customTag.js';
import {
  extractTagsByType,
  getDataFromJson,
  returnFocusAreaIcon,
  stringToBoolean,
  isEditorMode
} from "../../scripts/utils.js";

// Global state for pagination and rendering
let currentArticles = [];
let currentConfig = {};
let isMockDataGlobal = false;
let currentPage = 1;

const DEFAULT_CONFIG = {
  TITLE: '',
  BUTTON_TEXT: 'View All',
  BUTTON_LINK: '#',
  CARD_STYLE: 'primary',
  API_STRING: '',
  ITEMS_TO_SHOW: 6,
  CARD_BEHAVIOUR: 'page-link'
};

export default async function decorate(block) {
  try {
    const config = extractBlockConfig(block);
    const isAuthorMode = isEditorMode();

    // For development: always use mock data
    if (true) {
      const mockData = generateMockData(config.itemsToShow);
      await renderComponent(block, config, mockData, true);
      return;
    }

    if (!config.apiString || config.apiString === DEFAULT_CONFIG.API_STRING) {
      renderConfigurationMessage(block);
      return;
    }

    renderLoadingState(block);
    const resultData = await getDataFromJson(config.apiString);

    if (!resultData) {
      throw new Error('No data received from API');
    }

    let articles = [];
    if (Array.isArray(resultData.data)) {
      articles = resultData.data;
    } else if (Array.isArray(resultData)) {
      articles = resultData;
    } else if (resultData && typeof resultData === 'object') {
      const possibleArrays = ['items', 'articles', 'posts', 'data', 'content', 'results'];
      for (const prop of possibleArrays) {
        if (Array.isArray(resultData[prop])) {
          articles = resultData[prop];
          break;
        }
      }
    }

    if (articles.length === 0) {
      await renderComponent(block, config, { data: [] }, false);
      return;
    }

    await renderComponent(block, config, { data: articles }, false);

  } catch (error) {
    console.error('Error in Blog Preview Filter component:', error);
    renderErrorState(block, error.message);
  }
}

// --- MOCK DATA ---
function generateMockData(count = 6) {
  // Always generate 20 items for pagination test
  const validCount = 20;
  const mockCategories = ['Technology', 'Education', 'Healthcare', 'Environment'];
  const mockFocusAreas = ['education', 'healthcare', 'technology', 'environment'];
  const mockStatuses = ['ongoing', 'complete', 'published'];
  const mockArticles = [];
  for (let i = 0; i < validCount; i++) {
    const randomCategory = mockCategories[Math.floor(Math.random() * mockCategories.length)];
    const randomFocusArea = mockFocusAreas[Math.floor(Math.random() * mockFocusAreas.length)];
    const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];
    mockArticles.push({
      title: `Sample Article ${i + 1} - ${randomCategory}`,
      description: `This is a sample description for article ${i + 1} in ${randomCategory}.`,
      path: `/articles/sample-article-${i + 1}`,
      published_time: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      thumbImg: `/content/dam/mscfoundation/hero-images/hero-placeholder.jpg`,
      pageType: `mscfoundation:focus-area/${randomFocusArea},mscfoundation:status/${randomStatus}`,
      category: randomCategory
    });
  }
  return { data: mockArticles };
}

// --- RENDERING HELPERS ---
function renderConfigurationMessage(block) {
  block.innerHTML = `
    <section class="bg-white flex flex-col items-center justify-center gap-8 px-4 pb-14 lg:gap-20 lg:px-20 lg:py-14">
      <div class="text-center">
        <div class="text-6xl text-orange-500 mb-4">⚙️</div>
        <h3 class="text-2xl font-bold text-primary mb-4">Blog Preview Filter Configuration</h3>
        <p class="text-gray-600 mb-4">Please configure the API URL in the component settings to display articles.</p>
        <p class="text-sm text-gray-500">This message is only visible in author mode.</p>
      </div>
    </section>
  `;
}

function renderLoadingState(block) {
  block.innerHTML = `
    <section class="bg-white flex flex-col items-center justify-center gap-8 px-4 pb-14 lg:gap-20 lg:px-20 lg:py-14">
      <div class="text-center">
        <div class="animate-spin text-6xl text-blue-500 mb-4">🔄</div>
        <h3 class="text-2xl font-semibold text-gray-800 mb-2">Loading Content...</h3>
        <p class="text-gray-600">Please wait while we fetch the latest articles.</p>
      </div>
    </section>
  `;
}

function renderErrorState(block, errorMessage = 'Error loading content') {
  block.innerHTML = `
    <section class="bg-white flex flex-col items-center justify-center gap-8 px-4 pb-14 lg:gap-20 lg:px-20 lg:py-14">
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
}

// --- MAIN RENDER FUNCTION ---
async function renderComponent(block, config, resultData, isMockData = false) {
  let articles = Array.isArray(resultData.data) ? resultData.data : [];
  currentArticles = articles;
  currentConfig = config;
  isMockDataGlobal = isMockData;
  currentPage = 1;

  const sectionContainer = document.createElement('section');
  sectionContainer.className = 'bg-white';
  sectionContainer.setAttribute('data-component', 'blog-preview-filter');
  sectionContainer.setAttribute('data-card-behaviour', config.cardBehaviour);
  sectionContainer.setAttribute('data-items-to-show', config.itemsToShow);
  if (isMockData) sectionContainer.setAttribute('data-mock-mode', 'true');

  const filtersAndContentHTML = await renderFiltersAndContent(config, articles, isMockData);

  sectionContainer.innerHTML = `
    ${isMockData ? renderAuthorModeNotice() : ''}
    <section class="flex flex-col items-center justify-center gap-8 container-layout-padding bg-white">
      ${renderTitle(config.title)}
      ${filtersAndContentHTML}
      ${renderActionButton(config.buttonText || '', config.buttonLink || '#', isMockData)}
    </section>
  `;

  block.textContent = '';
  block.append(sectionContainer);

  setupFilterEventListeners(sectionContainer, config, articles, isMockData);
  setupEventListeners(sectionContainer, isMockData);
}

// --- FILTERS AND CONTENT ---
async function renderFiltersAndContent(config, allArticles, isMockData) {
  let filtersHTML = '';
  if (config.isFilterFocusArea || config.isFilterDate || config.isFilterCategory) {
    filtersHTML = '<div class="w-full flex flex-col lg:flex-row gap-8"><aside class="lg:w-1/4 space-y-6">';
    if (config.isFilterDate) filtersHTML += renderDateFilter();
    if (config.isFilterCategory) filtersHTML += await renderCategoryFilter(await loadCategories(isMockData));
    if (config.isFilterFocusArea) filtersHTML += await renderFocusAreaFilter(await loadFocusAreas(isMockData));
    filtersHTML += '</aside><main class="lg:w-3/4"><div id="articles-container">';
    filtersHTML += RenderCards(allArticles, config.cardStyle, config.itemsToShow, config.cardBehaviour, isMockData, 1);
    filtersHTML += '</div></main></div>';
  } else {
    filtersHTML = `<div id="articles-container" class="w-full">${RenderCards(allArticles, config.cardStyle, config.itemsToShow, config.cardBehaviour, isMockData, 1)}</div>`;
  }
  return filtersHTML;
}

// --- CARDS AND PAGINATION ---
function RenderCards(data, cardStyle, perPage, cardBehaviour = 'page-link', isMockData = false, page = 1) {
  if (!Array.isArray(data) || data.length === 0) return renderEmptyState();
  const totalPages = Math.ceil(data.length / perPage);
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const result = data.slice(startIndex, endIndex);

  const articlesHTML = result.map((item, index) => {
    let pageTypesObject = { focusAreas: '', status: '' };
    try {
      if (item.pageType) {
        pageTypesObject.focusAreas = extractTagsByType(item.pageType, 'mscfoundation:focus-area') || '';
        pageTypesObject.status = extractTagsByType(item.pageType, 'mscfoundation:status') || '';
      }
    } catch (error) {}
    const cardProps = getCardProps(item, cardBehaviour, isMockData);
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
    return `<article-card data-card='${JSON.stringify(cardData).replace(/'/g, '&apos;')}' data-behaviour="${cardBehaviour}"></article-card>`;
  }).join('');

  return `
    <div class="w-full">
      <div class="grid md:grid-cols-2 gap-4 xl:grid-cols-3">
        ${articlesHTML}
      </div>
      ${totalPages > 1 ? generatePagination(totalPages, page) : ''}
    </div>
  `;
}

function generatePagination(totalPages, currentPage) {
  if (totalPages <= 1) return '';
  return `
    <div class="w-full flex justify-center mt-8">
      <div class="flex gap-2">
        ${Array.from({length: totalPages}, (_, i) => i + 1).map(page => `
          <button
            class="px-4 py-2 border ${page === currentPage ? 'bg-primary text-white' : 'bg-white text-primary'} rounded hover:bg-primary hover:text-white transition-colors"
            onclick="window.changePage(${page})"
          >
            ${page}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

// --- PAGINATION HANDLER ---
window.changePage = function(page) {
  currentPage = page;
  const container = document.querySelector('[data-component="blog-preview-filter"]');
  if (!container) return;
  const articlesContainer = container.querySelector('#articles-container');
  if (articlesContainer) {
    articlesContainer.innerHTML = RenderCards(
        currentArticles,
        currentConfig.cardStyle,
        currentConfig.itemsToShow,
        currentConfig.cardBehaviour,
        isMockDataGlobal,
        currentPage
    );
  }
};

// --- FILTERS (placeholders, implement as needed) ---
async function loadCategories(isMockData = false) {
  if (isMockData) {
    return [
      { name: 'Technology', value: 'technology' },
      { name: 'Education', value: 'education' },
      { name: 'Healthcare', value: 'healthcare' },
      { name: 'Environment', value: 'environment' }
    ];
  }
  // ...fetch and normalize categories as in your original code...
  return [];
}

async function loadFocusAreas(isMockData = false) {
  if (isMockData) {
    return [
      { name: 'Education', value: 'mscfoundation:focus-area/education', icon: returnFocusAreaIcon('mscfoundation:focus-area/education') },
      { name: 'Community Support', value: 'mscfoundation:focus-area/community-support', icon: returnFocusAreaIcon('mscfoundation:focus-area/community-support') },
      { name: 'Environmental Conservation', value: 'mscfoundation:focus-area/environmental-conservation', icon: returnFocusAreaIcon('mscfoundation:focus-area/environmental-conservation') },
      { name: 'Emergency Relief', value: 'mscfoundation:focus-area/emergency-relief', icon: returnFocusAreaIcon('mscfoundation:focus-area/emergency-relief') }
    ];
  }
  // ...fetch and normalize focus areas as in your original code...
  return [];
}

async function renderCategoryFilter(categories) {
  if (!categories || categories.length === 0) return '';
  return `
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-primary mb-3 flex items-center">Filter By Category</h3>
      <div class="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
        <div class="space-y-2">
          ${categories.map(category => `
            <label class="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors">
              <input type="checkbox" value="${category.value}" class="category-filter rounded border-gray-300 text-blue-600 focus:ring-blue-500">
              <span class="text-sm text-gray-700 font-medium">${category.name}</span>
            </label>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

async function renderFocusAreaFilter(focusAreas) {
  if (!focusAreas || focusAreas.length === 0) return '';
  return `
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-primary mb-3 flex items-center">Filter By Focus Area</h3>
      <div class="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
        <div class="space-y-2">
          ${focusAreas.map(area => `
            <label class="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors">
              <input type="checkbox" value="${area.value}" class="focus-area-filter rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500">
              <div class="w-6 h-6 flex items-center justify-center">${typeof area.icon === 'string' && area.icon.includes('<svg>') ? area.icon : `<span class="text-xl">${area.icon || '📌'}</span>`}</div>
              <span class="text-sm text-gray-700 font-medium">${area.name}</span>
            </label>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderDateFilter() {
  return `
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-primary mb-3 flex items-center">Filter By Date</h3>
      <div class="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
        <select class="date-filter w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm">
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

// --- FILTER EVENT HANDLERS (implement as needed) ---
function setupFilterEventListeners(container, config, allArticles, isMockData) {
  // Add event listeners for filters and call applyFilters on change
}

function setupEventListeners(container, isMockData = false) {
  // Add event listeners for popup or other behaviors if needed
}

// --- UTILS ---
function renderTitle(title) {
  if (!title) return '';
  return `
    <div class="w-full flex gap-8 items-end">
      <span class="text-2xl font-semibold w-fit text-black lg:text-5xl">${title}</span>
      <div class="bg-black h-[0.5px] flex-grow"></div>
    </div>
  `;
}

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

function renderEmptyState() {
  return `
    <div class="flex flex-col justify-center items-center w-full text-center py-16">
      <div class="text-4xl mb-4">📝</div>
      <div class="text-2xl font-semibold text-gray-600 mb-2">No Content Available</div>
      <div class="text-gray-500">There are no articles to display at the moment.</div>
    </div>
  `;
}

function renderAuthorModeNotice() {
  return `
    <div class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0"><span class="text-xl">ℹ️</span></div>
        <div class="ml-3">
          <p class="text-sm"><strong>Author Mode:</strong> This component is showing sample data with filtering capabilities. Configure the API settings to display real content.</p>
        </div>
      </div>
    </div>
  `;
}

function getCardProps(item, cardBehaviour, isMockData) {
  if (isMockData) {
    return { href: '#', download: '', onclick: 'alert("Mock mode"); return false;' };
  }
  switch (cardBehaviour) {
    case 'page-link':
      return { href: item.path || '#', download: '', onclick: '' };
    case 'download':
      return { href: item.path || '#', download: 'download', onclick: '' };
    case 'popup':
      return { href: '#', download: '', onclick: `openArticlePopup('${item.path || '#'}')` };
    default:
      return { href: item.path || '#', download: '', onclick: '' };
  }
}

function extractBlockConfig(block) {
  const titleElement = block.querySelector(':scope > div:nth-child(1) div');
  const title = titleElement?.innerHTML?.trim() || DEFAULT_CONFIG.TITLE;
  const cardStyle = block.querySelector(':scope > div:nth-child(2) div p')?.textContent?.trim() || DEFAULT_CONFIG.CARD_STYLE;
  const apiString = block.querySelector(':scope > div:nth-child(3) div p')?.textContent?.trim() || DEFAULT_CONFIG.API_STRING;
  const itemsToShowRaw = block.querySelector(':scope > div:nth-child(4) div p')?.textContent?.trim();
  const itemsToShow = parseInt(itemsToShowRaw, 10) || DEFAULT_CONFIG.ITEMS_TO_SHOW;
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
    itemsToShow, // now always a number
    isFilterFocusArea,
    isFilterDate,
    isFilterCategory,
    cardBehaviour
  };
}
