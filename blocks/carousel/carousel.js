
export default function decorate(block) {
    console.log('block', block)
   block.textContent = ''
    const test = document.createElement('div')
    test.innerHTML = `<p>test</p>`
    block.append(test)
}
