export default function decorate(block) {
    const title = block.querySelector(':scope > div:nth-child(1) p')?.textContent
    const teams = block.querySelectorAll(':scope > div:nth-child(n+2) div')
    const processedTeams = processDivsToObject(teams)

    const containerSection = document.createElement('section');
    containerSection.className = 'container-layout-padding';

    containerSection.innerHTML = `
      <div class="w-full flex gap-8 items-end">
          <span class="text-2xl font-semibold w-fit text-black lg:text-5xl">${title}</span>
          <div class="bg-black h-[0.5px] flex-grow"></div>
      </div>
      <div class="px-14 py-14">
          ${processedTeams.length > 0 ? processedTeams.map(team => `
              <div class="flex justify-end flex-col h-[450px] w-[330px] relative bg-center bg-cover" style="background-image: url('${team.image}')">
                  <div class="bg-black/10 absolute inset-0"></div>
                  <div class="p-2 z-10 flex flex-col gap-2 text-white">
                      <h5 class="border-b font-semibold text-3xl w-full">${team.title}</h5>
                      <p class="font-light text-lg">${team.description}</p>
                  </div>
              </div>
          `).join('') : ''}    
      </div> 
  `

    const aemEnv = block.getAttribute('data-aue-resource');
    if (!aemEnv) {
        block.textContent = '';
        block.append(containerSection);
    } else {
        block.querySelectorAll(':scope > div:nth-child(n+1)').forEach(div => div.classList.add('hidden'));
        block.append(containerSection);
    }
}


function processDivsToObject(divs) {
    const result = [];

    // Process the divs in groups of 3
    for (let i = 0; i < divs.length; i += 3) {
        const imageDiv = divs[i];
        const titleDiv = divs[i + 1];
        const descriptionDiv = divs[i + 2];

        const image = imageDiv?.querySelector('img')?.getAttribute('src') || '';
        const title = titleDiv?.textContent.trim() || 'Untitled';
        const description = descriptionDiv?.textContent.trim() || null;

        result.push({
            image,
            title,
            description,
        });
    }

    return result;
}
