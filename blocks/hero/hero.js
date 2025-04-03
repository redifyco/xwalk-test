import {isEditorMode} from "../../scripts/utils.js";

console.log('isEditorMode', isEditorMode)


console.log('windows', window)
console.log('document', document)


export default async function decorate(block) {
  console.log('block', block)


  if (isEditorMode) {
    const secondDiv = [...block.children][2]
    const paragraph = [...secondDiv.children][0]
    const content = document.createElement('div')
    content.innerHTML = paragraph.innerHTML
    content.className = 'bg-orange-500 mt-64'

    console.log('block',block)
    block.textContent = ''
    block.appendChild(content)
   return
  }

  const heroDiv = document.querySelector('.hero');

  // Trova l'elemento <img> dentro il <picture>
  const imgElement = heroDiv.querySelector('picture img');
  const textElement = heroDiv.querySelector('h1').innerHTML;

  // Recupera l'URL dell'immagine
  const imageUrl = imgElement ? imgElement.src : null;

  // Clear the block content
  block.textContent = '';

  // Create the section
  const section = document.createElement('section');
  section.className = `flex flex-col bg-gray-500 bg-[url(${imageUrl})] bg-cover bg-center bg-no-repeat text-white lg:bg-[url(${imageUrl})]`;
  section.style.backgroundImage = `url(${imageUrl})`;

  // Create the first div
  const div1 = document.createElement('div');
  div1.className = 'relative h-dvh z-10 flex w-full flex-col justify-end gap-3 px-4 pb-14 lg:justify-center xl:px-16 xl:py-11';

  // Create the h1
  const h1 = document.createElement('h1');
  h1.className = 'text-5xl font-semibold uppercase lg:text-[130px] 2xl:text-8xl 2xl:text-[180px]';
  h1.innerHTML = textElement;

  div1.appendChild(h1);

  // Create the paragraph
  const p1 = document.createElement('p');
  p1.className = 'w-3/4 text-sm lg:text-xl 2xl:w-2/3 2xl:text-2xl';
  p1.textContent = '"We all have the duty to leave a better world for future generations" Capt. Gianluigi Aponte - MSC Foundation Chair';
  div1.appendChild(p1);

  // Create the second div
  const div2 = document.createElement('div');
  div2.className = 'hidden h-dvh w-full items-center justify-between px-40 lg:flex lg:gap-20 xl:px-64 2xl:gap-64 2xl:px-80';

  // Create the h2
  const h2 = document.createElement('h2');
  h2.className = 'w-full text-6xl text-white uppercase lg:text-8xl xl:text-9xl';
  h2.innerHTML = "What <span class='font-joyful-lg lowercase'>drives</span> us";
  div2.appendChild(h2);

  // Create the content div
  const contentDiv = document.createElement('div');
  contentDiv.className = 'mt-64 flex w-9/12 flex-col gap-3 lg:gap-10 2xl:gap-16';

  // Create the paragraph
  const p2 = document.createElement('p');
  p2.className = 'text-white';
  p2.textContent = 'The ocean is life, it’s culture, it’s the heartbeat of communities worldwide. At the MSC Foundation, we work to safeguard and empower this vital connection, ensuring a thriving future for both people and the blue planet.';
  contentDiv.appendChild(p2);

  // Create the button
  const button = document.createElement('button');
  button.className = 'group relative inline-block w-fit p-2';
  button.innerHTML = `
  <span class="button-line-absolute-white -top-1 -right-1 h-0.5 w-6/12 group-hover:w-9/12"></span>
  <span class="button-line-absolute-white -top-1 -right-1 h-full w-0.5 group-hover:h-9/12"></span>
  <span class="button-line-absolute-white -bottom-1 -left-1 h-0.5 w-6/12 group-hover:w-9/12"></span>
  <span class="button-line-absolute-white -bottom-1 -left-1 h-full w-0.5 group-hover:h-9/12"></span>
  <span class="px-4 py-2 text-white">Learn more About Us</span>
`;
  contentDiv.appendChild(button);
  div2.appendChild(contentDiv);

  // Append everything to the section
  section.appendChild(div1);
  section.appendChild(div2);

  block.appendChild(section);
}
