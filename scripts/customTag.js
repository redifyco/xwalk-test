export class CustomButton extends HTMLElement {
    connectedCallback() {
        const label = this.textContent.trim() || '';
        const href = this.getAttribute('href') || '#';
        const color = this.getAttribute('color') || 'primary'
        const className = this.getAttribute('className') || ''

        const buildLineColorClass = (color) => {
            if(color === 'white') return  'button-line-absolute-white'
            if(color === 'primary') return 'button-line-absolute-theme'
        }

        const buildColorText = (color) => {
            if(color === 'white') return  'text-white'
            if(color === 'primary') return 'text-primary'
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
customElements.define('custom-button', CustomButton);

export class SocialIcons extends HTMLElement {
    connectedCallback() {
        const facebookLink = this.getAttribute('facebook') || '#';
        const instagramLink = this.getAttribute('instagram') || '#';
        const linkedinLink = this.getAttribute('linkedin') || '#';
        const youtubeLink = this.getAttribute('youtube') || '#';

        this.innerHTML = `
      <div class="text-white gap-2 flex items-center">
        <a href="${facebookLink}">
          <ion-icon size="large" name="logo-facebook"></ion-icon>
        </a>
        <a href="${instagramLink}">
          <ion-icon size="large" name="logo-instagram"></ion-icon>
        </a>
        <a href="${linkedinLink}">
          <ion-icon size="large" name="logo-linkedin"></ion-icon>
        </a>
        <a href="${youtubeLink}">
          <ion-icon size="large" name="logo-youtube"></ion-icon>
        </a>
      </div>
    `;
    }
}

// Register the custom element
customElements.define('social-icons', SocialIcons);
