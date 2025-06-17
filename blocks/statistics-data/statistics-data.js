import '../../scripts/customTag.js';
import { buildHeight, processDivsToObjectStatisticsData, returnBoolean } from '../../scripts/utils.js';

export default function decorate(block) {
  const backgroundImage = block.querySelector(':scope > div:nth-child(1) img')?.src;
  const isWhiteText = returnBoolean(block, 2);
  const title = block.querySelector(':scope > div:nth-child(3) div')?.innerHTML;
  const buttonText = block.querySelector(':scope > div:nth-child(4) div p')?.textContent;
  const buttonLink = block.querySelector(':scope > div:nth-child(5) div a')?.href;
  const mobileHeight = block.querySelector(':scope > div:nth-child(6) div p')?.textContent;
  const desktopHeight = block.querySelector(':scope > div:nth-child(7) div p')?.textContent;
  const statsList = Array.from(block.querySelectorAll(':scope > div:nth-child(n+8)'));
  const JSONStatisticsData = processDivsToObjectStatisticsData(statsList);

  const containerSection = document.createElement('section');
  containerSection.className = `
    flex flex-col gap-14 bg-cover bg-center justify-center bg-no-repeat py-30
    lg:gap-40 lg:py-36 xl:gap-56 xl:py-64
  `.trim();

  // Gestione sicura dell'immagine di background
  if (backgroundImage) {
    containerSection.style.backgroundImage = `url('${backgroundImage}')`;
  }

  // Costruzione HTML sicura con controlli per valori undefined/null
  let innerHTML = '';

  // Sezione titolo - solo se presente
  if (title) {
    innerHTML += `
        <div class="flex flex-col items-center lg:items-start">
          <div class="relative prose-em:font-joyful prose-em:not-italic block px-4 text-center text-3xl font-semibold uppercase lg:px-16 lg:text-start lg:text-6xl 2xl:text-7xl ${isWhiteText ? 'text-white' : 'text-primary'}">
            ${title}
            <span class="absolute left-0 mt-5 hidden border-b-2 lg:block lg:w-[50%] xl:w-[90%] ${isWhiteText ? 'border-b-white' : 'border-b-primary'}"></span>
          </div>
        </div>`;
  }

  // Sezione statistiche e bottone - solo se ci sono dati o bottone
  if (JSONStatisticsData.length > 0 || (buttonLink && buttonText)) {
    innerHTML += `
<div id="container-statistics" class="relative  ${buildHeight(mobileHeight, desktopHeight)}">
        <div id="grid-statistics" class="grid h-fit top-52 grid-cols-2 justify-items-center gap-8 px-4 lg:justify-items-start lg:gap-24 lg:px-24 xl:gap-32 xl:px-32">`;

    // Statistiche - solo se presenti
    if (JSONStatisticsData.length > 0) {
      innerHTML += JSONStatisticsData.map((item) => `
            <div class="flex flex-col items-center h-fit lg:flex-row lg:items-end lg:gap-6 ${isWhiteText ? 'text-white' : 'text-primary'}">
              <h6 class="text-6xl md:text-7xl leading-tight font-semibold 2xl:text-9xl 2xl:leading-24">
                ${item.value || ''}
              </h6>
              <span class="w-full text-center lg:translate-y-5 lg:text-start lg:max-w-lg text-base 2xl:text-3xl ${isWhiteText ? 'text-white' : 'text-black'}">
                ${item.label || ''}
              </span>
            </div>
            `)
        .join('');
    }

    innerHTML += `</div></div>`;
  }
  // Bottone - solo se link e testo sono presenti
  if (buttonLink && buttonText) {
    innerHTML += `
            <div class="px-4 flex justify-center lg:justify-start lg:px-16 xl:px-32">
              <custom-link href="${buttonLink}" color="${isWhiteText ? 'white' : 'primary'}">${buttonText}</custom-link>
            </div>`;
  }

  containerSection.innerHTML = innerHTML;
  block.textContent = '';
  block.append(containerSection);

  const statisticsContainer = document.querySelector('#container-statistics');
  const gridStatistics = document.querySelector('#grid-statistics');

  if (statisticsContainer) {
    const handleScroll = () => {
      const rect = statisticsContainer.getBoundingClientRect();
      const gridHeight = gridStatistics.offsetHeight;
      const containerTop = rect.top + window.scrollY;
      const containerBottom = rect.bottom + window.scrollY;
      const scrollY = window.scrollY;
      const fixedTop = 200; // adjust as needed for your header

      // Remove all positioning classes/styles first
      gridStatistics.classList.remove('fixed', 'at-bottom');
      gridStatistics.style.position = '';
      gridStatistics.style.top = '';
      gridStatistics.style.bottom = '';
      gridStatistics.style.width = '';

      // Calculate when to fix and when to stick to bottom
      if (scrollY + fixedTop >= containerTop && scrollY + fixedTop + gridHeight < containerBottom) {
        // Fix the grid to the viewport
        gridStatistics.classList.add('fixed');
        gridStatistics.style.position = 'fixed';
        gridStatistics.style.top = `${fixedTop}px`;
        gridStatistics.style.width = `${statisticsContainer.offsetWidth}px`;
      } else if (scrollY + fixedTop + gridHeight >= containerBottom) {
        // Stick the grid to the bottom of the container
        gridStatistics.style.position = 'absolute';
        gridStatistics.style.top = `${rect.height - gridHeight}px`;
        gridStatistics.style.width = '100%';
      }
      // Otherwise, grid is in normal flow (at the top of the container)
    };

    window.addEventListener('scroll', handleScroll);

    // Initial check
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }
}
