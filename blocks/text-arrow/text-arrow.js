export default function decorate(block) {
    const text = block.querySelector(':scope > div:nth-child(1) div')?.innerHTML || ''
    console.log('text', text)
    console.log('block', block)

    const sectionContainer = document.createElement('section');
    sectionContainer.className = 'h-full gap-8 w-full flex flex-col justify-center items-center container-layout-padding'


    sectionContainer.innerHTML = `
        <div class="font-medium text-8xl">
            ${text}
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="76" height="105" viewBox="0 0 76 105" fill="none">
            <path d="M38.5 101.855L74.416 65.9395L75.4766 67L38 104.477L37.7383 104.215L37.4766 104.477L0 67L1.06055 65.9395L37 101.879V0H38.5V101.855Z" fill="white"/>
        </svg>
    `

    // block.append(sectionContainer)


}
