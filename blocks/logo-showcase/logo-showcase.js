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
  logoContainer.className = 'flex flex-wrap items-center justify-center gap-8 mt-8 2xl:mt-16';

  // Cerca gli item di tipo logo
  // La terza div contiene gli elementi logo
  const logoWrapper = block.children[2]?.children[0];
  if (logoWrapper) {
    // Ogni riga nella tabella è un logo separato
    [...logoWrapper.children].forEach((row) => {
      if (row.tagName === 'DIV') {
        // Ogni logo deve avere un'immagine nella prima colonna
        const img = row.querySelector('img');
        if (img) {
          // Imposta lo stile dell'immagine
          img.className = 'w-20 2xl:w-40';

          // Controlla se c'è un link
          const linkCell = row.querySelector('div:nth-child(2)');
          const linkUrl = linkCell?.textContent.trim();

          // Creiamo un nuovo elemento per il logo
          const logoElement = document.createElement('div');
          logoElement.className = 'logo-item p-4 flex items-center justify-center';

          if (linkUrl && linkUrl !== '') {
            // Se c'è un link, crea un elemento <a> con l'immagine all'interno
            const link = document.createElement('a');
            link.href = linkUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.appendChild(img.cloneNode(true));
            logoElement.appendChild(link);
          } else {
            // Altrimenti, aggiungi solo l'immagine
            logoElement.appendChild(img.cloneNode(true));
          }

          logoContainer.appendChild(logoElement);
        }
      }
    });
  }

  section.appendChild(logoContainer);

  // Bottone (quarta div)
  const buttonDiv = block.querySelector('div:nth-child(4)');
  if (buttonDiv) {
    const buttonText = buttonDiv.textContent.trim();
    const buttonLink = buttonDiv.querySelector('a')?.getAttribute('href') || '#';

    if (buttonText) {
      const button = document.createElement('a');
      button.href = buttonLink;
      button.className = 'group border-primary relative inline-block border p-2 mt-8 2xl:mt-16 2xl:border-0';

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
