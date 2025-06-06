export default function decorate(block) {
    const aemEnv = block.getAttribute('data-aue-resource');
    const title = block.querySelector(':scope > div:nth-child(1) p')?.textContent
    const teams = block.querySelectorAll(':scope > div:nth-child(n+2) div')
    const processedTeams = processDivsToObject(teams, aemEnv)

    const containerSection = document.createElement('section');
    containerSection.className = 'container-layout-padding';

    containerSection.innerHTML = `
      <div class="w-full flex gap-8 items-end">
          <span class="text-2xl font-semibold w-fit text-black lg:text-5xl">${title}</span>
          <div class="bg-black h-[0.5px] flex-grow"></div>
      </div>
      <div class="md:px-14 flex gap-8 overflow-y-scroll justify-start lg:justify-center md:flex-wrap md:overflow-hidden py-14">
          ${processedTeams.length > 0 ? processedTeams.map((team, index) => `
              <button data-index="${index}" id="open-popup" class="flex justify-end text-start flex-col h-[350px] lg:h-[450px] min-w-[250px] w-[250px] lg:min-w-[330px] lg:w-[330px] relative bg-center bg-cover" style="background-image: url('${team.image}')">
                  <div class="bg-black/10 absolute inset-0"></div>
                  <div class="p-2 z-10 flex flex-col gap-2 text-white">
                      <h5 class="border-b font-semibold text-xl lg:text-3xl w-full">${team.title}</h5>
                      <p class="font-light text-base lg:text-lg">${team.smallDescr}</p>
                  </div>
              </button>
          `).join('') : ''}    
      </div>
      <div id="popup" class="hidden">${RenderPopUp()}</div> 
  `


    containerSection.querySelectorAll('#open-popup').forEach(button => button.addEventListener('click', (e) => {
            const index = e.currentTarget.getAttribute('data-index');
            const team = processedTeams[index];
            containerSection.querySelector('#popup').classList.toggle('hidden');
            containerSection.querySelector('#long-descr').innerHTML = team.longDescr
            containerSection.querySelector('#main-title').textContent = team.title
        })
    )

    containerSection.querySelector('#close-button-popup').addEventListener('click', () => {
        containerSection.querySelector('#popup').classList.toggle('hidden');
    })


    if (!aemEnv) {
        block.textContent = '';
        block.append(containerSection);
    } else {
        block.querySelectorAll(':scope > div:nth-child(n+1)').forEach(div => div.classList.add('hidden'));
        block.append(containerSection);
    }
}


const RenderPopUp = () => {
    return `
    <div class="fixed flex items-center justify-center inset-0 top-0 left-0 h-full bg-black/30 z-30 w-full py-14 px-4 lg:py-32 lg:px-32">
            <div class="bg-white w-full shadow relative max-h-[90vh] overflow-scroll flex flex-col gap-4 lg:gap-8 p-10 rounded-lg">
                <h5 class="lg:text-5xl text-2xl mt-10 lg:mt-0 border-b w-full pb-1 lg:pb-3" id="main-title"></h5>
                <div class="font-light" id="long-descr"></div>
                <button class="text-primary cursor-pointer absolute right-8 top-4" id="close-button-popup">
                    <ion-icon class="text-5xl" name="close-outline"></ion-icon>
                </button>
            </div>
        </div>
    `
}


function processDivsToObject(divs, aemEnv) {
    const result = [];

    // Process the divs in groups of 3
    for (let i = 0; i < divs.length; i += aemEnv ? 5 : 4) {
        const imageDiv = divs[i];
        const titleDiv = divs[i + 1];
        const smallDescrDiv = divs[i + 2];
        const longDescrDiv = divs[i + 3];

        const image = imageDiv?.querySelector('img')?.getAttribute('src') || '';
        const title = titleDiv?.textContent.trim() || 'Untitled';
        const smallDescr = smallDescrDiv?.textContent
        const longDescr = longDescrDiv?.innerHTML

        result.push({
            image,
            title,
            smallDescr,
            longDescr
        });
    }

    return result;
}
