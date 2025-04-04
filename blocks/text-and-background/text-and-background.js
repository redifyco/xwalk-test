import {isEditorMode} from "../../scripts/utils.js";

export default async function decorate(block) {
  const inEditorMode = isEditorMode();
  const backgroundImage = block.querySelector('div:first-child picture img') || '';
  const titleHTML = block.querySelector('div:nth-child(2) div').innerHTML || '';
  const descriptionHTML = block.querySelector('div:nth-child(3) div').innerHTML;
  const buttonHTML = block.querySelector('div:nth-child(4) div p').innerHTML;


  block.textContent = '';

  /*SECTION*/
  const section = document.createElement('section');
  section.className = 'bg-no-repeat bg-cover flex justify-end lg:justify-center bg-center px-4 lg:px-40 xl:px-64 2xl:px-80 py-40'
  section.style.backgroundImage = `url(${backgroundImage.src})`;


  /*CONTAINER TITLE*/
  const containerTitle = document.createElement('div');
  containerTitle.className = 'text-6xl w-full lg:text-8xl uppercase'
  containerTitle.innerHTML = titleHTML

  /*CONTAINER DESCRIPTION + BUTTON*/
  const containerDescription = document.createElement('div');
  containerDescription.className = 'lg:translate-y-20 flex flex-col gap-10 lg:text-xl'
  containerDescription.innerHTML = descriptionHTML + buttonHTML;


  /*CONTAINER TEXT*/
  const containerText = document.createElement('div');
  containerText.className = 'text-end h-full lg:gap-32 w-2/3 lg:w-full gap-16  lg:text-start text-white justify-center lg:flex-row flex-col flex items-center'
  containerText.appendChild(containerTitle)
  containerText.appendChild(containerDescription)

  section.appendChild(containerText)


  block.appendChild(section);
}
