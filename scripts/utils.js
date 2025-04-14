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

