import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Recupera i dati dal div del blocco con nomi coerenti
  // con component-definition.json
  const logos = [...block.children].map((row) => {
    const logoBlock = document.createElement('div');
    logoBlock.className = 'logo';

    // Usa nomi dei campi coerenti con la definizione del componente
    const logoImage = row.querySelector('img');
    if (logoImage) {
      const picture = createOptimizedPicture(logoImage.src, logoImage.alt, false, [{ width: '200' }]);
      const imageWrapper = document.createElement('div');
      imageWrapper.className = 'logo-image';
      imageWrapper.appendChild(picture);
      logoBlock.appendChild(imageWrapper);
    }

    // Recupera il testo/titolo del logo se presente
    const logoTitle = row.querySelector('h3, h2, h1');
    if (logoTitle) {
      const titleWrapper = document.createElement('div');
      titleWrapper.className = 'logo-title';
      titleWrapper.textContent = logoTitle.textContent;
      logoBlock.appendChild(titleWrapper);
    }

    // Recupera eventuale descrizione
    const logoDescription = row.querySelector('p');
    if (logoDescription) {
      const descriptionWrapper = document.createElement('div');
      descriptionWrapper.className = 'logo-description';
      descriptionWrapper.innerHTML = logoDescription.innerHTML;
      logoBlock.appendChild(descriptionWrapper);
    }

    return logoBlock;
  });

  // Svuota il blocco e aggiungi i logo-block formattati
  block.textContent = '';
  const logoContainer = document.createElement('div');
  logoContainer.className = 'logo-container';
  logos.forEach((logo) => {
    logoContainer.appendChild(logo);
  });

  block.appendChild(logoContainer);
}
