export default function decorate(block) {
    const title = block.querySelector(':scope > div:nth-child(1) div')?.innerHTML || '';
    const accordionItems = block.querySelectorAll(':scope > div:nth-child(n+2) div');
    const aemEnv = block.getAttribute('data-aue-resource');
    const resultData = processDivsToObject(accordionItems, aemEnv);

    let degree = 0;
    const sectionContainer = document.createElement('section');
    sectionContainer.className = 'container-layout-padding';

    // Funzione per sanitizzare il testo semplice (non HTML)
    function sanitizeText(text) {
        if (!text || typeof text !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Funzione per sanitizzare HTML dal CMS (più permissiva per rich text)
    function sanitizeRichText(html) {
        if (!html || typeof html !== 'string') return '';
        
        // Crea un elemento temporaneo per processare l'HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // Rimuovi script e altri elementi potenzialmente pericolosi
        const dangerousElements = tempDiv.querySelectorAll('script, object, embed, iframe, form, input, button');
        dangerousElements.forEach(el => el.remove());
        
        // Rimuovi attributi pericolosi
        const allElements = tempDiv.querySelectorAll('*');
        allElements.forEach(el => {
            // Rimuovi attributi che iniziano con "on" (onclick, onload, etc.)
            Array.from(el.attributes).forEach(attr => {
                if (attr.name.toLowerCase().startsWith('on') || 
                    attr.name.toLowerCase() === 'javascript:' ||
                    attr.value.toLowerCase().includes('javascript:')) {
                    el.removeAttribute(attr.name);
                }
            });
        });
        
        return tempDiv.innerHTML;
    }

    // Funzione per creare gli elementi accordion in modo sicuro
    function createAccordionItems(data) {
        const accordionContainer = document.createElement('div');
        accordionContainer.className = 'space-y-0.5 lg:space-y-2 w-full lg:w-3/4';

        data.forEach((item, index) => {
            // Controlla se l'item ha contenuto valido
            if (!item.title && !item.description) {
                return; // Salta questo elemento se non ha contenuto
            }

            const accordionItem = document.createElement('div');
            accordionItem.className = 'w-full';

            // Crea button
            const button = document.createElement('button');
            button.id = 'accordion-button';
            button.className = 'cursor-pointer w-full py-1 lg:py-3 text-left font-medium flex justify-between items-center';
            button.setAttribute('data-index', index);

            const titleSpan = document.createElement('span');
            titleSpan.className = 'text-xl lg:text-4xl text-primary';
            titleSpan.textContent = item.title || 'No Title';

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'w-6 text-primary h-8 transform transition-transform duration-200');
            svg.setAttribute('fill', 'none');
            svg.setAttribute('stroke', 'currentColor');
            svg.setAttribute('viewBox', '0 0 24 24');

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('stroke-linejoin', 'round');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('d', 'M19 9l-7 7-7-7');

            svg.appendChild(path);
            button.appendChild(titleSpan);
            button.appendChild(svg);

            // Crea content
            const content = document.createElement('div');
            content.className = 'accordion-content overflow-hidden max-h-0 transition-all duration-200 ease-out';

            if (item.description) {
                const description = document.createElement('p');
                description.className = 'font-light py-1 lg:py-3';
                description.textContent = item.description;
                content.appendChild(description);
            }

            accordionItem.appendChild(button);
            accordionItem.appendChild(content);
            accordionContainer.appendChild(accordionItem);
        });

        return accordionContainer;
    }

    // Funzione per creare il carousel 3D
    function createCarousel(data) {
        const carousel = document.createElement('div');
        carousel.id = '3d-carousel';
        carousel.className = 'relative w-full h-[300px] lg:h-[500px] flex items-center justify-center lg:-translate-y-96 perspective-[1000px]';

        const containerRotate = document.createElement('div');
        containerRotate.id = 'container-rotate';
        containerRotate.className = 'absolute transition-all duration-1000 transform-3d w-[180px] lg:translate-y-96 h-[200px] lg:w-[200px] lg:h-[300px]';

        data.forEach((item, index) => {
            // Salta se non ha immagine né icona
            if (!item.image && !item.icon) {
                return;
            }

            const itemContainer = document.createElement('div');
            itemContainer.id = 'item-container';
            
            const buildTransform = (() => {
                switch (index % 4) {
                    case 0:
                        return 'translate-z-[100px] lg:translate-z-[180px]';
                    case 1:
                        return 'translate-x-[100px] lg:translate-x-[180px]';
                    case 2:
                        return '-translate-z-[100px] lg:-translate-z-[180px]';
                    case 3:
                        return '-translate-x-[100px] lg:-translate-x-[180px]';
                    default:
                        return '';
                }
            })();

            itemContainer.className = `absolute shadow flex items-center justify-center transition-all duration-1000 ${buildTransform} w-[180px] h-[200px] lg:w-[200px] lg:h-[300px] ${item.image ? '' : 'bg-gray-300'}`;

            // Aggiungi immagine se presente
            if (item.image) {
                const img = document.createElement('img');
                img.alt = 'image';
                img.className = 'w-full h-full object-cover object-center';
                img.src = item.image;
                img.onerror = function() {
                    this.style.display = 'none';
                    itemContainer.classList.add('bg-gray-300');
                };
                itemContainer.appendChild(img);
            }

            // Aggiungi icona se presente
            if (item.icon) {
                const icon = document.createElement('img');
                icon.alt = 'icon';
                icon.className = 'absolute object-contain h-20 justify-center w-20';
                icon.src = item.icon;
                icon.onerror = function() {
                    this.style.display = 'none';
                };
                itemContainer.appendChild(icon);
            }

            // Overlay
            const overlay = document.createElement('div');
            overlay.id = 'overlay-image';
            overlay.className = 'h-full w-full absolute inset-0 bg-white/40 transition-opacity duration-300';

            itemContainer.appendChild(overlay);
            containerRotate.appendChild(itemContainer);
        });

        carousel.appendChild(containerRotate);
        return carousel;
    }

    // Costruisci la struttura principale
    const titleDiv = document.createElement('div');
    titleDiv.className = 'text-primary lg:text-start text-center prose-em:lg:text-9xl prose-em:font-joyful text-3xl lg:text-7xl mb-8';
    
    // Gestione speciale per il titolo rich text del CMS
    if (title) {
        const sanitizedTitle = sanitizeRichText(title);
        if (sanitizedTitle.trim()) {
            titleDiv.innerHTML = sanitizedTitle;
        }
    }

    const mainContainer = document.createElement('div');
    mainContainer.className = 'flex flex-col lg:flex-row justify-between gap-4 w-full items-center';

    // Aggiungi solo se ci sono dati validi
    if (resultData.length > 0) {
        const validItems = resultData.filter(item => item.title || item.description);
        if (validItems.length > 0) {
            const accordionContainer = createAccordionItems(validItems);
            mainContainer.appendChild(accordionContainer);
        }

        const validCarouselItems = resultData.filter(item => item.image || item.icon);
        if (validCarouselItems.length > 0) {
            const carousel = createCarousel(validCarouselItems);
            mainContainer.appendChild(carousel);
        }
    }

    // Aggiungi il titolo solo se ha contenuto dopo la sanitizzazione
    if (title && sanitizeRichText(title).trim()) {
        sectionContainer.appendChild(titleDiv);
    }
    
    if (mainContainer.children.length > 0) {
        sectionContainer.appendChild(mainContainer);
    }

    // Resto del codice per gli event listeners...
    function closeAccordionContent(content) {
        content.style.maxHeight = null;
        const allOverlays = document.querySelectorAll('#overlay-image');
        allOverlays.forEach(overlay => {
            overlay.classList.remove('opacity-0');
            overlay.classList.add('opacity-100', 'transition-opacity', 'duration-300');
        });
    }

    function resetAccordionButton(button) {
        button.classList.remove('active');
        button.querySelector('svg').classList.remove('rotate-180');
    }

    const accordionButtons = sectionContainer.querySelectorAll('#accordion-button');
    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            const icon = button.querySelector('svg');
            const index = parseInt(button.dataset.index);

            accordionButtons.forEach(otherButton => {
                if (otherButton !== button) {
                    const otherContent = otherButton.nextElementSibling;
                    closeAccordionContent(otherContent);
                    resetAccordionButton(otherButton);
                }
            });

            button.classList.toggle('active');
            icon.classList.toggle('rotate-180');

            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }

            const containerRotate = sectionContainer.querySelector('#container-rotate');
            const itemContainer = sectionContainer.querySelectorAll('#item-container');
            degree = index * 90;
            containerRotate.style.transform = `rotateY(-${degree}deg)`;
            itemContainer.forEach((item, idx) => {
                item.style.transform = `rotateY(${degree}deg)`;
                const overlay = item.querySelector('#overlay-image');
                if (idx === index && button.classList.contains('active')) {
                    overlay.classList.remove('opacity-100');
                    overlay.classList.add('opacity-0', 'transition-opacity', 'duration-300');
                } else {
                    overlay.classList.remove('opacity-0');
                    overlay.classList.add('opacity-100', 'transition-opacity', 'duration-300');
                }
            });
        });
    });

    const firstOverlay = sectionContainer.querySelector('#overlay-image');
    if (firstOverlay) {
        firstOverlay.classList.remove('opacity-100');
        firstOverlay.classList.add('opacity-0');
    }

    block.textContent = '';
    block.append(sectionContainer);
}

function processDivsToObject(divs, aemEnv) {
    const result = [];

    for (let i = 0; i < divs.length; i += aemEnv ? 5 : 4) {
        const imageDiv = divs[i];
        const iconDiv = divs[i + 1];
        const titleDiv = divs[i + 2];
        const descriptionDiv = divs[i + 3];

        // Validazione e sanitizzazione dei dati
        const image = imageDiv?.querySelector('img')?.getAttribute('src')?.trim() || '';
        const icon = iconDiv?.querySelector('img')?.getAttribute('src')?.trim() || '';
        const title = titleDiv?.textContent?.trim() || '';
        const description = descriptionDiv?.textContent?.trim() || '';

        // Aggiungi solo se almeno uno dei campi ha contenuto
        if (image || icon || title || description) {
            result.push({
                image,
                icon,
                title,
                description,
            });
        }
    }

    return result;
}
