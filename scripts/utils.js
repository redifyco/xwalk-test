export const isEditorMode = () => {
    // Verifica sessionStorage per chiavi che iniziano con "aue"
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith('aue')) {
            return true;
        }
    }
    return false;
};

/*Boolean conversion*/
export const returnBoolean = (block, childNode) => {
    return block.querySelector(`:scope > div:nth-child(${childNode}) div p`)?.textContent === 'true'
}


export function classNames(classes) {
    return Object.entries(classes)
        .filter(([_, value]) => Boolean(value))
        .map(([key]) => key)
        .join(' ');
}

export function handleScrollClasses(node, threshold, cssClasses, removeOnScroll = true) {
    const classes = Array.isArray(cssClasses) ? cssClasses : [cssClasses];

    window.addEventListener('scroll', () => {
        if (window.scrollY > threshold) {
            node.classList.add(...classes);
        } else if (removeOnScroll) {
            node.classList.remove(...classes);
        }
    });
}


export function getJsonFromHtml(htmlList) {
    const result = [];

    if (!htmlList || !(htmlList instanceof HTMLElement)) {
        console.warn('Invalid HTML list provided.');
        return result;
    }

    try {
        htmlList.querySelectorAll(':scope > li').forEach((item) => {
            const title = item.querySelector('p')?.textContent.trim() || 'Untitled';
            const subItems = [];

            item.querySelectorAll('ul > li > a').forEach((link) => {
                subItems.push({
                    href: link.getAttribute('href') || '#',
                    title: link.getAttribute('title') || 'No title',
                });
            });

            result.push({
                title,
                subItems,
            });
        });
    } catch (error) {
        console.error('Error parsing HTML list:', error);
    }

    return result;
}

/*Cards With Images*/
export function processDivsToObjectCardsWithImages(divs) {
    const result = [];

    // Process the divs in groups of 3
    for (let i = 0; i < divs.length; i += 5) {
        const imageDiv = divs[i]
        const titleDiv = divs[i + 1]
        const descriptionDiv = divs[i + 2]
        const iconDiv = divs[i + 3]
        const styleDiv = divs[i + 4]

        const image = imageDiv?.querySelector('img')?.getAttribute('src') || '';
        const title = titleDiv.querySelector('div p')?.textContent || 'Untitled';
        const description = descriptionDiv.querySelector('div p')?.textContent || 'No description';
        const icon = iconDiv?.querySelector('img')?.getAttribute('src') || '';
        const style = styleDiv.querySelector('div p')?.textContent || null;

        result.push({
            image,
            title,
            description,
            icon,
            style
        });
    }

    return result;
}

/*Statistics data*/
export function processDivsToObjectStatisticsData(divs) {
    const result = [];

    for (let i = 0; i < divs.length; i += 2) {
        const valueDiv = divs[i]
        const labelDiv = divs[i + 1]

        const value = valueDiv.querySelector('div p')?.textContent || '0'
        const label = labelDiv.querySelector('div p')?.textContent || 'No label'

        result.push({
            value,
            label
        });
    }

    return result;
}

/*Carousel data*/
export function processDivsToObjectCarousel(divs) {
    const result = [];

    divs.forEach((parentDiv) => {
        const childDivs = parentDiv.querySelectorAll(':scope > div');

        const image = childDivs[0]?.querySelector('img')?.getAttribute('src') || '';
        const title = childDivs[1]?.querySelector('p')?.textContent.trim() || 'Untitled';
        const description = childDivs[2]?.querySelector('p')?.textContent.trim() || 'No description';
        const buttonText = childDivs[3]?.querySelector('p')?.textContent.trim() || 'No button text';
        const buttonLink = childDivs[4]?.querySelector('a')?.getAttribute('href') || '#';

        result.push({
            image,
            title,
            description,
            buttonText,
            buttonLink,
        });
    });

    return result;
}

/*Tab Section data*/
export function processDivsToObjectTabSection(divs) {
    const result = [];

    divs.forEach((parentDiv) => {
        const childDivs = parentDiv.querySelectorAll(':scope > div');

        const tabTitle = childDivs[0]?.querySelector('p')?.textContent.trim() || 'Untitled';
        const mainTitle = childDivs[1]?.querySelector('p')?.textContent.trim() || 'Untitled';
        const description = childDivs[2]?.innerHTML || 'No description';
        const buttonText = childDivs[3]?.querySelector('p')?.textContent.trim() || 'No button text';
        const buttonLink = childDivs[4]?.querySelector('a')?.getAttribute('href') || '#';

        result.push({
            tabTitle,
            mainTitle,
            description,
            buttonText,
            buttonLink,
        });
    });

    return result;
}

/*Tab Section INFO data*/
export function processDivsToObjectTabSectionInfo(divs) {
    const result = [];

    for (let i = 0; i < divs.length; i += 2) {

        const title = divs[i].querySelector('div p')?.textContent || '0'
        const description = divs[i + 1].querySelector('div p')?.textContent || 'No label'

        result.push({
            title,
            description
        });
    }

    return result;
}

/*Map Section Pins data*/
export function processDivsToObjectMapPins(divs) {
    const result = [];

    divs.forEach((parentDiv) => {
        const childDivs = parentDiv.querySelectorAll(':scope > div');

        const latitude = childDivs[0]?.querySelector('p')?.textContent.trim() || 'Untitled';
        const longitude = childDivs[1]?.querySelector('p')?.textContent.trim() || 'Untitled';
        const title = childDivs[2]?.querySelector('p')?.textContent.trim() || 'Untitled';
        const description = childDivs[3]?.querySelector('p')?.textContent.trim() || 'Untitled';
        const linkText = childDivs[4]?.querySelector('p')?.textContent.trim() || 'No link text';
        const linkURL = childDivs[5]?.querySelector('a')?.href || 'No link url';
        const label1 = childDivs[6]?.querySelector('img')?.src || '';
        const label2 = childDivs[7]?.querySelector('img')?.src || '';
        const label3 = childDivs[8]?.querySelector('img')?.src || '';

        result.push({
            latitude,
            longitude,
            title,
            description,
            linkText,
            linkURL,
            label1,
            label2,
            label3
        });
    });

    return result;
}

/*Contacts Info items data*/
export function processDivsToObjectContactsItems(divs) {
    const result = [];

    divs.forEach((parentDiv) => {
        const childDivs = parentDiv.querySelectorAll(':scope > div');

        const image = childDivs[0]?.querySelector('img')?.src || '';
        const label = childDivs[1]?.querySelector('p')?.textContent.trim() || 'Untitled';
        const link = childDivs[2]?.querySelector('a')?.href || '';

        result.push({
            image,
            label,
            link
        });
    });

    return result;
}


export function buildHeight(mobileHeight, desktopHeight) {

    return classNames({
        ['h-[200px]']: mobileHeight === '200',
        ['h-[400px]']: mobileHeight === '400',
        ['h-[600px]']: mobileHeight === '600',
        ['h-[800px]']: mobileHeight === '800',
        ['h-[1000px]']: mobileHeight === '1000',
        ['h-[1200px]']: mobileHeight === '1200',
        ['h-[1400px]']: mobileHeight === '1400',
        ['h-[1600px]']: mobileHeight === '1600',
        ['h-[1800px]']: mobileHeight === '1800',
        ['h-[2000px]']: mobileHeight === '2000',
        ['lg:h-[600px]']: desktopHeight === '600',
        ['lg:h-[800px]']: desktopHeight === '800',
        ['lg:h-[1000px]']: desktopHeight === '1000',
        ['lg:h-[1200px]']: desktopHeight === '1200',
        ['lg:h-[1400px]']: desktopHeight === '1400',
        ['lg:h-[1600px]']: desktopHeight === '1600',
        ['lg:h-[1800px]']: desktopHeight === '1800',
        ['lg:h-[2000px]']: desktopHeight === '2000',
        ['lg:h-[2200px]']: desktopHeight === '2200',
        ['lg:h-[2400px]']: desktopHeight === '2400',
    });
}

/**
 * Carica uno script esterno dinamicamente
 * @param {string} url URL dello script da caricare
 * @returns {Promise} Promise che si risolve quando lo script è caricato
 */
export function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}


/**
 * Carica le Google Maps API
 * @param {string} apiKey Chiave API di Google Maps
 * @returns {Promise} Promise che si risolve quando le API sono caricate
 */
export async function loadGoogleMaps(apiKey) {
    if (!window.google || !window.google.maps) {
        await loadScript(`https://maps.googleapis.com/maps/api/js?key=${apiKey}`);
    }
    return Promise.resolve();
}
