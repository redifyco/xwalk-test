export default function decorate(block) {
    const threshold = 100

    const containerSection = document.createElement('section');
    const body = document.querySelector('body');
    containerSection.className = 'absolute flex items-center justify-center inset-0 top-0 left-0 h-full w-full bg-black/30 z-30';

    body.classList.add('overflow-hidden');


    containerSection.innerHTML = `
    <div class="py-32 w-full px-32">
    <div class="bg-white rounded-lg container-layout-padding">
    <div>title</div>
    <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis, cum?</div>
</div></div>
    `;
    console.log('block', block);

    block.textContent = '';
    block.append(containerSection);
}
