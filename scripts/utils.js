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
        const title = divs[i].querySelector('div p')?.textContent || '';
        let description = divs[i + 1].querySelector('div p')?.textContent || '';

        // Aggiungi al risultato solo se entrambi i valori sono presenti
        if (title && description) {
            // Se la description inizia con "mscfoundation:"
            if (description.startsWith('mscfoundation:')) {
                // Prendi l'ultima parte dopo l'ultimo "/"
                const lastPart = description.split('/').pop();
                // Sostituisci i "-" con spazi
                description = lastPart.replace(/-/g, ' ');
            }

            // Trasforma la prima lettera della description in maiuscolo
            if (description.length > 0) {
                description = description.charAt(0).toUpperCase() + description.slice(1);
            }

            // Esegui il push solo se entrambi title e description sono valorizzati
            result.push({
                title,
                description
            });
        }
        // Se title o description sono vuoti, questa coppia viene saltata
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
        ['lg:h-[200px]']: desktopHeight === '200',
        ['lg:h-[400px]']: desktopHeight === '400',
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
        // If the script is already in the page, resolve immediately
        if (document.querySelector(`script[src="${url}"]`)) {
            return resolve();
        }
        const s = document.createElement("script");
        s.src = url;
        s.async = true;
        s.defer = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error(`Script failed to load: ${url}`));
        document.head.appendChild(s);
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

export function createLead(data, onSuccess, onFailure) {
    fetch('/createlead', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({...data})
    })
        .then(response => {
            if (response.ok) {
                onSuccess('Lead successfully created');
            } else {
                onFailure('Failed to create lead');
            }
        })
        .catch(error => {
            onFailure(error.message);
        });
}

export function createCase(data, onSuccess, onFailure) {
    fetch('/createcase', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                onSuccess('Lead successfully created');
            } else {
                onFailure('Failed to create lead');
            }
        })
        .catch(error => {
            onFailure(error.message);
        });
}


/*Fetch Blog Preview Data */
export async function getAllArticles(api) {

    return await fetch(`${api.toString()}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .catch(error => console.error('Error fetching articles:', error));
}

/*Fetch Focus Area from Taxonomy Page */
export async function getFocusAreaFromTaxonomy(api) {

    return await fetch(`${api.toString()}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .catch(error => console.error('Error fetching articles:', error));
}

/*Fetch Blog Preview Data */
export async function getBlogPreviewData(api, itemToShow = 3) {
    const queryParams = new URLSearchParams({
        limit: itemToShow.toString(),
    });


    return await fetch(`${api.toString()}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET'
        },
        mode: 'cors',
        credentials: 'include'
    })
        .then(response => response.json())
        .catch(error => console.error('Error fetching articles:', error));
}


export const returnFocusAreaIcon = (focusArea) => {
    const logoObj = {
        "mscfoundation:focus-area/environmental-conservation": `
<svg width="31" height="37" viewBox="0 0 31 37" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="30.575" height="36.5075" fill="url(#pattern0_2029_1334)"/>
<defs>
<pattern id="pattern0_2029_1334" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_2029_1334" transform="scale(0.00746269 0.00625)"/>
</pattern>
<image id="image0_2029_1334" width="134" height="160" preserveAspectRatio="none" xlink:href="data:image/png;base64,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"/>
</defs>
</svg>
`,
        "mscfoundation:focus-area/community-support": `
            <svg width="31" height="37" viewBox="0 0 53 47" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <rect x="0.168945" width="52" height="47" fill="url(#pattern0_405_10733)"/>
            <defs>
            <pattern id="pattern0_405_10733" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlink:href="#image0_405_10733" transform="matrix(0.00447449 0 0 0.0049505 -0.00561691 0)"/>
            </pattern>
    <image id="image0_405_10733" width="226" height="202" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOIAAADKCAYAAAC475yMAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGPGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDIgNzkuYTZhNjM5NjhhLCAyMDI0LzAzLzA2LTExOjUyOjA1ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjUuMTIgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAxLTEzVDE1OjM4OjI3KzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMi0xNFQxOToxMTo1MiswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMi0xNFQxOToxMTo1MiswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTIxMDljN2YtZmU2Zi00NzA5LTg1ODktYTU4M2FiNzc1Yjg4IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6Mjg2NDVlMjAtMjZkYy03ZTRkLWJiMmQtZTYxMDBhM2Q2MTkzIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZTZkMDdjZjMtYjRkMC00YzQxLThkOTMtMzYxMzE0MjU3YzQ4Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDplNmQwN2NmMy1iNGQwLTRjNDEtOGQ5My0zNjEzMTQyNTdjNDgiIHN0RXZ0OndoZW49IjIwMjUtMDEtMTNUMTU6Mzg6MjcrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyNS4xMiAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1MjEwOWM3Zi1mZTZmLTQ3MDktODU4OS1hNTgzYWI3NzViODgiIHN0RXZ0OndoZW49IjIwMjUtMDItMTRUMTk6MTE6NTIrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyNS4xMiAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7WxEYeAAA7OklEQVR4nO2debgsRXn/P9Uz55x7QQFR3EGMUaNGjCu4k5u46zVGjEaNGs1irgvGoEL8aRL1MYAaNwJE4xKNO8YQiRo0Cq5BE8QgEreIG2oERFyuLGfq98dbb9Xbdbp7erZzZs7093nmmZnu6uqanv72u9ZbjtefxhJgP+C2wC8Dh4bXTYED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"/>
</defs>
</svg>
            `,
        "mscfoundation:focus-area/education": `
<svg width="31" height="37" viewBox="0 0 53 47" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M51.445 5.40283C51.445 5.40283 51.335 5.40283 51.313 5.40283L44.6267 6.98643V1.59779C44.6267 1.42183 44.5607 1.24588 44.4508 1.11391C44.3408 0.981946 44.1648 0.915963 44.0109 0.915963H43.9889C43.9889 0.915963 43.7689 0.937957 43.681 0.981946L26.0634 10.5275H26.0194L8.42387 0.981946C8.2919 0.915963 8.15994 0.893968 8.00598 0.915963C7.69805 0.981946 7.45611 1.24588 7.47811 1.5538V6.96443H7.39013L0.769805 5.40283C0.747811 5.40283 0.703822 5.40283 0.659833 5.40283C0.637839 5.40283 0.59385 5.40283 0.571855 5.40283C0.241939 5.46881 0 5.73275 0 6.06266V40.396C0 40.7039 0.19795 40.9458 0.505872 41.0118L25.9094 46.9943C25.9094 46.9943 26.1074 47.0163 26.1954 46.9943L51.5989 41.0118C51.9069 40.9458 52.1048 40.6819 52.1048 40.374V6.06266C52.1048 5.71075 51.8189 5.40283 51.467 5.38083M8.77578 2.65352L8.88575 2.71951L23.864 10.8355L8.77578 7.29435V2.65352ZM25.4036 45.5207H25.3156L1.29767 39.8681V6.85446H1.38565L25.4036 12.529V45.4987V45.5207ZM43.329 2.65352V7.29435H43.2631L28.2189 10.8355L43.307 2.65352H43.329ZM50.8072 39.8681H50.7412L26.7012 45.5207V12.529H26.7672L50.8072 6.85446V39.8461V39.8681Z" fill="#009BAC"/>
</svg>
`,
        "mscfoundation:focus-area/emergency-relief": `
<svg width="31" height="37" viewBox="0 0 53 46" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="mask0_405_10734" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="53" height="46">
<path d="M52.0869 0H0V45.8364H52.0869V0Z" fill="white"/>
</mask>
<g mask="url(#mask0_405_10734)">
<path d="M45.6123 44.6515H6.42725V41.1446C6.42725 39.1195 8.05796 37.4402 10.0244 37.4402H42.0151C43.9816 37.4402 45.6123 39.1195 45.6123 41.1446V44.6515ZM6.52317 44.5527H45.5643V41.1446C45.5643 39.1689 43.9816 37.539 42.0631 37.539H10.0244C8.10592 37.539 6.52317 39.1689 6.52317 41.1446V44.5527Z" fill="#009BAC"/>
<path d="M42.687 36.3037H42.591V27.1167C42.591 17.732 35.1569 10.0762 26.0441 10.0762C16.9313 10.0762 9.49717 17.732 9.49717 27.1167V36.3037H9.40124C7.0511 36.6495 5.32446 38.7239 5.32446 41.1442V45.2438C5.32446 45.2438 5.37242 45.5401 5.51631 45.6883C5.6602 45.8365 5.75612 45.8859 5.94797 45.8859H46.2362C46.5719 45.8859 46.8117 45.5895 46.8117 45.2932V41.1936C46.8117 38.7733 45.0371 36.6988 42.7349 36.3531M10.6962 27.1661C10.6962 22.9183 12.279 18.9669 15.2047 15.9539C18.1304 12.9409 21.9673 11.311 26.0921 11.311C34.5814 11.311 41.4399 18.4235 41.4399 27.1167V36.2543H10.6483V27.1167L10.6962 27.1661ZM45.6127 44.6511H6.47555V41.1936C6.47555 39.1685 8.0583 37.5385 10.0248 37.5385H42.0155C43.9819 37.5385 45.5647 39.1685 45.5647 41.1936V44.6511H45.6127Z" fill="#009BAC"/>
<path d="M24.0775 15.2129C19.0415 15.2129 14.9167 19.4607 14.9167 24.6469C14.9167 24.9926 15.2045 25.2396 15.4923 25.2396C15.7801 25.2396 16.0678 24.9433 16.0678 24.6469C16.0678 20.1522 19.617 16.4477 24.0296 16.4477C24.3653 16.4477 24.6051 16.1514 24.6051 15.855C24.6051 15.5586 24.3173 15.2623 24.0296 15.2623" fill="#009BAC"/>
<path d="M4.26925 23.7583L0.672092 23.3137H0.62413C0.336357 23.3137 0.048584 23.5607 0.048584 23.857C0.048584 24.0052 0.048584 24.1534 0.19247 24.3016C0.288395 24.4498 0.432281 24.4991 0.576167 24.5485L4.17333 24.9931C4.17333 24.9931 4.55702 24.9931 4.65295 24.8449C4.74887 24.7461 4.8448 24.5485 4.8448 24.4004C4.8448 24.104 4.60499 23.8076 4.31721 23.8076" fill="#009BAC"/>
<path d="M7.53048 14.7197C7.53048 14.7197 7.7703 14.8185 7.86622 14.8185C8.20195 14.8185 8.44176 14.5222 8.44176 14.2258C8.44176 14.0282 8.34584 13.8307 8.15399 13.7319L5.18034 11.6574C5.18034 11.6574 4.94053 11.5586 4.84461 11.5586C4.65276 11.5586 4.46091 11.6574 4.36498 11.8056C4.26906 11.9537 4.2211 12.1019 4.26906 12.2501C4.26906 12.3983 4.36498 12.5464 4.50887 12.6452L7.48252 14.7691L7.53048 14.7197Z" fill="#009BAC"/>
<path d="M15.157 7.2608C15.157 7.2608 15.4448 7.60655 15.6846 7.60655C15.7805 7.60655 15.8765 7.60655 15.9724 7.50777C16.1163 7.45837 16.2122 7.3102 16.2602 7.16202C16.2602 7.01384 16.2602 6.81627 16.2602 6.71748L14.5815 3.40817C14.5815 3.40817 14.3896 3.16121 14.2457 3.11182C14.1978 3.11182 14.1498 3.11182 14.0539 3.11182C13.958 3.11182 13.862 3.11182 13.7661 3.2106C13.4783 3.35878 13.3824 3.75392 13.5263 4.05028L15.205 7.35959L15.157 7.2608Z" fill="#009BAC"/>
<path d="M26.0441 4.93944C26.3798 4.93944 26.6196 4.64308 26.6196 4.34673V0.642273C26.6196 0.296524 26.3798 0.0495605 26.0441 0.0495605C25.7083 0.0495605 25.4685 0.345917 25.4685 0.642273V4.34673C25.4685 4.69248 25.7563 4.93944 26.0441 4.93944Z" fill="#009BAC"/>
<path d="M36.0677 7.55744C36.0677 7.55744 36.2596 7.65623 36.3555 7.65623C36.5953 7.65623 36.7872 7.50805 36.8831 7.31048L38.5618 4.00117C38.5618 4.00117 38.6577 3.70481 38.5618 3.50724C38.5618 3.35906 38.4179 3.21088 38.274 3.16149C38.1301 3.06271 37.9862 3.06271 37.7944 3.16149C37.6505 3.16149 37.5066 3.30967 37.4586 3.45785L35.78 6.76716C35.6361 7.06352 35.732 7.45866 36.0198 7.60684" fill="#009BAC"/>
<path d="M44.0779 14.8185C44.0779 14.8185 44.4136 14.8185 44.5095 14.7197L47.4832 12.6452C47.4832 12.6452 47.723 12.3983 47.723 12.2501C47.723 12.1019 47.723 11.9043 47.6271 11.8056C47.5312 11.6574 47.3873 11.5586 47.2434 11.5586C47.0995 11.5586 46.9556 11.5586 46.8117 11.608H46.7638L43.7901 13.6825C43.7901 13.6825 43.5503 13.9294 43.5503 14.0776C43.5503 14.2258 43.5503 14.4234 43.6462 14.5222C43.7421 14.6703 43.886 14.7691 44.0299 14.7691" fill="#009BAC"/>
<path d="M51.4638 23.3137C51.4638 23.3137 51.4159 23.3137 51.3679 23.3137L47.7708 23.7583C47.435 23.7583 47.1952 24.104 47.2432 24.4498C47.2432 24.7461 47.5309 24.9931 47.8187 24.9931C47.8187 24.9931 47.8187 24.9931 47.8667 24.9931L51.4638 24.5485C51.4638 24.5485 51.7516 24.4498 51.8475 24.3016C51.9435 24.1534 51.9914 24.0052 51.9914 23.857C51.9914 23.5607 51.7036 23.3137 51.4159 23.3137" fill="#009BAC"/>
</g>
</svg>
`

    }

    return logoObj[focusArea]

}


export const returnStatusLabel = (status) => {
    const statusObj = {
        "mscfoundation:status/ongoing": "ONGOING",
        "mscfoundation:status/complete": "COMPLETE"
    }

    return statusObj[status]
}

/*Util Function to extract Tags by type*/
export const extractTagsByType = (pageType, type) => {
    return pageType.split(',')
        .map(item => item.trim())
        .filter(item => {
            if (Array.isArray(type)) {
                return type.some(t => item.toLowerCase().includes(t));
            }
            return item.toLowerCase().includes(type);
        })
};

/*EMAIL VALIDATOR*/
export const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};


