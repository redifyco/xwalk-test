import { loadScript } from '../../scripts/utils.js';

export default async function decorate(block) {
  // Estrai le configurazioni dalla prima riga
  const config = {
    apiKey: block.querySelector('div:nth-child(1) div:nth-child(1)')?.textContent.trim() || '',
    centerLat: parseFloat(block.querySelector('div:nth-child(1) div:nth-child(2)')?.textContent.trim() || '41.9028'),
    centerLng: parseFloat(block.querySelector('div:nth-child(1) div:nth-child(3)')?.textContent.trim() || '12.4964'),
    zoom: parseInt(block.querySelector('div:nth-child(1) div:nth-child(4)')?.textContent.trim() || '12', 10),
    mapStyle: block.querySelector('div:nth-child(1) div:nth-child(5)')?.textContent.trim() || 'default'
  };

  // Estrai titolo e descrizione
  const title = block.querySelector('div:nth-child(2) div:nth-child(1)')?.innerHTML || '';
  const description = block.querySelector('div:nth-child(2) div:nth-child(2)')?.innerHTML || '';

  // Crea il contenitore principale
  const container = document.createElement('div');
  container.className = 'map-container';

  // Aggiungi sezione titolo se presente
  if (title || description) {
    const headerSection = document.createElement('div');
    headerSection.className = 'map-header';

    if (title) {
      const titleEl = document.createElement('h2');
      titleEl.className = 'map-title';
      titleEl.innerHTML = title;
      headerSection.appendChild(titleEl);
    }

    if (description) {
      const descEl = document.createElement('div');
      descEl.className = 'map-description';
      descEl.innerHTML = description;
      headerSection.appendChild(descEl);
    }

    container.appendChild(headerSection);
  }

  // Crea il contenitore della mappa
  const mapElement = document.createElement('div');
  mapElement.className = 'map-element';
  mapElement.id = `map-${Math.floor(Math.random() * 10000)}`;
  container.appendChild(mapElement);

  // Sostituisci il blocco originale
  block.textContent = '';
  block.appendChild(container);

  // Inizializza la mappa quando Google Maps API è caricata
  await loadGoogleMaps(config.apiKey);

  // Inizializza la mappa
  const map = initMap(mapElement.id, config);

  // Raccogli tutti i pin dal blocco e aggiungili alla mappa
  const pins = [];

  // Cerca i blocchi map-pin all'interno del blocco map
  const pinBlocks = block.querySelectorAll('.map-pin');
  pinBlocks.forEach((pinBlock) => {
    // Ricava i dati del pin
    const pinData = extractPinData(pinBlock);
    pins.push(pinData);

    // Nascondi il blocco pin originale
    pinBlock.style.display = 'none';
  });

  // Aggiungi i pin alla mappa
  addPinsToMap(map, pins);
}

// Carica la Google Maps API
async function loadGoogleMaps(apiKey) {
  if (!window.google || !window.google.maps) {
    await loadScript(`https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`);

    // Crea una promessa che si risolve quando la callback di Google Maps viene chiamata
    return new Promise((resolve) => {
      window.initMap = () => {
        delete window.initMap;
        resolve();
      };
    });
  }
  return Promise.resolve();
}

// Inizializza la mappa Google
function initMap(elementId, config) {
  const mapStyles = {
    default: [],
    silver: [{"elementType":"geometry","stylers":[{"color":"#f5f5f5"}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#f5f5f5"}]},{"featureType":"administrative.land_parcel","elementType":"labels.text.fill","stylers":[{"color":"#bdbdbd"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#eeeeee"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#e5e5e5"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#dadada"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#e5e5e5"}]},{"featureType":"transit.station","elementType":"geometry","stylers":[{"color":"#eeeeee"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#c9c9c9"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]}],
    dark: [{"elementType":"geometry","stylers":[{"color":"#212121"}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#212121"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#757575"}]},{"featureType":"administrative.country","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]},{"featureType":"administrative.land_parcel","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#bdbdbd"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#181818"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"featureType":"poi.park","elementType":"labels.text.stroke","stylers":[{"color":"#1b1b1b"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#2c2c2c"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#8a8a8a"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#373737"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#3c3c3c"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry","stylers":[{"color":"#4e4e4e"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"featureType":"transit","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#3d3d3d"}]}],
    retro: [{"elementType":"geometry","stylers":[{"color":"#ebe3cd"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#523735"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#f5f1e6"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#c9b2a6"}]},{"featureType":"administrative.land_parcel","elementType":"geometry.stroke","stylers":[{"color":"#dcd2be"}]},{"featureType":"administrative.land_parcel","elementType":"labels.text.fill","stylers":[{"color":"#ae9e90"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"color":"#dfd2ae"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#dfd2ae"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#93817c"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#a5b076"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#447530"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#f5f1e6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#fdfcf8"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#f8c967"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#e9bc62"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry","stylers":[{"color":"#e98d58"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.stroke","stylers":[{"color":"#db8555"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#806b63"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#dfd2ae"}]},{"featureType":"transit.line","elementType":"labels.text.fill","stylers":[{"color":"#8f7d77"}]},{"featureType":"transit.line","elementType":"labels.text.stroke","stylers":[{"color":"#ebe3cd"}]},{"featureType":"transit.station","elementType":"geometry","stylers":[{"color":"#dfd2ae"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#b9d3c2"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#92998d"}]}]
  };

  const mapOptions = {
    center: { lat: config.centerLat, lng: config.centerLng },
    zoom: config.zoom,
    styles: mapStyles[config.mapStyle] || mapStyles.default,
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: true,
    fullscreenControl: true
  };

  return new google.maps.Map(document.getElementById(elementId), mapOptions);
}

// Estrae dati del pin dal blocco map-pin
function extractPinData(pinBlock) {
  return {
    lat: parseFloat(pinBlock.querySelector('.pin-latitude')?.textContent.trim() || '0'),
    lng: parseFloat(pinBlock.querySelector('.pin-longitude')?.textContent.trim() || '0'),
    title: pinBlock.querySelector('.pin-title')?.textContent.trim() || '',
    description: pinBlock.querySelector('.pin-description')?.innerHTML || '',
    iconUrl: pinBlock.querySelector('.pin-icon img')?.src || '',
    linkUrl: pinBlock.querySelector('.pin-link-url')?.textContent.trim() || '',
    linkText: pinBlock.querySelector('.pin-link-text')?.textContent.trim() || 'Learn More'
  };
}

// Aggiunge i pin alla mappa Google
function addPinsToMap(map, pins) {
  const infoWindow = new google.maps.InfoWindow();

  pins.forEach((pin) => {
    // Crea marker
    const marker = new google.maps.Marker({
      position: { lat: pin.lat, lng: pin.lng },
      map: map,
      title: pin.title,
      icon: pin.iconUrl || null
    });

    // Crea contenuto infoWindow
    const contentString = `
      <div class="pin-info-window">
        <h3>${pin.title}</h3>
        <div class="pin-info-description">${pin.description}</div>
        ${pin.linkUrl ? `<a href="${pin.linkUrl}" class="pin-info-link">${pin.linkText}</a>` : ''}
      </div>
    `;

    // Aggiungi evento click al marker
    marker.addListener('click', () => {
      infoWindow.setContent(contentString);
      infoWindow.open(map, marker);
    });
  });
}
