import {returnFocusAreaIcon, returnStatusLabel} from "./utils.js";

export class CustomButton extends HTMLElement {
    connectedCallback() {
        const label = this.textContent.trim() || '';
        const color = this.getAttribute('color') || 'primary'
        const id = this.getAttribute('id') || ''
        const btnClass = this.getAttribute('btnClass') || ''

        const className = this.getAttribute('className') || ''
        const callback = this.getAttribute('callback') || ''

        const buildLineColorClass = (color) => {
            if (color === 'white') return 'button-line-absolute-white'
            if (color === 'primary') return 'button-line-absolute-theme'
        }

        const buildColorText = (color) => {
            if (color === 'white') return 'text-white'
            if (color === 'primary') return 'text-primary'
        }


        this.innerHTML = `
      <button
      onclick="${callback}"
      id="${id}"
        class="group cursor-pointer relative text-base md:text-xl inline-block border p-2 lg:border-0 ${buildColorText(color)} ${className} ${btnClass}"
      >
        <span
          class="-top-1 -right-1 h-0.5 w-3/5 group-hover:w-9/12 ${buildLineColorClass(color)}"
        ></span>
        <span
          class="-top-1 -right-1 h-full w-0.5 group-hover:h-9/12 ${buildLineColorClass(color)}"
        ></span>
        <span
          class="-bottom-1 -left-1 h-0.5 w-3/5 group-hover:w-9/12 ${buildLineColorClass(color)}"
        ></span>
        <span
          class="-bottom-1 -left-1 h-full w-0.5 group-hover:h-9/12 ${buildLineColorClass(color)}"
        ></span>
        <span class="px-6 py-2 md:text-2xl text-base ${buildColorText(color)}">${label}</span>
      </button>
    `;
    }
}

// Register the custom element
customElements.define('custom-button', CustomButton);

export class CustomLink extends HTMLElement {
    connectedCallback() {
        const label = this.textContent.trim() || '';
        const href = this.getAttribute('href') || '#';
        const color = this.getAttribute('color') || 'primary'
        const className = this.getAttribute('className') || ''
        if (!label) return

        const buildLineColorClass = (color) => {
            if (color === 'white') return 'button-line-absolute-white'
            if (color === 'primary') return 'button-line-absolute-theme'
        }

        const buildColorText = (color) => {
            if (color === 'white') return 'text-white'
            if (color === 'primary') return 'text-primary'
        }


        this.innerHTML = `
      <a
        href="${href}"
        class="group relative inline-block border p-2 lg:border-0 ${buildColorText(color)} ${className}"
      >
        <span
          class="-top-1 -right-1 h-0.5 w-3/5 group-hover:w-9/12 ${buildLineColorClass(color)}"
        ></span>
        <span
          class="-top-1 -right-1 h-full w-0.5 group-hover:h-9/12 ${buildLineColorClass(color)}"
        ></span>
        <span
          class="-bottom-1 -left-1 h-0.5 w-3/5 group-hover:w-9/12 ${buildLineColorClass(color)}"
        ></span>
        <span
          class="-bottom-1 -left-1 h-full w-0.5 group-hover:h-9/12 ${buildLineColorClass(color)}"
        ></span>
        <span class="px-6 py-2 md:text-2xl text-base ${buildColorText(color)}">${label}</span>
      </a>
    `;
    }
}

// Register the custom element
customElements.define('custom-link', CustomLink);


export class ArrowButton extends HTMLElement {
    connectedCallback() {
        const label = this.textContent.trim() || '';
        const href = this.getAttribute('href') || '#';
        const color = this.getAttribute('color') || 'primary'
        const className = this.getAttribute('className') || ''

        const buildColorText = (color) => {
            if (color === 'white') return 'text-white'
            if (color === 'primary') return 'text-primary'
        }

        this.innerHTML = `
      <a href="${href}" class="lg:text-lg text-base font-medium text-primary outline-0 border-none flex items-center gap-2 ${buildColorText(color)} ${className}">${label}<ion-icon name="arrow-forward-outline"></ion-icon></a>
    `;
    }
}

// Register the custom element
customElements.define('arrow-button', ArrowButton);

export class SocialIcons extends HTMLElement {
    connectedCallback() {
        const facebookLink = this.getAttribute('facebook') === 'undefined' ? false : this.getAttribute('facebook');
        const instagramLink = this.getAttribute('instagram') === 'undefined' ? false : this.getAttribute('instagram');
        const linkedinLink = this.getAttribute('linkedin') === 'undefined' ? false : this.getAttribute('linkedin');
        const youtubeLink = this.getAttribute('youtube') === 'undefined' ? false : this.getAttribute('youtube');
        const className = this.getAttribute('className')

        this.innerHTML = `
      <div class="text-white gap-2 flex items-center ${className}">
        ${facebookLink ? `
        <a href="${facebookLink}">
          <ion-icon size="large" name="logo-facebook"></ion-icon>
        </a>` : ''}
        ${instagramLink ? `
        <a href="${instagramLink}">
          <ion-icon size="large" name="logo-instagram"></ion-icon>
        </a>` : ''}
        ${linkedinLink ? `
        <a href="${linkedinLink}">
          <ion-icon size="large" name="logo-linkedin"></ion-icon>
        </a>` : ''}
        ${youtubeLink ? `
        <a href="${youtubeLink}">
          <ion-icon size="large" name="logo-youtube"></ion-icon>
        </a>` : ''}
      </div>
    `;
    }
}

// Register the custom element
customElements.define('social-icons', SocialIcons);




/*Card Style 1*/
export class ArticleCard extends HTMLElement {
  connectedCallback() {
    // Ottieni i dati dal JSON
    const cardDataAttr = this.getAttribute('data-card');
    if (!cardDataAttr) return;

    let cardData;
    try {
      cardData = JSON.parse(cardDataAttr);
    } catch (e) {
      console.error('Error parsing card data:', e);
      return;
    }

    const { title, subTitle, topLabel, backgroundImage, icons, date, href, variant, isMockData } = cardData;

    const formatDate = (dateString) => {
      if (!dateString) return 'No date';
      const parsedDate = new Date(dateString);
      const day = parsedDate.getDate().toString().padStart(2, '0');
      const month = parsedDate.toLocaleString('en', {month: 'short'}).toUpperCase();
      const year = parsedDate.getFullYear();
      return `${day} ${month} ${year}`;
    };

    const buildTopLabelBox = (label) => {
      if (!label || label.trim() === '') return 'px-3 py-1 text-xl font-medium bg-gray-200 text-gray-700';
      const upperLabel = label.toString().trim().toUpperCase();
      const baseClass = 'px-3 py-1 text-xl font-medium';
      const labelClasses = {
        'ONGOING': 'bg-white text-primary',
        'COMPLETE': 'bg-primary text-white',
        'PUBLISHED': 'bg-green-100 text-green-800',
        'DRAFT': 'bg-yellow-100 text-yellow-800'
      };
      return `${baseClass} ${labelClasses[upperLabel] || 'bg-gray-200 text-gray-700'}`;
    };

    const renderImage = () => {
      if (isMockData) {
        return `<div class="w-full bg-gray-200 h-60 lg:h-72 flex items-center justify-center">
          <span class="text-gray-500 text-sm">Image Placeholder (Mock Mode)</span>
        </div>`;
      }

      if (!backgroundImage || backgroundImage.trim() === '') {
        return `<div class="w-full bg-gray-200 h-60 lg:h-72 flex items-center justify-center">
          <span class="text-gray-500 text-sm">No Image Available</span>
        </div>`;
      }

      return `<div class="w-full h-60 lg:h-72 overflow-hidden">
        <img src="${backgroundImage}" alt="${title}" class="w-full h-full object-cover"/>
      </div>`;
    };

    const linkOpen = isMockData
      ? `<a href="#" onclick="alert('Mock mode'); return false;">`
      : `<a href="${href || '#'}">`;

    this.innerHTML = `
      <div class="min-w-72 max-w-full sm:max-w-72 lg:max-w-[350px] xl:max-w-[400px]">
        ${linkOpen}
          <div class="relative">
            ${renderImage()}
            ${topLabel ? `<div class="absolute left-2 top-0 flex gap-1 ${buildTopLabelBox(returnStatusLabel(topLabel) || topLabel)}">
              ${returnStatusLabel(topLabel) || topLabel}
            </div>` : ''}
            ${icons ? `<div class="absolute right-2 bottom-2 flex gap-1">
              <div class="flex size-10 p-2 rounded-full items-center justify-center bg-white">
                ${returnFocusAreaIcon(icons)}
              </div>
            </div>` : ''}
          </div>
          <div class="flex flex-col items-start gap-4 pt-6 ${variant === 'secondary' ? 'border border-black/30 p-4 border-t-0' : ''}">
            <h5 class="text-primary ${variant === 'secondary' ? 'text-base font-semibold lg:text-3xl' : 'text-base font-semibold lg:text-xl'} line-clamp-2 max-w-prose">
              ${title}
            </h5>
            ${variant === 'primary' ? `<p class="text-base w-full border-t border-t-black/30 line-clamp-1 pt-2">${subTitle}</p>` : ''}
            ${variant === 'secondary' ? `<div class="w-full">
              <arrow-button href="${href || '#'}" class="w-full" className="pb-2">Go to the page</arrow-button>
              <p class="text-xl w-full border-t text-black/30 border-solid text-end border-t-black/30 pt-2 font-medium">${formatDate(date)}</p>
            </div>` : ''}
          </div>
        </a>
      </div>
    `;
  }
}

customElements.define('article-card', ArticleCard);


/*POP-UP Box*/
export class PopUpBox extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('title') || '';
        const subtitle = this.getAttribute('subtitle') || '';
        const isSuccess = Boolean(this.getAttribute('isSuccess') === 'true');
        const extraClass = this.getAttribute('extraClass') || '';

        const successIcon = `
            <svg class="mb-3" width="177" height="177" viewBox="0 0 177 177" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="88.5" cy="88.5" r="88.5" fill="#4CAF50" fill-opacity="0.2"/>
                <circle cx="88.5" cy="88.5" r="57.5" fill="#4CAF50"/>
                <path d="M60 87.0909L83.2222 110L117 68" stroke="white" stroke-width="7.5"/>
            </svg>
        `;

        const failureIcon = `
            <svg class="mb-3" width="176" height="176" viewBox="0 0 176 176" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="87.6525" cy="87.8847" rx="87.6525" ry="87.8856" fill="#F44336" fill-opacity="0.2"/>
                <ellipse cx="87.6525" cy="87.8838" rx="56.9494" ry="57.1008" fill="#F44336"/>
                <path d="M117.155 63.6091L93.1875 87.5759L117.73 112.119L112.141 117.12L87.8926 92.8708L63.1172 117.647L58.1162 112.058L82.5977 87.5759L58.1025 63.0808L63.6914 58.0808L87.8926 82.281L112.155 58.0193L117.155 63.6091Z" fill="white"/>
            </svg>
        `;

        this.innerHTML = `
            <div class="text-center p-4 flex flex-col gap-4 items-center justify-center w-full ${extraClass}">
                ${isSuccess ? successIcon : failureIcon}
                <span class="text-4xl font-semibold">${title}</span>
                <span class="font-light text-lg">${subtitle}</span>
            </div>
        `;
    }
}

customElements.define('popup-box', PopUpBox);
