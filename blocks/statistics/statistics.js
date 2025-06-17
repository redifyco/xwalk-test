export default async function decorate(block) {
  const titleSection = block.querySelector(':scope > div:nth-child(1)')?.innerHTML || '';
  const items = block.querySelectorAll(':scope > div:nth-child(n+2) div');
  const resultItems = processDivsToObject(items);

  console.log('block', block);
  console.log('resultItems', resultItems);

  const containerSection = document.createElement('section');
  containerSection.className = 'bg-secondary flex flex-col items-center justify-center py-8 lg:gap-20 lg:py-40';

  containerSection.innerHTML = `
    <div class="relative w-full">
      <div class="hidden prose-em:font-joyful prose-em:mx-2 prose-em:not-italic prose-em:text-8xl w-full px-16 text-start text-7xl font-semibold text-white uppercase lg:block">
        ${titleSection}
      </div>
      <div class="hidden w-8/12 border-t-[3px] border-t-white lg:block"></div>
    </div>

    <!-- STATS CONTAINER -->
    <div class=" w-full text-white mt-20">

      ${resultItems.length > 0 ? resultItems.map((item, index) => {

      return `
      <div
      id="stat-container"
      data-reverse="${item.inverted}"
          class="flex py-2 md:py-10 flex-col-reverse items-center justify-between px-14 ${item.inverted ? 'md:flex-row' : 'md:flex-row-reverse'}"
        >
          <div
            class="relative z-10 flex w-full max-w-60 md:max-w-none -translate-y-10 flex-col md:gap-2 md:w-full md:-translate-y-[5.5px] lg:-translate-y-[9.5px] xl:-translate-y-[29.5px] ${item.inverted ? 'items-start' : 'items-end'}"
          >
            <h5
              class="text-start text-5xl font-semibold lg:text-7xl xl:text-9xl"
            >
              ${item.value}
            </h5>
            <div class="flex w-full ${item.inverted ? 'justify-end' : 'justify-start'}">
              <div
                class="hidden w-0 border-t-[3px] bg-white transition-all duration-500 ease-in-out md:block"
                id="progressBar"
              ></div>
            </div>
            <div class="block w-full border-t-2 border-t-white md:hidden"></div>
            <p class="text-start overflow-hidden h-10 lg:h-14 xl:h-[72px]  text-sm  !font-semibold lg:text-xl xl:text-3xl">
              ${item.description || ''}
            </p>
          </div>
          <div>
            <div class="rounded-full md:p-1" id="progressRing">
              <div
                class="bg-secondary flex h-full w-full items-center justify-center rounded-full text-xl text-white"
              >
                <div class="bg-transparent p-4 size-60 lg:size-64 xl:size-80">
                  <img
                    class="h-full w-full object-cover object-center rounded-full"
                    src="${item.image}"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  )
    .join('') : ''}
    </div>
  `;

  const ring = containerSection.querySelectorAll('#progressRing');
  const bar = containerSection.querySelectorAll('#progressBar');
  const reversedElements = containerSection.querySelectorAll('#stat-container');
  let progress = 0;
  const total = 100;

  let observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
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
        if (window.innerWidth >= 772) {
          ring.forEach((item, index) => {
            if (reversedElements[index]) {
              const isReversed = reversedElements[index].getAttribute('data-reverse') === 'true';
              console.log('isReversed', isReversed);
              if (isReversed) {
                item.style.background = `conic-gradient(from 0deg, #00000000 0%, #00000000 ${remaining}%, #ffffff ${remaining}%, #ffffff 100%)`;
              } else {
                item.style.background = `conic-gradient(from 0deg, #ffffff 0%, #ffffff ${progress}%, #00000000 ${progress}%, #00000000 100%)`;
              }
            }
          });
        }

        // Termination condition:
        if (progress >= 25) {
          clearInterval(interval);
          observer.disconnect();
        }
      }, 20);
    }
  });

  observer.observe(containerSection);

  const aemEnv = block.getAttribute('data-aue-resource');
  if (!aemEnv) {
    block.textContent = '';
    block.append(containerSection);
  } else {
    block.append(containerSection);
    block.querySelectorAll(':scope > div:nth-child(n+1) div')
      .forEach((div) => {
        div.classList.add('hidden');
      });
  }

}

/*Statistics Items*/
function processDivsToObject(divs) {
  const result = [];

  // Process the divs in groups of 3
  for (let i = 0; i < divs.length; i += 4) {
    const invertedDiv = divs[i];
    const imageDiv = divs[i + 1];
    const valueDiv = divs[i + 2];
    const descriptionDiv = divs[i + 3];

    const inverted = invertedDiv?.textContent === 'true';
    const image = imageDiv?.querySelector('img')
      ?.getAttribute('src') || '';
    const value = valueDiv?.textContent.trim() || 'Untitled';
    const description = descriptionDiv?.textContent.trim() || null;

    result.push({
      inverted,
      image,
      value,
      description
    });
  }

  return result;
}
