import {loadGoogleMaps, processDivsToObjectMapPins} from '../../scripts/utils.js';
import {mapStyles} from "./mapStyle.js";

export default async function decorate(block) {
    // Estrai le configurazioni dalla prima riga
    const config = {
        apiKey: block.querySelector('div:nth-child(3)')?.textContent.trim() || '',
        centerLat: parseFloat(block.querySelector('div:nth-child(4)')?.textContent.trim() || '41.9028'),
        centerLng: parseFloat(block.querySelector('div:nth-child(5)')?.textContent.trim() || '12.4964'),
        zoom: parseInt(block.querySelector('div:nth-child(6)')?.textContent.trim() || '12', 10),
    };

    const pins = block.querySelectorAll('div:nth-child(n+8)')
    const resultPins = processDivsToObjectMapPins(pins) || [];
    const title = block.querySelector('div:nth-child(1)')?.textContent || '';
    const subTitle = block.querySelector('div:nth-child(2)')?.textContent || '';


    const sectionContainer = document.createElement('section');
    sectionContainer.className = 'flex flex-col gap-8 lg:gap-16 bg-white bg-cover bg-center bg-no-repeat pt-30 text-center lg:text-start'

    sectionContainer.innerHTML = ` 
      <div class="flex flex-col items-end justify-between small-layout-padding lg:!flex-row !py-0">
        <h2 class="text-primary text-3xl lg:text-5x xl:text-7xl w-full uppercase 2xl:text-7xl">
          ${title}
        </h2>
        <p class="w-full lg:w-9/12 text-sm font-light lg:text-xl">
          ${subTitle}
        </p>
      </div>
      <div class="relative h-[700px] lg:h-[1000px]">
        <div id="map" class="absolute inset-0"></div>
        <div class="absolute hidden lg:block inset-16 shadow-xl h-fit w-[325px] bg-white p-6">
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


    const aemEnv = block.getAttribute('data-aue-resource');
    if (!aemEnv) {
        block.textContent = '';
    } else {
        pins.forEach(item => item.classList.add('hidden'));
        const title = block.querySelector('div:nth-child(1)')
        const subTitle = block.querySelector('div:nth-child(2)')
        const centerLat = block.querySelector('div:nth-child(4)')
        const centerLag = block.querySelector('div:nth-child(5)')
        const apiKey = block.querySelector('div:nth-child(3)')
        const zoom = block.querySelector('div:nth-child(6)')
        zoom.classList.add('hidden');
        apiKey.classList.add('hidden');
        centerLag.classList.add('hidden');
        centerLat.classList.add('hidden');
        title.classList.add('hidden');
        subTitle.classList.add('hidden');
    }
    block.append(sectionContainer);



    await loadGoogleMaps(config.apiKey);

    const mapElement = document.getElementById('map');
    if (mapElement) {


        const map = new google.maps.Map(mapElement, {
            center: {lat: config.centerLat, lng: config.centerLng},
            zoom: config.zoom,
            styles: mapStyles,
            mapTypeControl: false,
            streetViewControl: false
        });


        const infoWindow = new google.maps.InfoWindow({
            pixelOffset: new google.maps.Size(0, -10),
        });


        let activeMarker = null;
        resultPins.forEach(pin => {
            map.addListener("click", () => {
                infoWindow.close();
                if (activeMarker) {
                    activeMarker.setIcon(defaultMarker);
                    activeMarker = null;
                }
            });
            const defaultMarker = {
                path: 'M20.49 16.5658C21.4497 14.933 22 13.0308 22 11C22 4.92487 17.0751 0 11 0C4.92487 0 0 4.92487 0 11C0 13.0308 0.550314 14.933 1.50995 16.5658L11 33.7952L20.49 16.5658ZM15.6386 10.8675C15.6386 13.4293 13.5618 15.506 11 15.506C8.4382 15.506 6.36145 13.4293 6.36145 10.8675C6.36145 8.30568 8.4382 6.22893 11 6.22893C13.5618 6.22893 15.6386 8.30568 15.6386 10.8675Z',
                fillColor: '#009BAC',
                fillOpacity: 1,
                strokeWeight: 0,
                rotation: 0,
                scale: 1,
                anchor: new google.maps.Point(11, 34),
            };


            const marker = new google.maps.Marker({
                position: {lat: Number(pin.latitude), lng: Number(pin.longitude)},
                map: map,
                title: pin.title,
                icon: defaultMarker
            });

            const contentString = `
              <div class="p-4 flex flex-col min-w-72 gap-2">
                <h3 class="text-xl lg:text-2xl font-semibold">${pin.title}</h3>
                <div class="border-t border-t-black/90"></div>
                <p class="font-medium text-base lg:text-lg">${pin.description}</p>
                <div class="flex mt-2 items-center justify-between">
                  <a href="${pin.linkURL}" class="text-lg font-medium text-primary outline-0 border-none flex items-center gap-2">${pin.linkText}<ion-icon name="arrow-forward-outline"></ion-icon></a>
                  <div class="flex gap-1">
                    ${pin.label1 && `<img class="size-10" src="${pin.label1}" alt=""/>`}
                    ${pin.label2 && `<img class="size-10" src="${pin.label2}" alt=""/>`}
                    ${pin.label3 && `<img class="size-10" src="${pin.label3}" alt=""/>`}
                  </div>
                </div>
              </div>
            `;



            marker.addListener("click", (event) => {
                if (activeMarker && activeMarker !== marker) {
                    activeMarker.setIcon(defaultMarker);
                }
                activeMarker = marker;
                marker.setIcon({
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Group 31"><circle id="Ellipse 6" cx="17" cy="17" r="5" fill="#009BAC"/><circle id="Ellipse 7" opacity="0.2" cx="17" cy="17" r="17" fill="#009BAC"/></g></svg>'),
                    anchor: new google.maps.Point(17, 30)
                });
                infoWindow.setContent(contentString);
                infoWindow.open(map, marker);
            });
        });

    }
}

