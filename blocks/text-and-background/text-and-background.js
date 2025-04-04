import {isEditorMode} from "../../scripts/utils.js";

export default async function decorate(block) {
  const inEditorMode = isEditorMode();
  const isMobile = window.innerWidth < 1200
  const backgroundImage = block.querySelector('div:first-child picture img') || ''
  const titleHTML = block.querySelector('div:nth-child(2) div').innerHTML || '';
  const descriptionHTML = block.querySelector('div:nth-child(3) div').innerHTML;
  const buttonHTML = block.querySelector('div:nth-child(4) div p a');
  console.log('backgroundImage', backgroundImage.src)


  block.textContent = ''




  /*DESKTOP*/
  const desktopSection = document.createElement('section');
  const dynamicTextColor = backgroundImage.src ? 'text-white' : 'text-current';
  desktopSection.className = `bg-no-repeat bg-cover px-40 py-40 gap-16 flex justify-center items-center relative ${dynamicTextColor}`;
  desktopSection.style.backgroundImage = `url(${backgroundImage.src})`;

  const containerTitle = document.createElement('div');
  containerTitle.className = 'w-1/2 uppercase text-6xl'
  containerTitle.innerHTML = titleHTML
  desktopSection.appendChild(containerTitle)

  const containerDescription = document.createElement('div')
  containerDescription.className = 'flex flex-col translate-y-20 gap-4'
  containerDescription.innerHTML = descriptionHTML
  containerDescription.appendChild(buttonHTML)
  desktopSection.appendChild(containerDescription)


  /*MOBILE*/

  const mobileSection = document.createElement('section');
  mobileSection.innerHTML = '<h1>mobile</h1>'



  isMobile ? block.appendChild(mobileSection) : block.appendChild(desktopSection)

}
