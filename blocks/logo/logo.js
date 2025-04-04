import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Recupera i dati dal div del blocco con nomi coerenti
  // con component-definition.json
  const logoData = block.firstElementChild;

  // Crea un nuovo elemento logo con la struttura appropriata
  const logoElement = document.createElement('div');
  logoElement.className = 'logo-element';

  // Gestione immagine del logo
  const logoImage = logoData.querySelector('img');
  if (logoImage) {
    const picture = createOptimizedPicture(logoImage.src, logoImage.alt, false);
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'logo-image';
    imageWrapper.appendChild(picture);
    logoElement.appendChild(imageWrapper);
  }

  // Gestione link se presente
  const logoLink = logoData.querySelector('a');
  if (logoLink) {
    const linkWrapper = document.createElement('div');
    linkWrapper.className = 'logo-link';
    const newLink = document.createElement('a');
    newLink.href = logoLink.href;
    newLink.target = logoLink.target || '_blank';

    // Se c'è del testo nel link, preservalo
    if (logoLink.textContent.trim()) {
      newLink.textContent = logoLink.textContent;
    } else {
      // Altrimenti potrebbe essere solo un link wrapper per l'immagine
      newLink.textContent = logoImage ? logoImage.alt : 'Visita il sito';
    }

    linkWrapper.appendChild(newLink);
    logoElement.appendChild(linkWrapper);
  }

  // Svuota il blocco e aggiungi l'elemento logo formattato
  block.textContent = '';
  block.appendChild(logoElement);
}
