import { getWebRing, zap_ndk } from "/scripts/main.js";

class ZapWebRing extends HTMLElement {
  constructor() {
    super();
    this.webring = [];

    this.render = this.render.bind(this);
  }
  async connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.webring = await getWebRing();
    console.log(this.webring);
    await this.render();
  }

  async render() {
    const sites = this.webring
      .map((site) => {
        // Return a template literal for each site.
        // Customize this template based on your site object structure.
        return `<div class="site" style="width: 200px; border: 1px solid gray; padding: 12px; margin: 12px;">
            <a 
              href="${site["URL"]}"
              title="${site["Name"]}"
              npub="${site["npub"]}"
              style="text-decoration: none;">
            <img src="${site["Logo URL"]}" style="height: 50px; display: block;" />
            <span style="font-size: 11px; margin-top: 8px; display: block;">${site["URL"]}</span>
            </a>
        </div>`;
      })
      .join("");

    this.shadowRoot.innerHTML = `
    <style>
      img.square {
        border: 1px solid black;
        border-radius: 60rem;
      }
    </style>
     <center>
       <section class="sites" style="height: 120px; overflow-y: auto;">
        ${sites}
       </section>

      <footer>
        <small>
          <a href="https://zapwebring.com">zap web ring</a>
          - 
          <a href="https://pay.globalthreat.info/apps/47frGj3Hs9wdUfKoSCxdDWTS2ChP/crowdfund" target="_blank">crowd fund</a>
        </small>
      </footer>
    </center>
    `;

    const images = this.shadowRoot.querySelectorAll(".sites img");

    for (var i = 0; i < images.length; i++) {
      const img = images[i];

      if (
        img.src.indexOf("svg") === -1 &&
        img.naturalWidth === img.naturalHeight
      ) {
        img.classList.add("square");
      }
    }

    const links = this.shadowRoot.querySelectorAll(".sites a[href]");

    for (let link of links) {
      link.addEventListener("click", async (e) => {
        e.preventDefault();
        await zap_ndk(link.getAttribute("npub"), 10);
        window.location = link.href;
      });
    }
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector("form").removeEventListener("submit");
  }
}

customElements.define("zap-webring", ZapWebRing);

export default ZapWebRing;
