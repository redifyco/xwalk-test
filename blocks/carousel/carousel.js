import { processDivsToObjectCarousel } from "../../scripts/utils.js";

export default async function decorate(block) {
    let currentIndex = 0;
    const carouselItems = block.querySelectorAll(':scope > div');
    const result = processDivsToObjectCarousel(carouselItems);

    const updateCarousel = (index) => {
        const carouselDiv = document.getElementById('carousel-div');
        const carouselTitle = document.getElementById('carousel-title');
        const carouselDescription = document.getElementById('carousel-description');
        const carouselButton = document.getElementById('carousel-button');

        carouselDiv.style.backgroundImage = `url('${result[index].image}')`;
        carouselTitle.textContent = result[index].title;
        carouselDescription.textContent = result[index].description;
        carouselButton.textContent = result[index].buttonText;
        carouselButton.href = result[index].buttonLink;
    };

    const nextButton = () => {
        currentIndex = (currentIndex + 1) % result.length;
        updateCarousel(currentIndex);
    };

    const previousButton = () => {
        currentIndex = (currentIndex - 1 + result.length) % result.length;
        updateCarousel(currentIndex);
    };

    const containerSection = document.createElement('section');
    containerSection.className = 'small-layout-padding';

    containerSection.innerHTML = `
    <div
      id="carousel-div"
      style="background-image: url('${result[currentIndex].image}');"
      class="relative opacity-100 transition-opacity duration-500 flex h-[600px] flex-col justify-end gap-2 bg-cover bg-center px-2 py-10 shadow-lg lg:gap-4 lg:px-20"
    >
      <button
        id="previous-button"
        class="bg-secondary absolute top-1/2 -left-3 flex size-20 items-center justify-center lg:-left-10 lg:size-30"
      >
        <ion-icon name="chevron-back-outline" size="large" class="text-white"></ion-icon>
      </button>
      <button
        id="next-button"
        class="bg-secondary absolute top-1/2 -right-3 flex size-20 items-center justify-center lg:-right-10 lg:size-30"
      >
        <ion-icon name="chevron-forward-outline" size="large" class="text-white"></ion-icon>
      </button>
      <h6
        id="carousel-title"
        class="text-sm font-semibold text-white lg:px-8 lg:text-4xl"
      >
        ${result[currentIndex].title}
      </h6>
      <div class="w-full border-t-2 border-t-white"></div>
      <div
        class="flex flex-col items-start justify-between gap-4 text-white lg:flex-row lg:items-center lg:px-8"
      >
        <p
          id="carousel-description"
          class="w-9/12 text-sm lg:text-xl"
        >
          ${result[currentIndex].description}
        </p>
        <a href="${result[currentIndex].buttonLink}" id="carousel-button" class="flex items-center gap-2 text-sm lg:text-xl">
          ${result[currentIndex].buttonText}
          <ion-icon name="arrow-forward-outline"></ion-icon>
        </a>
      </div>
    </div>
  `;

    containerSection
        .querySelector('#next-button')
        .addEventListener('click', nextButton);

    containerSection
        .querySelector('#previous-button')
        .addEventListener('click', previousButton);

    block.textContent = '';
    block.append(containerSection);
}
