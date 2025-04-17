export default function decorate(block) {
  // Aggiungi classe al blocco per identificarlo come pin
  block.classList.add('map-pin');

  // Estrai dati del pin
  const latitude = block.querySelector('div:nth-child(1) div:nth-child(1)')?.textContent.trim() || '';
  const longitude = block.querySelector('div:nth-child(1) div:nth-child(2)')?.textContent.trim() || '';
  const title = block.querySelector('div:nth-child(2) div:nth-child(1)')?.textContent.trim() || '';
  const description = block.querySelector('div:nth-child(2) div:nth-child(2)')?.innerHTML || '';
  const iconImg = block.querySelector('div:nth-child(3) img') || null;
  const linkUrl = block.querySelector('div:nth-child(4) div:nth-child(1)')?.textContent.trim() || '';
  const linkText = block.querySelector('div:nth-child(4) div:nth-child(2)')?.textContent.trim() || 'Learn More';

  // Crea gli elementi per i dati del pin
  const latEl = document.createElement('div');
  latEl.className = 'pin-latitude';
  latEl.textContent = latitude;

  const lngEl = document.createElement('div');
  lngEl.className = 'pin-longitude';
  lngEl.textContent = longitude;

  const titleEl = document.createElement('div');
  titleEl.className = 'pin-title';
  titleEl.textContent = title;

  const descEl = document.createElement('div');
  descEl.className = 'pin-description';
  descEl.innerHTML = description;

  const iconEl = document.createElement('div');
  iconEl.className = 'pin-icon';
  if (iconImg) {
    iconEl.appendChild(iconImg.cloneNode(true));
  }

  const linkUrlEl = document.createElement('div');
  linkUrlEl.className = 'pin-link-url';
  linkUrlEl.textContent = linkUrl;

  const linkTextEl = document.createElement('div');
  linkTextEl.className = 'pin-link-text';
  linkTextEl.textContent = linkText;

  // Rimuovi contenuto originale e inserisci gli elementi formattati
  block.textContent = '';
  block.appendChild(latEl);
  block.appendChild(lngEl);
  block.appendChild(titleEl);
  block.appendChild(descEl);
  block.appendChild(iconEl);
  block.appendChild(linkUrlEl);
  block.appendChild(linkTextEl);
}
