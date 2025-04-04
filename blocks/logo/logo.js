export default function decorate(block) {
  // Estrai l'immagine del logo
  const imgElement = block.querySelector('img');

  // Estrai il link se presente
  const linkElement = block.querySelector('a');

  // Svuota il blocco per ricostruirlo
  block.textContent = '';

  // Crea la struttura del logo
  if (imgElement) {
    // Applica le classi Tailwind appropriate
    imgElement.className = 'w-20 2xl:w-40';

    // Se c'è un link, avvolgi l'immagine nel link
    if (linkElement) {
      // Rimuovi eventuali contenuti dal link e inserisci solo l'immagine
      linkElement.textContent = '';
      linkElement.appendChild(imgElement);
      block.appendChild(linkElement);
    } else {
      // Altrimenti, aggiungi semplicemente l'immagine
      block.appendChild(imgElement);
    }
  } else {
    // Se non c'è un'immagine, crea un placeholder
    const placeholder = document.createElement('div');
    placeholder.className = 'w-20 h-20 2xl:w-40 2xl:h-40 border border-dashed flex items-center justify-center';
    placeholder.textContent = 'Logo';
    block.appendChild(placeholder);
  }

  // Stile complessivo del blocco
  block.classList.add('logo-item');
}
