import { processDivsToObjectCarousel } from "../../scripts/utils.js";

export default function decorate(block) {
    // Default values defined at the beginning of the function
    const defaults = {
        image: '/content/dam/mscfoundation/placeholders/carousel-placeholder.jpg',
        title: 'Carousel Title',
        description: 'Carousel content description',
        buttonText: 'Learn More',
        buttonLink: '#',
        fallbackImageStyle: 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);' // Fallback gradient
    };

    let currentIndex = 0;
    const carouselItems = block.querySelectorAll(':scope > div');
    const rawResult = processDivsToObjectCarousel(carouselItems) || [];
    
    // Process data with robust default values
    const result = rawResult.length > 0 ? rawResult.map(item => ({
        image: item?.image?.trim() || defaults.image,
        title: item?.title?.trim() || defaults.title,
        description: item?.description?.trim() || defaults.description,
        buttonText: item?.buttonText?.trim() || defaults.buttonText,
        buttonLink: item?.buttonLink?.trim() || defaults.buttonLink
    })) : [{
        // Fallback if there are no elements in the carousel
        image: defaults.image,
        title: defaults.title,
        description: defaults.description,
        buttonText: defaults.buttonText,
        buttonLink: defaults.buttonLink
    }];

    // Function to get a safe item with fallback
    const getSafeItem = (index) => {
        if (!result || result.length === 0) {
            return {
                image: defaults.image,
                title: defaults.title,
                description: defaults.description,
                buttonText: defaults.buttonText,
                buttonLink: defaults.buttonLink
            };
        }
        
        const safeIndex = Math.max(0, Math.min(index, result.length - 1));
        const item = result[safeIndex];
        
        return {
            image: item?.image ?? defaults.image,
            title: item?.title ?? defaults.title,
            description: item?.description ?? defaults.description,
            buttonText: item?.buttonText ?? defaults.buttonText,
            buttonLink: item?.buttonLink ?? defaults.buttonLink
        };
    };

    // Function to handle images that fail to load
    const handleImageError = (element, fallbackStyle) => {
        element.style.backgroundImage = 'none';
        element.style.cssText = element.style.cssText + fallbackStyle;
    };

    const updateCarousel = (index) => {
        const carouselDiv = document.getElementById('carousel-div');
        const carouselTitle = document.getElementById('carousel-title');
        const carouselDescription = document.getElementById('carousel-description');
        const carouselButton = document.getElementById('carousel-button');

        // Safety checks for DOM elements
        if (!carouselDiv || !carouselTitle || !carouselDescription || !carouselButton) {
            console.warn('Carousel: Some DOM elements were not found');
            return;
        }

        const safeItem = getSafeItem(index);

        // Robust background image handling
        if (safeItem.image && safeItem.image !== defaults.image) {
            // Test if the image exists before setting it
            const testImg = new Image();
            testImg.onload = () => {
                carouselDiv.style.backgroundImage = `url('${safeItem.image}')`;
            };
            testImg.onerror = () => {
                handleImageError(carouselDiv, defaults.fallbackImageStyle);
            };
            testImg.src = safeItem.image;
        } else if (safeItem.image === defaults.image) {
            // Use placeholder image
            carouselDiv.style.backgroundImage = `url('${defaults.image}')`;
        } else {
            // Use fallback gradient
            handleImageError(carouselDiv, defaults.fallbackImageStyle);
        }

        // Safe text content update
        carouselTitle.textContent = safeItem.title;
        carouselDescription.textContent = safeItem.description;
        carouselButton.textContent = safeItem.buttonText;
        
        // Safe link handling
        if (safeItem.buttonLink && safeItem.buttonLink !== '#') {
            carouselButton.href = safeItem.buttonLink;
            carouselButton.style.pointerEvents = 'auto';
            carouselButton.style.opacity = '1';
        } else {
            carouselButton.href = '#';
            carouselButton.style.pointerEvents = 'none';
            carouselButton.style.opacity = '0.6';
        }
    };

    const nextButton = () => {
        if (result.length === 0) return;
        currentIndex = (currentIndex + 1) % result.length;
        updateCarousel(currentIndex);
    };

    const previousButton = () => {
        if (result.length === 0) return;
        currentIndex = (currentIndex - 1 + result.length) % result.length;
        updateCarousel(currentIndex);
    };

    const containerSection = document.createElement('section');
    containerSection.className = 'small-layout-padding';

    // Get current item safely for initial HTML generation
    const currentItem = getSafeItem(currentIndex);

    // Function to generate background image style safely
    const getBackgroundImageStyle = (imageUrl) => {
        if (!imageUrl || imageUrl.trim() === '') {
            return defaults.fallbackImageStyle;
        }
        return `background-image: url('${imageUrl}')`;
    };

    containerSection.innerHTML = `
    <div
      ${getBackgroundImageStyle(currentItem.image)}
      id="carousel-div"
      class="relative opacity-100 transition-opacity duration-500 flex h-[600px] flex-col justify-end gap-2 bg-cover bg-center px-2 py-10 shadow-lg lg:gap-4 lg:px-20"
    >
      <button
        id="previous-button"
        class="bg-secondary cursor-pointer absolute top-1/2 -left-3 flex size-20 items-center justify-center lg:-left-10 lg:size-30"
        ${result.length <= 1 ? 'style="display: none;"' : ''}
      >
        <ion-icon name="chevron-back-outline" size="large" class="text-white"></ion-icon>
      </button>
      <button
        id="next-button"
        class="bg-secondary cursor-pointer absolute top-1/2 -right-3 flex size-20 items-center justify-center lg:-right-10 lg:size-30"
        ${result.length <= 1 ? 'style="display: none;"' : ''}
      >
        <ion-icon name="chevron-forward-outline" size="large" class="text-white"></ion-icon>
      </button>
      <h6
        id="carousel-title"
        class="text-sm font-semibold text-white lg:px-8 lg:text-4xl"
      >
        ${currentItem.title}
      </h6>
      <div class="w-full border-t-2 border-t-white"></div>
      <div
        class="flex flex-col items-start justify-between gap-4 text-white lg:flex-row lg:items-center lg:px-8"
      >
        <p
          id="carousel-description"
          class="w-9/12 text-sm lg:text-xl"
        >
          ${currentItem.description}
        </p>
        <a 
          href="${currentItem.buttonLink}" 
          id="carousel-button" 
          class="flex items-center gap-2 text-sm lg:text-xl ${currentItem.buttonLink === '#' ? 'pointer-events-none opacity-60' : ''}"
        >
          ${currentItem.buttonText} <ion-icon name="arrow-forward-outline"></ion-icon>
        </a>
      </div>
    </div>
  `;

    // Adding event listeners with safety checks
    const nextBtn = containerSection.querySelector('#next-button');
    const prevBtn = containerSection.querySelector('#previous-button');

    if (nextBtn) {
        nextBtn.addEventListener('click', nextButton);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', previousButton);
    }

    const aemEnv = block.getAttribute('data-aue-resource');

    if (!aemEnv) {
        block.textContent = '';
    } else {
        carouselItems.forEach(item => item.classList.add('hidden'));
    }
    
    block.append(containerSection);

    // Safe carousel initialization after elements are added to DOM
    setTimeout(() => {
        updateCarousel(currentIndex);
    }, 100);
}
