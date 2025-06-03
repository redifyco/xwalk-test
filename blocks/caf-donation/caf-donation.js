export default function decorate(block) {
    console.log('block', block);

    const containerSection = document.createElement('section');
    containerSection.className = ''
    containerSection.innerHTML = `
    <div>
    ciao
    </div>
    `

    // block.append(containerSection);

}
