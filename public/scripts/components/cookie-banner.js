// import { getWebRing, zap_ndk } from "/scripts/main.js";

class CookieBanner extends HTMLElement {
  constructor() {
    super();

    this.render = this.render.bind(this);
    this.rejectAllCookies = this.rejectAllCookies.bind(this);
    this.allowAllCookies = this.allowAllCookies.bind(this);
    this.dismissCookieBanner = this.dismissCookieBanner.bind(this);
    this.attachEvents = this.attachEvents.bind(this);
  }

  async connectedCallback() {
    this.attachShadow({ mode: "open" });
    // this.webring = await getWebRing();
    // console.log(this.webring);
    await this.render();
    this.attachEvents();
  }

  async render() {
    this.shadowRoot.innerHTML = `
    <style>
      .hide {
        display: none;
      }
    </style>

    <div class="cookie-banner">
      <p>We use cookies to improve your experience on our site.</p>
      <button id="reject-all">Reject All</button>
      <button id="allow-all">Allow All</button>
      <button id="dismiss">Dismiss</button>
    </div>
    `;
  }

  attachEvents() {
    this.shadowRoot
      .querySelector("#reject-all")
      .addEventListener("click", this.rejectAllCookies);
    this.shadowRoot
      .querySelector("#allow-all")
      .addEventListener("click", this.allowAllCookies);
    this.shadowRoot
      .querySelector("#dismiss")
      .addEventListener("click", this.dismissCookieBanner);
  }

  rejectAllCookies(e) {
    e.preventDefault();
    const cookies = document.cookie;

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      document.cookie = `${cookie}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }

    this.dismissCookieBanner(e);
  }

  allowAllCookies(e) {
    e.preventDefault();

    this.dismissCookieBanner(e);
  }

  dismissCookieBanner(e) {
    e.preventDefault();

    this.shadowRoot.querySelector(".cookie-banner").classList.add("hide");
  }

  disconnectedCallback() {
    [...this.shadowRoot.querySelectorAll("button")].map((el) =>
      el.removeEventListener("click")
    );
  }
}

customElements.define("cookie-banner", CookieBanner);

export default CookieBanner;
