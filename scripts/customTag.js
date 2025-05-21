import {returnFocusAreaIcon, returnStatusLabel} from "./utils.js";

export class CustomButton extends HTMLElement {
    connectedCallback() {
        const label = this.textContent.trim() || '';
        const color = this.getAttribute('color') || 'primary'
        const id = this.getAttribute('id') || ''

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
        class="group cursor-pointer relative inline-block border p-2 lg:border-0 ${buildColorText(color)} ${className}"
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
        const cardVariant = this.getAttribute('variant').toLowerCase() || 'primary';
        const title = this.getAttribute('title') || '';
        const subTitle = this.getAttribute('subTitle') || '';
        const topLabel = this.getAttribute('topLabel') ? this.getAttribute('topLabel').split(',') : [];
        const backgroundImage = this.getAttribute('backgroundImage');
        const icons = this.getAttribute('icons') ? this.getAttribute('icons').split(',') : [];
        const date = this.getAttribute('date') ? new Date(this.getAttribute('date')) : null;
        const href = this.getAttribute('href') || [];

        const formatDate = (dateString) => {
            if (!dateString) return 'No date';
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleString('en', {month: 'short'}).toUpperCase();
            const year = date.getFullYear();
            return `${day} ${month} ${year}`;
        };

        const buildTopLabelBox = topLabel => {
            const label = topLabel.toUpperCase();
            const baseClass = 'px-3 py-1 text-xl font-medium';
            const labelClasses = {
                'ONGOING': 'bg-white text-primary',
                'COMPLETE': 'bg-primary text-white'
            };
            return `${baseClass} ${labelClasses[label] || 'bg-gray-200 text-gray-700'}`;
        }


        this.innerHTML = `
            <div class="min-w-80 max-w-full sm:max-w-80 lg:max-w-[350px] xl:max-w-[400px]">
                <a
                    href="${href}"
                >
                    <div class="relative">
                    ${backgroundImage !== "" ? `<img class="w-full h-60 lg:h-72 object-cover" src="${backgroundImage}" alt="" />` : '<div class="w-full bg-gray-300 h-60 lg:h-72"></div>'}
                        ${topLabel.length > 0 ? topLabel.map(item => {
            const convertedLabel = returnStatusLabel(item)
            return `
                            <div class="absolute left-2 top-0 flex gap-1 ${buildTopLabelBox(convertedLabel)}">
                                ${convertedLabel}
                            </div>
                        `
        }).join('') : ''}
                        <div class="absolute right-2 bottom-2 flex gap-1">
                            ${icons.length > 0 ? icons.map(icon => {
            return `
                                <div class="flex size-10 p-2 rounded-full items-center justify-center bg-white">
                                    ${returnFocusAreaIcon(icon)}
                                </div>
                            `
        }).join('') : ''}
                        </div>
                    </div>
                    <div class="flex flex-col items-start gap-4 pt-6 ${
            {
                primary: '',
                secondary: 'border border-black/30 p-4 border-t-0'
            }[cardVariant] || ''
        }">
                        ${
            {
                primary: `<h5 class="text-primary text-base font-semibold lg:text-xl line-clamp-2 max-w-prose">${title}</h5>`,
                secondary: `<h5 class="text-primary text-base font-semibold lg:text-3xl line-clamp-2 max-w-prose">${title}</h5>`
            }[cardVariant] || ''
        }
                        
                        ${cardVariant === 'primary' ? `<p class="text-base w-full border-t border-t-black/30 line-clamp-1 pt-2">${subTitle}</p>` : ''}
                        ${cardVariant === 'secondary' ? `<div class="w-full">
<arrow-button href="${href}" class="w-full" className="pb-2">Go to the page</arrow-button>
<p class="text-xl w-full border-t text-black/30 border-solid  text-end border-t-black/30 pt-2 font-medium">${formatDate(date)}</p>
</div>` : ''}
                    </div>
                </a>
            </div>
        `;
    }
}

customElements.define('article-card', ArticleCard);
