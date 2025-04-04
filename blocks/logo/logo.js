export default function decorate(block) {
  // Rimuovi tutte le classi esistenti e aggiungi solo quelle necessarie
  block.className = 'block logo';

  // Estrai l'immagine
  const img = block.querySelector('img');
  if (img) {
    // Assicurati che l'immagine abbia le classi corrette
    img.className = 'w-20 2xl:w-40';

    // Estrai il link se esiste
    const linkCell = block.querySelector('div:nth-child(2)');
    const linkUrl = linkCell?.textContent.trim();

    // Rimuovi tutti i contenuti esistenti
    block.textContent = '';

    // Se c'è un link, avvolgi l'immagine nel link
    if (linkUrl && linkUrl !== '') {
      const link = document.createElement('a');
      link.href = linkUrl;
      link.appendChild(img.cloneNode(true));
      block.appendChild(link);
    } else {
      block.appendChild(img.cloneNode(true));
    }
  } else {
    // Se non c'è un'immagine, crea un placeholder
    block.textContent = '';
    const placeholder = document.createElement('div');
    placeholder.className = 'w-20 h-20 2xl:w-40 2xl:h-40 border border-dashed flex items-center justify-center';
    placeholder.textContent = 'Logo';
    block.appendChild(placeholder);
  }
}
