import {isEditorMode} from "../../scripts/utils.js";

export default async function decorate(block) {
  const inEditorMode = isEditorMode();

  // Recupera tutti i div di primo livello
  const divs = Array.from(block.children);

  // IMMAGINE: primo div
  let imageUrl = null;
  if (divs[0]) {
    const pictureElement = divs[0].querySelector('picture');
    const imgElement = pictureElement ? pictureElement.querySelector('img') : null;
    if (imgElement) {
      imageUrl = imgElement.src;
    }
  }

  // TITOLO: secondo div
  let title = "";
  if (divs[1]) {
    const titleContainer = divs[1].querySelector('div');
    if (titleContainer) {
      title = titleContainer.innerHTML;
    }
  }

  // SOTTOTITOLO: terzo div (potenzialmente rich text)
  let subtitle = "";
  if (divs[2]) {
    const subtitleContainer = divs[2].querySelector('div');
    if (subtitleContainer) {
      subtitle = subtitleContainer.innerHTML;
    }
  }

  // BUTTON TEXT: quarto div
  let buttonText = "Learn more About Us"; // valore predefinito
  if (divs[3]) {
    const buttonTextContainer = divs[3].querySelector('div');
    if (buttonTextContainer) {
      buttonText = buttonTextContainer.textContent.trim();
    }
  }

  // BUTTON LINK: quinto div (potrebbe contenere un link)
  let buttonLink = "#"; // valore predefinito
  if (divs[4]) {
    const linkElement = divs[4].querySelector('a');
    if (linkElement) {
      buttonLink = linkElement.href;
    } else {
      // Se non c'è un link, usa il testo come URL
      const buttonLinkContainer = divs[4].querySelector('div');
      if (buttonLinkContainer && buttonLinkContainer.textContent.trim()) {
        buttonLink = buttonLinkContainer.textContent.trim();
      }
    }
  }

  // Clear the block content
  block.textContent = '';

  // Imposta altezza predefinita basata sulla modalità
  const heightClass = inEditorMode ? 'h-[600px]' : 'h-dvh';

  // Create the section
  const section = document.createElement('section');
  section.className = `flex flex-col bg-gray-500 bg-cover bg-center bg-no-repeat text-white w-full`;

  // Imposta l'immagine di sfondo se disponibile
  if (imageUrl) {
    section.style.backgroundImage = `url(${imageUrl})`;
  }

  // Create the first div
  const div1 = document.createElement('div');
  div1.className = `relative ${heightClass} z-10 flex w-full flex-col justify-end gap-3 px-4 pb-14 lg:justify-center xl:px-16 xl:py-11`;

  // Create the h1 with the title content
  const h1 = document.createElement('h1');
  h1.className = 'text-5xl font-semibold uppercase lg:text-[130px] 2xl:text-8xl 2xl:text-[180px]';
  h1.innerHTML = title;
  div1.appendChild(h1);

  // Create the paragraph with the subtitle content
  const p1 = document.createElement('p');
  p1.className = 'w-3/4 text-sm lg:text-xl 2xl:w-2/3 2xl:text-2xl';
  p1.innerHTML = subtitle || '"We all have the duty to leave a better world for future generations" Capt. Gianluigi Aponte - MSC Foundation Chair';
  div1.appendChild(p1);

  // Aggiungiamo il pulsante alla prima sezione
  if (buttonText) {
    const primaryButton = document.createElement('a');
    primaryButton.href = buttonLink;
    primaryButton.className = 'group relative inline-block w-fit p-2 mt-4';
    primaryButton.innerHTML = `
      <span class="button-line-absolute-white -top-1 -right-1 h-0.5 w-6/12 group-hover:w-9/12"></span>
      <span class="button-line-absolute-white -top-1 -right-1 h-full w-0.5 group-hover:h-9/12"></span>
      <span class="button-line-absolute-white -bottom-1 -left-1 h-0.5 w-6/12 group-hover:w-9/12"></span>
      <span class="button-line-absolute-white -bottom-1 -left-1 h-full w-0.5 group-hover:h-9/12"></span>
      <span class="px-4 py-2 text-white">${buttonText}</span>
    `;
    div1.appendChild(primaryButton);
  }

  // Append everything to the section
  section.appendChild(div1);
  block.appendChild(section);

  // Aggiungiamo class al body per stili globali in editor mode
  if (inEditorMode) {
    document.documentElement.classList.add('universal-editor-mode');
  }
}
