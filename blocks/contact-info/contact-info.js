import { loadGoogleMaps, processDivsToObjectContactsItems } from '../../scripts/utils.js';
import { mapStyles } from './mapStyle.js';

// Funzione per ottenere lo stile della mappa
function getMapStyle(styleName) {
  if (styleName === 'default') {
    return mapStyles; // Usa lo stile personalizzato come default
  }
  // Per ora ritorniamo lo stile base per tutti gli altri
  return [];
}

async function initializeMap(mapConfig, sectionTitle) {
  const mapElement = document.getElementById('contact-map');
  if (!mapElement) return;

  // Se non c'è API key, mostra messaggio
  if (!mapConfig.apiKey) {
    mapElement.innerHTML = `
            <div class="flex w-full items-center justify-center h-full text-gray-500">
                <div class="text-center w-full">
                    <p class="font-semibold">Map not available</p>
                    <p class="text-sm">Google Maps API Key missing</p>
                </div>
            </div>
        `;
    return;
  }

  // Carica Google Maps
  await loadGoogleMaps(mapConfig.apiKey);

  if (!window.google) {
    mapElement.innerHTML = `
            <div class="flex items-center justify-center h-full text-red-500">
                <div class="text-center">
                    <p class="font-semibold">Loading error</p>
                    <p class="text-sm">Unable to load Google Maps</p>
                </div>
            </div>
        `;
    return;
  }

  // Verifica che le coordinate siano valide
  if (isNaN(mapConfig.lat) || isNaN(mapConfig.lng)) {
    mapElement.innerHTML = `
            <div class="flex items-center justify-center h-full text-gray-500">
                <div class="text-center">
                    <p class="font-semibold">Invalid coordinates</p>
                    <p class="text-sm">Check latitude: ${mapConfig.lat} and longitude: ${mapConfig.lng}</p>
                </div>
            </div>
        `;
    return;
  }

  const coordinates = {
    lat: mapConfig.lat,
    lng: mapConfig.lng
  };

  // Crea la mappa
  const map = new google.maps.Map(mapElement, {
    center: coordinates,
    zoom: mapConfig.zoom,
    styles: getMapStyle(mapConfig.mapStyle),
    mapTypeControl: false,
    streetViewControl: false
  });

  // Aggiungi marker
  const marker = new google.maps.Marker({
    position: coordinates,
    map: map,
    title: sectionTitle || 'Our Location',
    icon: {
      path: 'M20.49 16.5658C21.4497 14.933 22 13.0308 22 11C22 4.92487 17.0751 0 11 0C4.92487 0 0 4.92487 0 11C0 13.0308 0.550314 14.933 1.50995 16.5658L11 33.7952L20.49 16.5658ZM15.6386 10.8675C15.6386 13.4293 13.5618 15.506 11 15.506C8.4382 15.506 6.36145 13.4293 6.36145 10.8675C6.36145 8.30568 8.4382 6.22893 11 6.22893C13.5618 6.22893 15.6386 8.30568 15.6386 10.8675Z',
      fillColor: '#009BAC',
      fillOpacity: 1,
      strokeWeight: 0,
      rotation: 0,
      scale: 1,
      anchor: new google.maps.Point(11, 34),
    }
  });

  // Aggiungi InfoWindow
  const infoWindow = new google.maps.InfoWindow({
    content: `
            <div class="p-4">
                <h3 class="font-semibold text-lg">${sectionTitle || 'Location'}</h3>
                <p class="text-sm text-gray-600">Lat: ${coordinates.lat}, Lng: ${coordinates.lng}</p>
            </div>
        `
  });

  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });
}

export default async function decorate(block) {

  console.log('contact-info block loaded');
  const mapConfig = {
    apiKey: block.querySelector('div:nth-child(1)')
      ?.textContent
      .trim() || '',
    lat: parseFloat(block.querySelector('div:nth-child(2)')
      ?.textContent
      .trim() || '41.9028'),
    lng: parseFloat(block.querySelector('div:nth-child(3)')
      ?.textContent
      .trim() || '12.4964'),
    zoom: parseInt(block.querySelector('div:nth-child(4)')
      ?.textContent
      .trim() || '15', 10),
    mapStyle: block.querySelector('div:nth-child(5)')
      ?.textContent
      .trim() || 'default',
  };

  const sectionTitle = block.querySelector('div:nth-child(6)')
    ?.textContent
    .trim() || '';
  const boxTitle = block.querySelector('div:nth-child(7)')
    ?.textContent
    .trim() || '';
  const contactInfoItems = block.querySelectorAll('div:nth-child(n+8)');
  const resultItems = processDivsToObjectContactsItems(contactInfoItems) || [];

  const sectionContainer = document.createElement('section');
  sectionContainer.className = 'container-layout-padding justify-between gap-8 flex flex-col lg:flex-row w-full';

  // Costruisci il contenuto delle informazioni di contatto
  const contactContentHtml = () => {
    if (!sectionTitle && !boxTitle && resultItems.length === 0) {
      return `
                <div class="border-t w-full pt-10 border-solid border-t-black flex items-center justify-center">
                    <p class="text-gray-400 text-lg">Contact section not configured</p>
                </div>
            `;
    }

    return `
            <div class=" w-full pt-10 flex flex-col gap-8 border-0 lg:border-t border-t-black">
                ${sectionTitle ? `<h3 class="font-semibold text-5xl contact-map border-b lg:border-none">${sectionTitle}</h3>` : ''}
                <div class="content-center h-full flex flex-col gap-4">
                    ${boxTitle ? `<h4 class="font-bold text-xl">${boxTitle}</h4>` : ''}
                    ${resultItems.length > 0 ? `
                        <div class="flex p-4 pl-10 flex-col gap-4">
                            ${resultItems.map((item) => `
                                <a class="flex gap-2 items-center" href="${item.link}">
                                    <img src="${item.image}" class="size-6 rounded-full" alt="">
                                    <p>${item.label}</p>
                                </a>
                            `)
      .join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
  };

  sectionContainer.innerHTML = `
        ${contactContentHtml()}
        <div class="relative">
            <div id="contact-map" class="bg-gray-100 h-[334px] lg:h-[700px] w-full lg:w-[700px] flex items-center justify-center">
                <div class="text-gray-500">Loading map...</div>
            </div>
        </div>
    `;

  const aemEnv = block.getAttribute('data-aue-resource');
  if (!aemEnv) {
    block.textContent = '';
    block.append(sectionContainer);
  } else {
    block.append(sectionContainer);
    block.querySelectorAll(':scope > div:nth-child(n+1) div')
      .forEach(item => item.classList.add('hidden'));
  }

  // Inizializza la mappa
  await initializeMap(mapConfig, sectionTitle);
}
