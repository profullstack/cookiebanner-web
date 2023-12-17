import { getWebRing } from "/scripts/main.js";

class ZapWebRing extends HTMLElement {
  constructor() {
    super();
    this.webring = [];
  }
  async connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.webring = await getWebRing();
    console.log(this.webring);
    await this.render();
  }

  async render() {
    this.shadowRoot.innerHTML = `
    <h1>zap web ring</h1>
    `;
  }
  

  disconnectedCallback() {
    this.shadowRoot
      .querySelector('form')
      .removeEventListener("submit");
  }
}

customElements.define("zap-webring", ZapWebRing);

export default ZapWebRing;
