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


    const sectionContainer = document.createElement('section');
    sectionContainer.className = 'hidden flex-col gap-16 bg-white bg-cover bg-center bg-no-repeat pt-30 text-start xl:flex'

    sectionContainer.innerHTML = ` 
      <div class="flex items-end justify-between px-16">
        <h2 class="text-primary w-full text-6xl uppercase 2xl:text-7xl">
          Driving impact
          <br />
          <span class="font-joyful-sm lowercase">across</span>
          the globe
        </h2>
        <p class="w-9/12 text-xl font-light">
          Explore our programmes and initiatives on the map: pass the cursor
          over a country and click to discover the actions we’re carrying out
          with our partners.
        </p>
      </div>
      <div
        class="relative h-[1000px] bg-[url(/assets/images/map.png)] bg-cover bg-center bg-no-repeat"
      >
        <div class="absolute inset-16 h-fit w-[325px] bg-white p-6">
          <h5
            class="border-b-primary text-primary mb-2 border-b border-solid pb-2 text-xl font-semibold"
          >
            Lorem ipsum dolor
          </h5>
          <ul class="flex flex-col gap-6 px-4 py-4">
            <li class="flex items-start gap-6">
             <!-- <img
                src="assets/icons/environmental.svg"
                alt="environmental icon"
              />-->
              <span class="text-lg">Environmental Conservation</span>
            </li>
            <li class="flex items-start gap-6">
              <!--<img
                src="assets/icons/community.svg"
                alt="Community support icon"
              />-->
              <span class="text-lg">Community Support</span>
            </li>
            <li class="flex items-start gap-6">
<!--              <img src="assets/icons/education.svg" alt="Education icon" />-->
              <span class="text-lg">Education</span>
            </li>
            <li class="flex items-start gap-6">
              <!--<img
                src="assets/icons/emergency.svg"
                alt="Emergency Relief icon"
              />-->
              <span class="text-lg">Emergency Relief</span>
            </li>
          </ul>
        </div>
      </div>
    `

    block.textContent = ''
    block.append(sectionContainer)

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
