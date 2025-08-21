import { hideElements, showElements } from './utils.js';

class MyArtworkTransition extends HTMLElement {
  async connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });

    // Fetch HTML + CSS
    const [htmlResponse, cssResponse] = await Promise.all([
      fetch("artwork-transition.html"),
      fetch("artwork-transition.css")
    ]);

    const html = await htmlResponse.text();
    const css = await cssResponse.text();

    // Inject styles + HTML into Shadow DOM
    shadow.innerHTML = `
      <style>${css}</style>
      ${html}
    `;
    // ---- Grab elements inside shadow DOM ----
    const artworkTransition = shadow.getElementById("artwork-transition");

    document.addEventListener("show-artwork-transition", () => {
      showElements([artworkTransition]);
    });

    document.addEventListener("hide-artwork-transition", () => {
      hideElements([artworkTransition]);
    });

    }
}


// Register custom element
customElements.define("my-artwork-transition", MyArtworkTransition);
