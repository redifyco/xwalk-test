import { isEditorMode } from "../../scripts/utils.js";

export default async function decorate(block) {
  const inEditorMode = isEditorMode();

  // Estrai il titolo, la descrizione e il pulsante se presenti
  const titleElement = block.querySelector('h2, h3, h1');
  const title = titleElement ? titleElement.innerHTML : '';
  const descriptionElement = block.querySelector('p');
  const description = descriptionElement ? descriptionElement.innerHTML : '';
  const buttonElement = block.querySelector('a');
  const button = buttonElement ? buttonElement.cloneNode(true) : null;

  // Estrai le immagini del logo
  const logoImages = Array.from(block.querySelectorAll('img'));
  const logoLinks = Array.from(block.querySelectorAll('div > a')).filter(a => !a.querySelector('img')); // Solo link di testo

  // Svuota il blocco per ricostruirlo
  block.textContent = '';

  // Crea la struttura secondo showcasestatic.html
  const showcaseSection = document.createElement('section');
  showcaseSection.className = 'flex flex-col items-center justify-center gap-8 px-4 pb-14 text-center 2xl:gap-16 2xl:px-16 2xl:pb-32';

  // Aggiungi il titolo se presente
  if (title) {
    const titleContainer = document.createElement('h2');
    titleContainer.className = 'text-primary text-3xl uppercase 2xl:text-7xl';
    titleContainer.innerHTML = title;
    showcaseSection.appendChild(titleContainer);
  } else if (inEditorMode) {
    const placeholderTitle = document.createElement('h2');
    placeholderTitle.className = 'text-primary text-3xl uppercase 2xl:text-7xl editor-placeholder';
    placeholderTitle.innerHTML = 'Our <span class="font-joyful-xs 2xl:font-joyful-sm lowercase">partners</span>';
    showcaseSection.appendChild(placeholderTitle);
  }

  // Aggiungi la descrizione se presente
  if (description) {
    const descriptionContainer = document.createElement('p');
    descriptionContainer.className = 'text-sm 2xl:text-xl';
    descriptionContainer.innerHTML = description;
    showcaseSection.appendChild(descriptionContainer);
  } else if (inEditorMode) {
    const placeholderDesc = document.createElement('p');
    placeholderDesc.className = 'text-sm 2xl:text-xl editor-placeholder';
    placeholderDesc.textContent = 'We are stronger together: we are proud to collaborate with leading organisations.';
    showcaseSection.appendChild(placeholderDesc);
  }

  // Crea il contenitore per i logo
  const logoContainer = document.createElement('div');
  logoContainer.className = 'flex h-32 items-center justify-center gap-2 overflow-x-scroll 2xl:h-52 2xl:items-center 2xl:gap-8';

  // Aggiungi le immagini dei logo
  for (let i = 0; i < 7; i++) {
    if (logoImages[i]) {
      const img = logoImages[i].cloneNode(true);
      img.className = 'w-20 2xl:w-40';

      // Se c'è un link corrispondente, avvolgi l'immagine in un link
      if (logoLinks[i]) {
        const link = logoLinks[i].cloneNode(false); // Clona solo il tag a senza contenuto interno
        link.appendChild(img);
        logoContainer.appendChild(link);
      } else {
        logoContainer.appendChild(img);
      }
    } else if (inEditorMode) {
      // Placeholder in modalità editor
      const placeholderImg = document.createElement('div');
      placeholderImg.className = 'w-20 h-20 2xl:w-40 2xl:h-40 border border-dashed flex items-center justify-center editor-placeholder';
      placeholderImg.textContent = `Logo ${i + 1}`;
      logoContainer.appendChild(placeholderImg);
    }
  }

  showcaseSection.appendChild(logoContainer);

  // Aggiungi il pulsante se presente
  if (button) {
    button.className = 'group border-primary relative inline-block border p-2 2xl:border-0';

    // Aggiungi gli span decorativi del pulsante
    const spans = [
      { className: 'button-line-absolute-theme -top-1 -right-1 h-0.5 w-3/5 group-hover:w-9/12' },
      { className: 'button-line-absolute-theme -top-1 -right-1 h-full w-0.5 group-hover:h-9/12' },
      { className: 'button-line-absolute-theme -bottom-1 -left-1 h-0.5 w-3/5 group-hover:w-9/12' },
      { className: 'button-line-absolute-theme -bottom-1 -left-1 h-full w-0.5 group-hover:h-9/12' }
    ];

    // Salva il testo del pulsante
    const buttonText = button.textContent;
    button.textContent = '';

    // Aggiungi gli span decorativi
    spans.forEach(spanData => {
      const span = document.createElement('span');
      span.className = spanData.className;
      button.appendChild(span);
    });

    // Aggiungi il container per il testo del pulsante
    const textSpan = document.createElement('span');
    textSpan.className = 'text-primary px-6 py-2';
    textSpan.textContent = buttonText;
    button.appendChild(textSpan);

    showcaseSection.appendChild(button);
  } else if (inEditorMode) {
    const placeholderButton = document.createElement('a');
    placeholderButton.href = '#';
    placeholderButton.className = 'group border-primary relative inline-block border p-2 2xl:border-0 editor-placeholder';

    // Aggiungi gli span decorativi del pulsante
    const spans = [
      { className: 'button-line-absolute-theme -top-1 -right-1 h-0.5 w-3/5 group-hover:w-9/12' },
      { className: 'button-line-absolute-theme -top-1 -right-1 h-full w-0.5 group-hover:h-9/12' },
      { className: 'button-line-absolute-theme -bottom-1 -left-1 h-0.5 w-3/5 group-hover:w-9/12' },
      { className: 'button-line-absolute-theme -bottom-1 -left-1 h-full w-0.5 group-hover:h-9/12' }
    ];

    spans.forEach(spanData => {
      const span = document.createElement('span');
      span.className = spanData.className;
      placeholderButton.appendChild(span);
    });

    const textSpan = document.createElement('span');
    textSpan.className = 'text-primary px-6 py-2';
    textSpan.textContent = 'Donate Now';
    placeholderButton.appendChild(textSpan);

    showcaseSection.appendChild(placeholderButton);
  }

  // Aggiungi la sezione completa al blocco
  block.appendChild(showcaseSection);

  // Aggiungi classe speciale per il modo editor
  if (inEditorMode) {
    block.querySelectorAll('.editor-placeholder').forEach(el => {
      el.style.opacity = '0.6';
      el.style.border = '1px dashed #ccc';
    });
  }
}
