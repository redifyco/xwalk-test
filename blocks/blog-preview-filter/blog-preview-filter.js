import '../../scripts/customTag.js'
import {
    extractTagsByType,
    getAllArticles,
    returnBoolean,
    returnFocusAreaIcon
} from "../../scripts/utils.js";

let currentPage = 1;

export default async function decorate(block) {
    const title = block.querySelector(':scope > div:nth-child(1) div p')?.textContent || ''
    const cardStyle = block.querySelector(':scope > div:nth-child(2) div p')?.textContent || 'primary'
    const apiString = block.querySelector(':scope > div:nth-child(3) div p')?.textContent || ''
    const itemsToShow = Number(block.querySelector(':scope > div:nth-child(4) div p')?.textContent) || 3
    const isFilterFocusArea = returnBoolean(block, 5)
    const isFilterDate = returnBoolean(block, 6)
    const isFilterCategory = returnBoolean(block, 7)
    const aemEnv = block.getAttribute('data-aue-resource');
    const data = await getAllArticles(apiString)


    const resultData = getFilteredData(data.data, isFilterFocusArea, '', '')
    const sectionContainer = document.createElement('section');
    sectionContainer.className = 'container-layout-padding'

    sectionContainer.innerHTML = `
    <div class="w-full flex gap-8 items-end">
        <span class="text-2xl font-semibold w-fit text-black lg:text-5xl">${title}</span>
        <div class="bg-black h-[0.5px] flex-grow"></div>
    </div>
    <div class="flex flex-col lg:flex-row gap-12 justify-between py-14">
        ${!isFilterFocusArea && !isFilterDate && !isFilterCategory ? '' : `
        <div class="w-full lg:w-1/2">
            ${isFilterDate ? FilterByDate() : ''}
            ${isFilterCategory ? FilterByCategory() : ''}
            ${isFilterFocusArea ? FilterByFocusArea() : ''}
        </div>
        `}
        <div id="container-cards" class="${!isFilterFocusArea && !isFilterDate && !isFilterCategory ? 'w-full' : 'w-full lg:w-[90%]'}">
            ${resultData.length > 0 ? RenderCards(getFilteredData(resultData, isFilterFocusArea), cardStyle, itemsToShow) : ''}
        </div>
    </div> 
    `
    const allCheckbox = sectionContainer.querySelectorAll('input[type="checkbox"]')

    const checkboxEmergencies = sectionContainer.querySelector('#checkbox_emergencies')
    if (checkboxEmergencies) {
        checkboxEmergencies.addEventListener('change', (e) => {
            const dateFilter = sectionContainer.querySelector('#date-filter')?.value;
            if (e.target.checked) {
                currentPage = 1;
                allCheckbox.forEach(item => item.id !== 'checkbox_emergencies' ? item.disabled = true : '')
                const filteredData = getFilteredData(resultData, isFilterFocusArea, 'mscfoundation:categories/emergencies', dateFilter)
                sectionContainer.querySelector('#container-cards').innerHTML = RenderCards(filteredData, cardStyle, itemsToShow)
            } else {
                const filteredData = getFilteredData(resultData, isFilterFocusArea, '', dateFilter)
                sectionContainer.querySelector('#container-cards').innerHTML = RenderCards(filteredData, cardStyle, itemsToShow)
                allCheckbox.forEach(item => item.id !== 'checkbox_emergencies' ? item.disabled = false : '')
            }
        })
    }

    const checkboxConfig = {
        'events': 'mscfoundation:categories/events',
        'milestones': 'mscfoundation:categories/milestones',
        'programmes': 'mscfoundation:categories/programmes'
    };

    Object.entries(checkboxConfig).forEach(([type, category]) => {
        const checkbox = sectionContainer.querySelector(`#checkbox_${type}`);
        if (checkbox) {
            checkbox.addEventListener('change', (e) => {
                const dateFilter = sectionContainer.querySelector('#date-filter')?.value;
                if (e.target.checked) {
                    currentPage = 1;
                    allCheckbox.forEach(item => item.id !== `checkbox_${type}` ? item.disabled = true : '');
                    const filteredData = getFilteredData(resultData, isFilterFocusArea, category, dateFilter);
                    sectionContainer.querySelector('#container-cards').innerHTML = RenderCards(filteredData, cardStyle, itemsToShow);
                } else {
                    const filteredData = getFilteredData(resultData, isFilterFocusArea, '', dateFilter);
                    sectionContainer.querySelector('#container-cards').innerHTML = RenderCards(filteredData, cardStyle, itemsToShow);
                    allCheckbox.forEach(item => item.id !== `checkbox_${type}` ? item.disabled = false : '');
                }
            });
        }
    });


    const dateFilter = sectionContainer.querySelector('#date-filter')
    if (dateFilter) dateFilter.addEventListener('change', (e) => {
        currentPage = 1;
        const filteredData = getFilteredData(resultData, isFilterFocusArea, '', e.target.value)
        sectionContainer.querySelector('#container-cards').innerHTML = RenderCards(filteredData, cardStyle, itemsToShow)
    })

    window.handlePageChange = (direction, totalPages, pageNumber) => {
        if (direction === 'prev' && currentPage > 1) {
            currentPage--;
        } else if (direction === 'next' && currentPage < totalPages) {
            currentPage++;
        } else if (direction === 'page') {
            currentPage = pageNumber;
        }
        const dateFilter = document.querySelector('#date-filter')?.value || '';
        const categoryCheckbox = Array.from(document.querySelectorAll('input[type="checkbox"]')).find(cb => cb.checked);
        const categoryType = categoryCheckbox ? `mscfoundation:categories/${categoryCheckbox.id.replace('checkbox_', '')}` : '';
        const filteredData = getFilteredData(data.data, isFilterFocusArea, categoryType, dateFilter);
        document.querySelector('#container-cards').innerHTML = RenderCards(filteredData, cardStyle, itemsToShow);
    };


    block.textContent = ''
    block.append(sectionContainer)

}

const RenderCards = (data, cardStyle, perPage) => {
    const totalPages = Math.ceil(data.length / perPage)
    const startIndex = (currentPage - 1) * perPage
    const endIndex = startIndex + perPage
    const result = data.slice(startIndex, endIndex)

    return `
        <div class="flex flex-col sm:flex-row flex-wrap h-full gap-2 justify-center md:justify-between">
            ${result.length > 0 ? result.map(item => {
        const pageTypesObject = {
            focusAreas: extractTagsByType(item.pageType, 'mscfoundation:focus-area'),
            status: extractTagsByType(item.pageType, 'mscfoundation:status')
        };

        return `
                    <article-card 
                        variant="${cardStyle}"
                        subTitle="${item.description || ''}" 
                        title="${item.title || ''}" 
                        date="${item.published_time}"
                        topLabel="${pageTypesObject.status}"
                        icons="${pageTypesObject.focusAreas}"
                        backgroundImage="${item.thumbImg}"
                        href="${item.path || ''}"
                    >
                    </article-card>
                `
    }).join('') : `
                <div class="flex justify-center items-center w-full text-4xl h-full font-semibold">Nothing to show..</div>
            `}
            ${totalPages > 1 ? `
                <div class="flex justify-between sm:justify-center  md:justify-end gap-4 w-full mt-10">
                    <button class="border cursor-pointer flex items-center min-w-12 size-12 sm:min-w-16 sm:size-16 justify-center border-secondary disabled:opacity-50" 
                        ${currentPage === 1 ? 'disabled' : ''} 
                        onclick="handlePageChange('prev', ${totalPages})">
                        <ion-icon size="large" name="arrow-back-outline"></ion-icon>
                    </button>
                    <div class="flex gap-2">
                        ${(() => {
        let pages = [];
        const maxVisiblePages = 3;
        let start = Math.max(1, currentPage - 1);
        let end = Math.min(start + maxVisiblePages - 1, totalPages);

        if (end - start + 1 < maxVisiblePages) {
            start = Math.max(1, end - maxVisiblePages + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(`
                                    <button class="border cursor-pointer min-w-12 size-12 sm:min-w-16 sm:size-16 text-2xl flex items-center justify-center ${currentPage === i ? 'bg-secondary text-white' : 'border-secondary/40 text-gray-400'}"
                                        onclick="handlePageChange('page', ${totalPages}, ${i})">
                                        ${i}
                                    </button>
                                `);
        }
        return pages.join('');
    })()}
                    </div>
                    <button class="border cursor-pointer flex items-center min-w-12 size-12 sm:min-w-16 sm:size-16 justify-center border-secondary disabled:opacity-50" 
                        ${currentPage === totalPages ? 'disabled' : ''} 
                        onclick="handlePageChange('next', ${totalPages})">
                        <ion-icon size="large" name="arrow-forward-outline"></ion-icon>
                    </button>
                </div>
            ` : ''}
        </div>
    `
}


const FilterByDate = () => {
    return `
    <div class="flex w-full flex-col mt-10 gap-8">
        <h4 class="text-primary text-3xl font-semibold">Filter by date</h4>
        <div class="flex flex-col gap-4 p-4 rounded-xl shadow-md">
            <select id="date-filter" class="w-full p-2 cursor-pointer focus:outline-0 outline-0">
                <option value="all_dates">All dates</option>
                <option value="this_month">This month</option>
                <option value="last_three">Last three</option>
                <option value="last_siz">Last six</option>
            </select>
        </div>
    </div>
    `
}

const FilterByFocusArea = () => {
    return `
    <div class="flex w-full flex-col mt-10 gap-8">
        <h4 class="text-primary text-3xl font-semibold">Filter by focus area</h4>
        <div class="flex flex-col gap-4 p-6 rounded-xl shadow-md">
            <div class="flex gap-2 items-center">${returnFocusAreaIcon('mscfoundation:focus-area/environmental-conservation')}<p>Environmental Conservation</p></div>
            <div class="flex gap-2 items-center">${returnFocusAreaIcon('mscfoundation:focus-area/community-support')}<p>Community Support</p></div>
            <div class="flex gap-2 items-center">${returnFocusAreaIcon('mscfoundation:focus-area/education')}<p>Education</p></div>
            <div class="flex gap-2 items-center">${returnFocusAreaIcon('mscfoundation:focus-area/emergency-relief')}<p>Emergency Relief</p></div>
        </div>
    </div>
    `
}

const FilterByCategory = () => {
    return `
    <div class="flex w-full flex-col mt-10 gap-8">
        <h4 class="text-primary text-3xl font-semibold">Filter by categories</h4>
        <div class="flex flex-col gap-4 p-6 rounded-xl shadow-md">
            <div class="flex gap-2 items-center"><input id="checkbox_emergencies" type="checkbox"><p>Emergencies</p></div>
            <div class="flex gap-2 items-center"><input id="checkbox_events" type="checkbox"><p>Events</p></div>
            <div class="flex gap-2 items-center"><input id="checkbox_milestones" type="checkbox"><p>Milestones</p></div>
            <div class="flex gap-2 items-center"><input id="checkbox_programmes" type="checkbox"><p>Programmes</p></div>
        </div>
    </div>
    `
}

const DATE_FILTERS = {
    all_dates: () => true,
    this_month: (date) => {
        const currentDate = new Date();
        const itemDate = new Date(date);
        return itemDate.getMonth() === currentDate.getMonth() &&
            itemDate.getFullYear() === currentDate.getFullYear();
    },
    last_three: (date) => {
        const currentDate = new Date();
        const threeMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 3));
        return new Date(date) >= threeMonthsAgo;
    },
    last_siz: (date) => {
        const currentDate = new Date();
        const sixMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 6));
        return new Date(date) >= sixMonthsAgo;
    },
};

const getFilteredData = (data, isFocusArea, categoryType, dateFilter) => {
    const filters = []
    if (isFocusArea) filters.push('mscfoundation:focus-area')
    if (categoryType) filters.push(categoryType)

    const filteredData = data.filter(item => {
        let passDateFilter = true
        if (dateFilter) {
            passDateFilter = DATE_FILTERS[dateFilter](item.published_time)
        }

        const extractedTags = extractTagsByType(item.pageType, filters)
        let passTypeFilter = true

        if (categoryType) {
            passTypeFilter = extractedTags.map(item => item.toLowerCase()).includes(categoryType)
        } else if (isFocusArea) {
            passTypeFilter = extractedTags.some(tag => tag.includes('mscfoundation:focus-area'))
        }

        return passTypeFilter && passDateFilter
    })

    if (!isFocusArea && !categoryType && !dateFilter) {
        return data
    }

    return filteredData
}
