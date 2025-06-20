import '../../scripts/customTag.js'

export default function decorate(block) {
    const title = block.querySelector(':scope > div:nth-child(1) div p')?.textContent || ''
    const isLoadMoreButton = block.querySelector(':scope > div:nth-child(2) div p')?.textContent === 'true'
    const buttonText = block.querySelector(':scope > div:nth-child(3) div p')?.textContent || ''
    const buttonLink = block.querySelector(':scope > div:nth-child(4) div a')?.href || ''
    const itemsToShow = Number(block.querySelector(':scope > div:nth-child(5) div p')?.textContent) || 3
    const cardStyle = block.querySelector(':scope > div:nth-child(6) div p')?.textContent || 'primary'

    const mockCardsData = [
        {
            title: '2024 Highlights: Advancing Science and Building Pathways for Progress',
            subTitle: 'MSC FOUNDATION & MAREVIVO',
            backgroundImage: '/assets/images/marevivo-2.jpeg',
            topLabel: 'Ongoing',
            icons: ['/assets/icons/environmental.svg', '/assets/icons/education.svg'],
            date: new Date('2023-10-01'),
            href: 'https://google.com'
        },
        {
            title: 'Formentera Seagrass Restoration Programme',
            subTitle: 'MSC FOUNDATION & MISSION BLUE',
            backgroundImage: '/assets/images/education.jpeg',
            topLabel: 'Complete',
            icons: ['/assets/icons/environmental.svg', '/assets/icons/education.svg', '/assets/icons/emergency.svg'],
            date: new Date('2025-10-10'),
            href: 'https://www.stripe.com'
        }
    ]

    const sectionContainer = document.createElement('section');
    sectionContainer.className = ''

    sectionContainer.innerHTML = `
      <section class="flex flex-col items-center justify-center gap-8 container-layout-padding">
        <h2 class="text-primary text-center text-3xl uppercase lg:text-7xl">
          ${title}
        </h2>
        <!--RELATED PROGRAMMES-->
        <div 
        class="scrollbar scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-track-gray-300 flex max-w-full justify-start gap-6 overflow-x-scroll pb-5  sm:grid sm:grid-cols-2">
          ${mockCardsData.length > 0 && mockCardsData.map((item, index) => `
            <article-card 
              variant="${cardStyle}"
              subTitle="${item.subTitle || ''}" 
              title="${item.title || ''}" 
              topLabel="${item.topLabel || ''}"
              icons="${item.icons || []}"
              backgroundImage="${item.backgroundImage || ''}"
              date="${item.date || ''}"
              href="${item.href || ''}"
              >
            </article-card>
          `).join('')}
        </div>
        <!--CUSTOM BUTTON-->
        ${isLoadMoreButton ?
        `<custom-button>Load More</custom-button>`
        : `<custom-link href="${buttonLink}">${buttonText}</custom-link>`
    }
      </section>
    `

    block.textContent = ''
    block.append(sectionContainer)

}
