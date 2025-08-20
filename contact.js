class MyContact extends HTMLElement {
  async connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });

    // Fetch HTML + CSS
    const [htmlResponse, cssResponse] = await Promise.all([
      fetch("contact.html"),
      fetch("contact.css")
    ]);

    const html = await htmlResponse.text();
    const css = await cssResponse.text();

    // Inject styles + HTML into Shadow DOM
    shadow.innerHTML = `
      <style>${css}</style>
      ${html}
    `;

    // ---- Grab elements inside shadow DOM ----
    const contact = shadow.querySelector("#contact");
    const contactX = shadow.getElementById("contact-x");
    const hl1 = shadow.getElementById("hl-1");
    const vl1 = shadow.getElementById("vl-1");
    const hl2 = shadow.getElementById("hl-2");
    // const block1p = shadow.querySelectorAll("#block-1 > p");
    // const block2p = shadow.querySelectorAll("#block-2 > p");
    const contactLogo = shadow.getElementById("contact-logo");

    // ---- Hook up external button (global, outside component) ----
    const aboutMeCircles = document.querySelectorAll("#circle-about-me");




    // ---- Close button ----
    contactX.addEventListener("click", () => {
        hideElements([contact, contactLogo, hl1, hl2, vl1]);
        // menuLabels.forEach(m => m.classList.remove("visible"));
        toggleCarousel(); // global function
    });

    document.addEventListener("show-contact", () => {
      showElements([contact, contactLogo, hl1, hl2, vl1]);
    });
  }
}

// Register custom element
customElements.define("my-contact", MyContact);
