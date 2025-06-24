import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Valori di default
  const DEFAULT_VALUES = {
    image: {
      src: '/content/dam/mscfoundation/hero-images/placeholder-hero.jpg', // Sostituisci con il percorso della tua immagine placeholder
      alt: 'Image not available',
      width: '750',
      hideOnMissing: false // true per nascondere, false per mostrare placeholder
    },
    text: {
      fallback: 'Content non available',
      minLength: 1 // Lunghezza minima per considerare valido un testo
    },
    card: {
      preserveEmptyCards: false // true per mantenere card vuote
    }
  };

  // Funzioni helper per validazione e sanitizzazione
  const isValidUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    return trimmed !== '' && !trimmed.startsWith('data:') && trimmed !== '#';
  };

  const sanitizeText = (text, defaultValue = DEFAULT_VALUES.text.fallback) => {
    if (!text || typeof text !== 'string') return defaultValue;
    const cleaned = text.trim();
    return cleaned.length >= DEFAULT_VALUES.text.minLength ? cleaned : defaultValue;
  };

  const validateImageElement = (img) => {
    if (!img) return null;
    
    const src = img.src?.trim() || img.getAttribute('src')?.trim();
    const alt = img.alt?.trim() || img.getAttribute('alt')?.trim();
    
    return {
      src: isValidUrl(src) ? src : null,
      alt: sanitizeText(alt, DEFAULT_VALUES.image.alt)
    };
  };

  const createPlaceholderImage = () => {
    const img = document.createElement('img');
    img.src = DEFAULT_VALUES.image.src;
    img.alt = DEFAULT_VALUES.image.alt;
    img.setAttribute('loading', 'lazy');
    return img;
  };

  const handleMissingImage = (container) => {
    if (DEFAULT_VALUES.image.hideOnMissing) {
      container.style.display = 'none';
      container.setAttribute('aria-hidden', 'true');
      return null;
    } else {
      return createPlaceholderImage();
    }
  };

  const processTextContent = (div) => {
    if (!div) return;

    // Gestisce elementi di testo come h1-h6, p, span, etc.
    const textElements = div.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div');
    
    textElements.forEach(element => {
      const originalText = element.textContent?.trim();
      if (!originalText || originalText.length < DEFAULT_VALUES.text.minLength) {
        element.textContent = DEFAULT_VALUES.text.fallback;
        element.setAttribute('data-fallback', 'true');
      }
    });

    // Se non ci sono elementi di testo e il div è vuoto, aggiungi contenuto di default
    if (!textElements.length && (!div.textContent?.trim() || div.textContent.trim().length < DEFAULT_VALUES.text.minLength)) {
      const p = document.createElement('p');
      p.textContent = DEFAULT_VALUES.text.fallback;
      p.setAttribute('data-fallback', 'true');
      div.appendChild(p);
    }
  };

  const isCardEmpty = (li) => {
    const imageDiv = li.querySelector('.cards-card-image');
    const bodyDiv = li.querySelector('.cards-card-body');
    
    const hasValidImage = imageDiv && !imageDiv.hasAttribute('aria-hidden');
    const hasValidText = bodyDiv && !bodyDiv.querySelector('[data-fallback="true"]');
    
    return !hasValidImage && !hasValidText;
  };

  // Verifica che il blocco abbia contenuto
  if (!block || !block.children || block.children.length === 0) {
    console.warn('Cards block: Nessun contenuto trovato');
    return;
  }

  /* change to ul, li */
  const ul = document.createElement('ul');
  ul.className = 'cards-list'; // Aggiungi classe per styling
  
  try {
    [...block.children].forEach((row, index) => {
      try {
        const li = document.createElement('li');
        li.className = 'cards-item';
        
        // Sposta l'instrumentazione se presente
        if (typeof moveInstrumentation === 'function') {
          moveInstrumentation(row, li);
        }
        
        // Sposta tutti i children dalla row al li
        while (row.firstElementChild) {
          li.append(row.firstElementChild);
        }
        
        // Processa e classifica ogni div nel li
        [...li.children].forEach((div) => {
          const picture = div.querySelector('picture');
          const img = picture?.querySelector('img') || div.querySelector('img');
          
          if (div.children.length === 1 && picture) {
            // Questo è un contenitore immagine
            div.className = 'cards-card-image';
            
            if (img) {
              const validation = validateImageElement(img);
              
              if (!validation.src) {
                // Immagine non valida
                const replacement = handleMissingImage(div);
                if (replacement) {
                  // Sostituisci con placeholder
                  if (picture) {
                    picture.replaceWith(replacement);
                  } else {
                    img.replaceWith(replacement);
                  }
                }
              } else {
                // Immagine valida, aggiorna gli attributi
                img.src = validation.src;
                img.alt = validation.alt;
              }
            } else {
              // Nessuna immagine trovata
              const replacement = handleMissingImage(div);
              if (replacement) {
                div.appendChild(replacement);
              }
            }
          } else {
            // Questo è un contenitore di testo
            div.className = 'cards-card-body';
            processTextContent(div);
          }
        });
        
        // Verifica se mantenere card vuote
        if (!DEFAULT_VALUES.card.preserveEmptyCards && isCardEmpty(li)) {
          console.warn(`Cards block: Card ${index} rimossa perché vuota`);
          return; // Non aggiungere questa card
        }
        
        ul.append(li);
      } catch (error) {
        console.error(`Cards block: Errore nel processamento della card ${index}:`, error);
        // Continua con le altre card
      }
    });

    // Ottimizza le immagini valide
    ul.querySelectorAll('picture > img, img:not(picture img)').forEach((img) => {
      try {
        const src = img.src?.trim();
        const alt = img.alt?.trim() ?? DEFAULT_VALUES.image.alt;
        
        // Verifica che sia un'immagine valida e non un placeholder
        if (isValidUrl(src) && src !== DEFAULT_VALUES.image.src && typeof createOptimizedPicture === 'function') {
          const optimizedPic = createOptimizedPicture(
            src, 
            alt, 
            false, 
            [{ width: DEFAULT_VALUES.image.width }]
          );
          
          // Sposta l'instrumentazione se presente
          if (typeof moveInstrumentation === 'function') {
            const optimizedImg = optimizedPic.querySelector('img');
            if (optimizedImg) {
              moveInstrumentation(img, optimizedImg);
            }
          }
          
          // Sostituisci l'elemento picture o img
          const pictureParent = img.closest('picture');
          if (pictureParent) {
            pictureParent.replaceWith(optimizedPic);
          } else {
            img.replaceWith(optimizedPic);
          }
        }
      } catch (error) {
        console.warn('Cards block: Errore nell\'ottimizzazione dell\'immagine:', error, img.src);
        // Mantieni l'immagine originale in caso di errore
      }
    });

  } catch (error) {
    console.error('Cards block: Errore grave nel processamento:', error);
    // Crea una card di errore
    const errorLi = document.createElement('li');
    errorLi.className = 'cards-item cards-error';
    const errorDiv = document.createElement('div');
    errorDiv.className = 'cards-card-body';
    errorDiv.innerHTML = '<p>Errore nel caricamento del contenuto</p>';
    errorLi.appendChild(errorDiv);
    ul.appendChild(errorLi);
  }

  // Assicurati che ci sia almeno una card
  if (ul.children.length === 0) {
    console.warn('Cards block: Nessuna card valida trovata, creazione card di fallback');
    const fallbackLi = document.createElement('li');
    fallbackLi.className = 'cards-item cards-fallback';
    
    const fallbackBodyDiv = document.createElement('div');
    fallbackBodyDiv.className = 'cards-card-body';
    fallbackBodyDiv.innerHTML = `<p>${DEFAULT_VALUES.text.fallback}</p>`;
    fallbackLi.appendChild(fallbackBodyDiv);
    
    if (!DEFAULT_VALUES.image.hideOnMissing) {
      const fallbackImageDiv = document.createElement('div');
      fallbackImageDiv.className = 'cards-card-image';
      fallbackImageDiv.appendChild(createPlaceholderImage());
      fallbackLi.appendChild(fallbackImageDiv);
    }
    
    ul.appendChild(fallbackLi);
  }

  // Pulisce e sostituisce il contenuto del blocco
  block.textContent = '';
  block.append(ul);
  
  // Aggiungi attributi per identificare il blocco processato
  block.setAttribute('data-block-status', 'processed');
  block.setAttribute('data-cards-count', ul.children.length);
}
