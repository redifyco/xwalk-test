import '../../scripts/customTag.js';
import { buildHeight, returnBoolean } from '../../scripts/utils.js';

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
        <div id="statistics-title" class="relative opacity-0 -translate-x-10 transition-all duration-700 prose-em:font-joyful prose-em:not-italic prose-em:text-7xl lg:prose-em:text-8xl block px-4 text-center text-3xl font-semibold lg:px-16 lg:text-start lg:text-6xl 2xl:text-7xl ${isWhiteText ? 'text-white' : 'text-primary'}">
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
            <div class="flex flex-col items-center max-w-64 lg:max-w-none h-fit lg:items-end lg:flex-row lg:gap-6 ${isWhiteText ? 'text-white' : 'text-primary'}">
              <h6 class="text-6xl md:text-7xl leading-tight font-semibold 2xl:text-9xl 2xl:leading-24">
                <span class="stat-value" data-value="${item.value || 0}">0</span>${item.unit || ''}
              </h6>
              <span class="w-full text-center lg:-translate-y-5 lg:text-start lg:max-w-lg text-base 2xl:text-3xl ${isWhiteText ? 'text-white' : 'text-black'}">
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

// Animate numbers for statistics when section enters viewport
  const animateStats = () => {
    const statValues = containerSection.querySelectorAll('.stat-value');
    statValues.forEach((el) => {
      const endValue = Number(el.dataset.value) || 0;
      const duration = 1000; // ms
      const frameRate = 30;
      const totalFrames = Math.round(duration / (1000 / frameRate));
      let frame = 0;

      const counter = setInterval(() => {
        frame++;
        const progress = Math.min(frame / totalFrames, 1);
        // Show decimals if endValue is not an integer
        const value = Number.isInteger(endValue)
          ? Math.floor(progress * endValue)
          : (progress * endValue).toFixed(1);
        el.textContent = value;
        if (progress === 1) clearInterval(counter);
      }, 1000 / frameRate);
    });
  };

  const statsObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStats();
          obs.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );
  statsObserver.observe(containerSection);

  // Animate title when section enters viewport
  const titleEl = containerSection.querySelector('#statistics-title');
  if (titleEl) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            titleEl.classList.remove('opacity-0', '-translate-x-10');
            titleEl.classList.add('opacity-100', 'translate-x-0');
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(titleEl);
  }

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

function processDivsToObjectStatisticsData(divs) {
  const result = [];

  for (let i = 0; i < divs.length; i += 3) {
    const valueDiv = divs[i];
    const unitDiv = divs[i + 1];
    const labelDiv = divs[i + 2];

    const value = Number(valueDiv.querySelector('div p')?.textContent) || 0;
    const unit = unitDiv.querySelector('div p')?.textContent || '';
    const label = labelDiv.querySelector('div p')?.textContent || 'No label';

    result.push({
      value,
      unit,
      label,
    });
  }

  return result;
}
