export default function decorate(block) {
  // Struttura di base del logo showcase
  const section = document.createElement('section');
  section.className = 'flex flex-col items-center justify-center gap-8 px-4 pb-14 text-center 2xl:gap-16 2xl:px-16 2xl:pb-32';

  // Estrai titolo
  const titleDiv = block.querySelector('div:nth-child(1)');
  if (titleDiv) {
    const title = document.createElement('h2');
    title.className = 'text-primary text-3xl uppercase 2xl:text-7xl';
    title.innerHTML = titleDiv.innerHTML;
    section.appendChild(title);
  }

  // Estrai descrizione
  const descDiv = block.querySelector('div:nth-child(2)');
  if (descDiv) {
    const desc = document.createElement('p');
    desc.className = 'text-sm 2xl:text-xl';
    desc.innerHTML = descDiv.innerHTML;
    section.appendChild(desc);
  }

  // Contenitore per i loghi
  const logoContainer = document.createElement('div');
  logoContainer.className = 'flex h-32 items-center justify-center gap-2 overflow-x-scroll 2xl:h-52 2xl:items-center 2xl:gap-8';

  // Tutti i loghi dovrebbero essere contenuti in una div specifica (es. la terza div)
  const logoItems = block.querySelectorAll('.block.logo');

  // Se non ci sono loghi espliciti, cerchiamo le immagini
  if (logoItems.length === 0) {
    const images = block.querySelectorAll('img');
    images.forEach(img => {
      const clone = img.cloneNode(true);
      clone.className = 'w-20 2xl:w-40';

      // Se l'immagine è dentro un link, preserviamo il link
      if (img.parentElement.tagName === 'A') {
        const link = img.parentElement.cloneNode(false);
        link.appendChild(clone);
        logoContainer.appendChild(link);
      } else {
        logoContainer.appendChild(clone);
      }
    });
  } else {
    // Altrimenti usiamo i blocchi logo esistenti
    logoItems.forEach(logo => {
      logoContainer.appendChild(logo);
    });
  }

  section.appendChild(logoContainer);

  // Bottone (ultima div)
  const buttonDiv = block.querySelector('div:nth-child(4)');
  if (buttonDiv) {
    const buttonText = buttonDiv.textContent.trim();
    const buttonLink = buttonDiv.querySelector('a')?.getAttribute('href') || '#';

    if (buttonText) {
      const button = document.createElement('a');
      button.href = buttonLink;
      button.className = 'group border-primary relative inline-block border p-2 2xl:border-0';

      // Aggiungi gli elementi decorativi
      const spans = [
        { className: 'button-line-absolute-theme -top-1 -right-1 h-0.5 w-3/5 group-hover:w-9/12' },
        { className: 'button-line-absolute-theme -top-1 -right-1 h-full w-0.5 group-hover:h-9/12' },
        { className: 'button-line-absolute-theme -bottom-1 -left-1 h-0.5 w-3/5 group-hover:w-9/12' },
        { className: 'button-line-absolute-theme -bottom-1 -left-1 h-full w-0.5 group-hover:h-9/12' }
      ];

      spans.forEach(spanData => {
        const span = document.createElement('span');
        span.className = spanData.className;
        button.appendChild(span);
      });

      const textSpan = document.createElement('span');
      textSpan.className = 'text-primary px-6 py-2';
      textSpan.textContent = buttonText;
      button.appendChild(textSpan);

      section.appendChild(button);
    }
  }

  // Sostituisci il contenuto originale
  block.textContent = '';
  block.appendChild(section);

  // Aggiungi classe per lo stile
  block.classList.add('logo-showcase-container');
}
