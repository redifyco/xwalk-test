import { buildHeight } from '../../scripts/utils.js';
import '../../scripts/customTag.js';

export default function decorate(block) {
  const title = block.querySelector(':scope > div:nth-child(1) div')?.innerHTML;
  const subtitle = block.querySelector(':scope > div:nth-child(2) div')?.innerHTML;
  const buttonText = block.querySelector(':scope > div:nth-child(3) div a')?.textContent;
  const buttonLink = block.querySelector(':scope > div:nth-child(3) div a')?.href;
  const mobileHeight = block.querySelector(':scope > div:nth-child(4) div')?.textContent || '800';
  const desktopHeight = block.querySelector(':scope > div:nth-child(5) div')?.textContent || '1000';
  const items = block.querySelectorAll(':scope > div:nth-child(n+6) div');
  const resultItems = processDivsToObject(items);

  const containerSection = document.createElement('section');
  containerSection.className = `flex flex-col items-center justify-center gap-8 px-4 py-14 text-center lg:gap-16 lg:px-16 lg:py-24 ${buildHeight(mobileHeight, desktopHeight)}`;

  containerSection.innerHTML = `
      <div class="text-primary prose-em:font-joyful text-3xl uppercase lg:text-7xl">
        ${title}
      </div>
      <div class="text-sm lg:text-xl">
        ${subtitle}
      </div>
      <div class="relative w-full overflow-hidden">
        <!-- Mobile carousel -->
        <div class="flex md:hidden items-center gap-12 sm:gap-20 w-max animate-[slide_10s_linear_infinite]">
            ${[...resultItems, ...resultItems]
    .map((item) => {
      if (!item.image || !item.title || !item.link) return '';
      return `
                    <a class="flex items-center" href="${item.link}">
                      <img class="object-contain h-20 sm:h-32 w-auto bg-contain" src="${item.image}" alt="${item.title}" />
                    </a>`;
    })
    .join('')}
        </div>
        <!-- Desktop carousel -->
        <div id="desktop-carousel" class="hidden md:flex gap-10 py-20 justify-center">
            ${resultItems
    .map((item, index) => {
      if (!item.image || !item.title || !item.link) return '';
      const translation = index % 2 === 0 ? 'translate-y-0 hover:-translate-y-8' : '-translate-y-20 hover:-translate-y-8';
      // Add transition class and initial transform class
      return `
                    <a class="size-48 flex ${translation} opacity-0 translate-y-20 transition-all duration-700 ease-out carousel-item" 
                       style="transition-delay: ${index * 100}ms" 
                       href="${item.link}">
                      <img class="object-contain h-48 w-auto bg-contain" src="${item.image}" alt="${item.title}" />
                    </a>`;
    })
    .join('')}
        </div>
      </div>
      ${buttonText && buttonLink ? `
      <custom-link href="${buttonLink}">
        ${buttonText}
      </custom-link>
      ` : ''}
    `;

  // Replace the hover event with Intersection Observer
  const desktopCarousel = containerSection.querySelector('#desktop-carousel');

  // Create and configure the Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // When carousel is visible, animate in each item
        const items = desktopCarousel.querySelectorAll('.carousel-item');
        items.forEach(item => {
          item.classList.remove('opacity-0', 'translate-y-20');
        });

        // Disconnect observer after animation is triggered
        observer.disconnect();
      }
    });
  }, { threshold: 1 }); // Trigger when 20% of the element is visible

  // Start observing the carousel
  observer.observe(desktopCarousel);

  const aemEnv = block.getAttribute('data-aue-resource');
  if (!aemEnv) {
    block.textContent = '';
    block.append(containerSection);
  } else {
    block.querySelectorAll(':scope > div:nth-child(n+1) div')
      .forEach(item => item.classList.add('hidden'));
    block.append(containerSection);
  }

  block.append(containerSection);
}

/*Logo Showcase*/
function processDivsToObject(divs) {
  const result = [];

  // Process the divs in groups of 3
  for (let i = 0; i < divs.length; i += 3) {
    const imageDiv = divs[i];
    const titleDiv = divs[i + 1];
    const linkDiv = divs[i + 2];

    const image = imageDiv?.querySelector('img')
      ?.getAttribute('src') || '';
    const title = titleDiv?.textContent.trim() || 'Untitled';
    const link = linkDiv?.textContent.trim() || null;

    result.push({
      image,
      title,
      link,
    });
  }

  return result;
}
