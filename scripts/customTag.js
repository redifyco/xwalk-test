export class CustomButton extends HTMLElement {
    connectedCallback() {
        const label = this.textContent.trim() || '';
        const href = this.getAttribute('href') || '#';

        this.innerHTML = `
      <a
        href="${href}"
        class="group border-primary relative inline-block border p-2 lg:border-0"
      >
        <span
          class="button-line-absolute-theme -top-1 -right-1 h-0.5 w-3/5 group-hover:w-9/12"
        ></span>
        <span
          class="button-line-absolute-theme -top-1 -right-1 h-full w-0.5 group-hover:h-9/12"
        ></span>
        <span
          class="button-line-absolute-theme -bottom-1 -left-1 h-0.5 w-3/5 group-hover:w-9/12"
        ></span>
        <span
          class="button-line-absolute-theme -bottom-1 -left-1 h-full w-0.5 group-hover:h-9/12"
        ></span>
        <span class="text-primary px-6 py-2">${label}</span>
      </a>
    `;
    }
}

// Register the custom element
customElements.define('custom-button', CustomButton);
