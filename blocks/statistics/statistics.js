export default async function decorate(block) {
  const titleSection = block.querySelector(':scope > div:nth-child(1) p')?.textContent || '';

  const imageStat1 = block.querySelector(':scope > div:nth-child(2) img')?.src || '';
  const valueStat1 = block.querySelector(':scope > div:nth-child(3) p')?.textContent || '';
  const descriptionStat1 = block.querySelector(':scope > div:nth-child(4) p')?.textContent || '';

  const imageStat2 = block.querySelector(':scope > div:nth-child(5) img')?.src || '';
  const valueStat2 = block.querySelector(':scope > div:nth-child(6) p')?.textContent || '';
  const descriptionStat2 = block.querySelector(':scope > div:nth-child(7) p')?.textContent || '';

  const imageStat3 = block.querySelector(':scope > div:nth-child(8) img')?.src || '';
  const valueStat3 = block.querySelector(':scope > div:nth-child(9) p')?.textContent || '';
  const descriptionStat3 = block.querySelector(':scope > div:nth-child(10) p')?.textContent || '';

  const containerSection = document.createElement('section');
  containerSection.className = 'bg-secondary flex flex-col items-center justify-center py-8 lg:gap-20 lg:py-40';

  const reverse = false;

  containerSection.innerHTML = `
    <div class="relative w-full">
      <h2 class="hidden w-full px-16 text-start text-7xl font-semibold text-white uppercase lg:block">
        ${titleSection}
      </h2>
      <div class="hidden w-8/12 border-t-[3px] border-t-white lg:block"></div>
    </div>

    <!-- STATS CONTAINER -->
    <div class="small-layout-padding w-full text-white lg:!gap-52">

      <!-- STAT 1 -->
      <div
          class="flex flex-col-reverse items-center justify-between ${reverse ? 'lg:flex-row' : 'lg:flex-row-reverse'}"
        >
          <div
            class="relative z-10 flex w-full -translate-y-8 flex-col gap-2 lg:w-full lg:-translate-y-[23.5px] xl:-translate-y-[47.5px] ${reverse ? 'items-start' : 'items-end'}"
          >
            <h5
              class="text-start text-5xl font-semibold lg:text-7xl xl:text-9xl"
            >
              ${valueStat1}
            </h5>
            <div class="flex w-full ${reverse ? 'justify-end' : 'justify-start'}">
              <div
                class="hidden w-0 border-t-[3px] bg-white transition-all duration-500 ease-in-out lg:block"
                id="progressBar"
              ></div>
            </div>
            <div class="block w-full border-t-2 border-t-white lg:hidden"></div>
            <p class="text-start text-sm !font-semibold lg:text-xl xl:text-3xl">
              ${descriptionStat1}
            </p>
          </div>
          <div>
            <div class="rounded-full p-1" id="progressRing">
              <div
                class="bg-secondary flex h-full w-full items-center justify-center rounded-full text-xl text-white"
              >
                <div class="size-48 bg-transparent p-4 lg:size-64 xl:size-80">
                  <img
                    class="h-full w-full rounded-full"
                    src="${imageStat1}"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        

      <!-- STAT 2 -->
      <div class="flex flex-col-reverse items-center justify-between lg:flex-row-reverse">
        <div class="z-10 flex -translate-y-8 flex-col gap-2 lg:translate-y-0">
          <h5 class="text-start text-5xl font-semibold lg:text-7xl xl:text-9xl">
            ${valueStat2}
          </h5>
          <div class="hidden w-full border-t-[3px] border-t-white lg:block"></div>
          <div class="block w-full border-t-2 border-t-white lg:hidden"></div>
          <p class="text-start text-sm !font-semibold lg:text-xl xl:text-3xl">
            ${descriptionStat2}
          </p>
        </div>
        <div>
          <div class="relative flex items-center justify-center">
            <img
              class="size-48 object-cover rounded-full lg:size-64 xl:size-80"
              src="${imageStat2}"
              alt=""
            />
          </div>
        </div>
      </div>

      <!-- STAT 3 -->
      <div class="flex flex-col-reverse items-center justify-between lg:flex-row">
        <div class="z-10 flex -translate-y-8 flex-col gap-2 lg:translate-y-0">
          <h5 class="text-start text-5xl font-semibold lg:text-7xl xl:text-9xl">
            ${valueStat3}
          </h5>
          <div class="hidden w-full border-t-[3px] border-t-white lg:block"></div>
          <div class="block w-full border-t-2 border-t-white lg:hidden"></div>
          <p class="text-start text-sm !font-semibold lg:text-xl xl:text-3xl">
            ${descriptionStat3}
          </p>
        </div>
        <div>
          <div class="relative flex items-center justify-center">
            <img
              class="size-48 object-cover rounded-full lg:size-64 xl:size-80"
              src="${imageStat3}"
              alt=""
            />
          </div>
        </div>
      </div>

    </div>
  `;

  let progress = 0;
  const target = 25; // always 25%

  const ring = containerSection.querySelectorAll('#progressRing');
  const bar = containerSection.querySelectorAll('#progressBar');
  const total = 100;

  const interval = setInterval(() => {
    progress += 1;
    const remaining = total - progress;

    // Progress Bar Logic
    bar.forEach((item) => {
      if (progress === 25) {
        item.style.width = `100%`;
      }
    });

    // Progress Ring Logic
    if (window.innerWidth >= 1024) {
      ring.forEach((item) => {
        if (reverse) {
          item.style.background = `conic-gradient(from 0deg, #00000000 0%, #00000000 ${remaining}%, #ffffff ${remaining}%, #ffffff 100%)`;
        } else {
          item.style.background = `conic-gradient(from 0deg, #ffffff 0%, #ffffff ${progress}%, #00000000 ${progress}%, #00000000 100%)`;
        }
      });
    }

    // Termination condition:
    if (progress >= target) {
      clearInterval(interval);
    }
  }, 20);

  const aemEnv = block.getAttribute('data-aue-resource');
  if (!aemEnv) {
    block.textContent = '';
    block.append(containerSection);
  } else {
    block.append(containerSection);
    block.querySelectorAll(':scope > div:nth-child(n+1) div')
      .classList
      .add('hidden');
  }

}
