export default function decorate(block) {
    console.log('block', block)

    block.append(`<div>ciao questo è la header block</div>`)
}
