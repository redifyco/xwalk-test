import { loadScript } from '../../scripts/utils.js';

export default async function decorate(block) {
    // Estrai le configurazioni dalla prima riga
    const config = {
        apiKey: block.querySelector('div:nth-child(3)')?.textContent.trim() || '',
        centerLat: parseFloat(block.querySelector('div:nth-child(4)')?.textContent.trim() || '41.9028'),
        centerLng: parseFloat(block.querySelector('div:nth-child(5)')?.textContent.trim() || '12.4964'),
        zoom: parseInt(block.querySelector('div:nth-child(6)')?.textContent.trim() || '12', 10),
        mapStyle: block.querySelector('div:nth-child(7)')?.textContent.trim() || 'default'
    };


    console.log('block', block)


    const sectionContainer = document.createElement('section');
    sectionContainer.className = 'flex flex-col gap-16 bg-white bg-cover bg-center bg-no-repeat pt-30 text-start'

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
                <div class="relative h-[1000px]">
                  <div id="map" class="absolute inset-0"></div>
        <div class="absolute inset-16 h-fit w-[325px] bg-white p-6">
          <h5
            class="border-b-primary text-primary mb-2 border-b border-solid pb-2 text-xl font-semibold"
          >
            Lorem ipsum dolor
          </h5>
          <ul class="flex flex-col gap-6 px-4 py-4">
            <li class="flex items-start gap-6">
              <span class="text-lg">Environmental Conservation</span>
            </li>
            <li class="flex items-start gap-6">
              <span class="text-lg">Community Support</span>
            </li>
            <li class="flex items-start gap-6">
              <span class="text-lg">Education</span>
            </li>
            <li class="flex items-start gap-6">
              <span class="text-lg">Emergency Relief</span>
            </li>
          </ul>
        </div>
      </div>
    `

    block.textContent = '';
    block.append(sectionContainer);

    await loadGoogleMaps(config.apiKey);

    const mapElement = document.getElementById('map');
    if (mapElement) {
        new google.maps.Map(mapElement, {
            center: {lat: config.centerLat, lng: config.centerLng},
            zoom: config.zoom,
            styles: [
                {featureType: "water", elementType: "geometry", stylers: [{color: "#e9e9e9"}, {lightness: 17}]},
                {featureType: "landscape", elementType: "geometry", stylers: [{color: "#f5f5f5"}, {lightness: 20}]},
                {
                    featureType: "road.highway",
                    elementType: "geometry.fill",
                    stylers: [{color: "#ffffff"}, {lightness: 17}]
                },
                {
                    featureType: "road.highway",
                    elementType: "geometry.stroke",
                    stylers: [{color: "#ffffff"}, {lightness: 29}, {weight: 0.2}]
                },
                {featureType: "road.arterial", elementType: "geometry", stylers: [{color: "#ffffff"}, {lightness: 18}]},
                {featureType: "road.local", elementType: "geometry", stylers: [{color: "#ffffff"}, {lightness: 16}]},
                {featureType: "poi", elementType: "geometry", stylers: [{color: "#f5f5f5"}, {lightness: 21}]},
                {featureType: "poi.park", elementType: "geometry", stylers: [{color: "#dedede"}, {lightness: 21}]},
                {
                    featureType: "all",
                    elementType: "labels.text.stroke",
                    stylers: [{visibility: "on"}, {color: "#ffffff"}, {lightness: 16}]
                },
                {
                    featureType: "all",
                    elementType: "labels.text.fill",
                    stylers: [{saturation: 36}, {color: "#333333"}, {lightness: 40}]
                },
                {featureType: "all", elementType: "labels.icon", stylers: [{visibility: "off"}]},
                {featureType: "transit", elementType: "geometry", stylers: [{color: "#f2f2f2"}, {lightness: 19}]},
                {
                    featureType: "administrative",
                    elementType: "geometry.fill",
                    stylers: [{color: "#fefefe"}, {lightness: 20}]
                },
                {
                    featureType: "administrative",
                    elementType: "geometry.stroke",
                    stylers: [{color: "#fefefe"}, {lightness: 17}, {weight: 1.2}]
                }
            ]
        });
    }
}


async function loadGoogleMaps(apiKey) {
    if (!window.google || !window.google.maps) {
        return loadScript(`https://maps.googleapis.com/maps/api/js?key=${apiKey}`);
    }
    return Promise.resolve();
}

