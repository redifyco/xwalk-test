import {classNames, isEditorMode} from "../../scripts/utils.js";
import {createWhiteBorderButton} from "../../components/button.js";


export default async function decorate(block) {
  const inEditorMode = isEditorMode();
  const backgroundImage = block.querySelector('div:first-child picture img') || {src: 'assets/images/hero-bg.png'};
  const titleHTML = block.querySelector('div:nth-child(2) div').innerHTML || '<p>What drives us</p>';
  const descriptionHTML = block.querySelector('div:nth-child(3) div').innerHTML || '<p>The ocean is life, it’s culture, it’s the heartbeat of communities worldwide. At the MSC Foundation, we work to safeguard and empower this vital connection, ensuring a thriving future for both people and the blue planet. </p>';
  const buttonObject = block.querySelector('div:nth-child(4) div p a') || {title: 'Learn more about us', href: '#'};
  const mobileHeight = block.querySelector('div:nth-child(5) div p')?.innerHTML || '600'
  const desktopHeight = block.querySelector('div:nth-child(6) div p')?.innerHTML || '800'


  const buildHeight = classNames({
    ['h-[200px]']: mobileHeight === '200',
    ['h-[400px]']: mobileHeight === '400',
    ['h-[600px]']: mobileHeight === '600',
    ['h-[800px]']: mobileHeight === '800',
    ['h-[1000px]']: mobileHeight === '1000',
    ['h-[1200px]']: mobileHeight === '1200',
    ['h-[1400px]']: mobileHeight === '1400',
    ['h-[1600px]']: mobileHeight === '1600',
    ['h-[1800px]']: mobileHeight === '1800',
    ['h-[2000px]']: mobileHeight === '2000',
    ['lg:h-[600px]']: desktopHeight === '600',
    ['lg:h-[800px]']: desktopHeight === '800',
    ['lg:h-[1000px]']: desktopHeight === '1000',
    ['lg:h-[1200px]']: desktopHeight === '1200',
    ['lg:h-[1400px]']: desktopHeight === '1400',
    ['lg:h-[1600px]']: desktopHeight === '1600',
    ['lg:h-[1800px]']: desktopHeight === '1800',
    ['lg:h-[2000px]']: desktopHeight === '2000',
    ['lg:h-[2200px]']: desktopHeight === '2200',
    ['lg:h-[2400px]']: desktopHeight === '2400',
  });


  block.textContent = '';

  /*SECTION*/
  const section = document.createElement('section');
  section.className = `bg-no-repeat bg-cover flex justify-end lg:justify-center bg-center lg:px-20 px-4 py-40 ${buildHeight}`
  section.style.backgroundImage = `url(${backgroundImage.src})`;


  /*CONTAINER TITLE*/
  const containerTitle = document.createElement('div');
  containerTitle.className = 'text-6xl w-full lg:text-8xl xl:text-9xl uppercase'
  containerTitle.innerHTML = titleHTML

  /*CONTAINER DESCRIPTION + BUTTON*/
  const containerDescription = document.createElement('div');
  containerDescription.className = 'lg:translate-y-20 leading-5 lg:leading-10 flex items-end lg:items-start flex-col gap-10 lg:text-xl'
  containerDescription.innerHTML = descriptionHTML;
  containerDescription.appendChild(createWhiteBorderButton(buttonObject.title, buttonObject.href))

  /*CONTAINER TEXT*/
  const containerText = document.createElement('div');
  containerText.className = 'text-end h-full max-w-5xl w-3/4 lg:gap-32 lg:w-full gap-16  lg:text-start text-white justify-center lg:flex-row flex-col flex items-center'
  containerText.appendChild(containerTitle)
  containerText.appendChild(containerDescription)


  section.appendChild(containerText)


  block.appendChild(section);
}
