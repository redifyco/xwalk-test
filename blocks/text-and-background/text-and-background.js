import {isEditorMode} from "../../scripts/utils.js";
import {createWhiteBorderButton} from "../../components/button.js";

export default async function decorate(block) {
  const inEditorMode = isEditorMode();
  const backgroundImage = block.querySelector('div:first-child picture img') || {src: 'assets/images/hero-bg.png'};
  const titleHTML = block.querySelector('div:nth-child(2) div').innerHTML || '<p>What drives us</p>';
  const descriptionHTML = block.querySelector('div:nth-child(3) div').innerHTML || '<p>The ocean is life, it’s culture, it’s the heartbeat of communities worldwide. At the MSC Foundation, we work to safeguard and empower this vital connection, ensuring a thriving future for both people and the blue planet. </p>';
  const buttonObject = block.querySelector('div:nth-child(4) div p a') || {title: 'Learn more about us', href: '#'};
  // const mobileHeight = block.querySelector('div:nth-child(5) div p') || '500'
  // const desktopHeight = block.querySelector('div:nth-child(5) div p') || '1000'

  // console.log('mobileHeightSection', mobileHeight)
  // console.log('desktopHeightSection', desktopHeight)

  block.textContent = '';

  /*SECTION*/
  const section = document.createElement('section');
  section.className = `bg-no-repeat bg-cover flex justify-end lg:justify-center bg-center px-4 lg:px-40 xl:px-64 2xl:px-80 py-40`
  section.style.backgroundImage = `url(${backgroundImage.src})`;


  /*CONTAINER TITLE*/
  const containerTitle = document.createElement('div');
  containerTitle.className = 'text-6xl w-full lg:text-8xl uppercase'
  containerTitle.innerHTML = titleHTML

  /*CONTAINER DESCRIPTION + BUTTON*/
  const containerDescription = document.createElement('div');
  containerDescription.className = 'lg:translate-y-20 flex flex-col gap-10 lg:text-xl'
  containerDescription.innerHTML = descriptionHTML;
  containerDescription.appendChild(createWhiteBorderButton(buttonObject.title, buttonObject.href))

  /*CONTAINER TEXT*/
  const containerText = document.createElement('div');
  containerText.className = 'text-end h-full lg:gap-32 w-2/3 lg:w-full gap-16  lg:text-start text-white justify-center lg:flex-row flex-col flex items-center'
  containerText.appendChild(containerTitle)
  containerText.appendChild(containerDescription)


  section.appendChild(containerText)


  block.appendChild(section);
}
