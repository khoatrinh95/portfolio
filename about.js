import { hideElements, toggleHomePageCarousel, showElements, isMobile, getOuterHeight } from './utils.js';

class MyAbout extends HTMLElement {
  async connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });

    // Fetch HTML + CSS
    const [htmlResponse, cssResponse] = await Promise.all([
      fetch("about.html"),
      fetch("about.css")
    ]);

    const html = await htmlResponse.text();
    const css = await cssResponse.text();

    // Inject styles + HTML into Shadow DOM
    shadow.innerHTML = `
      <style>${css}</style>
      ${html}
    `;

    // ---- Grab elements inside shadow DOM ----
    const about = shadow.querySelector("#about");
    const aboutImg = shadow.getElementById("about-img");
    const aboutX = shadow.getElementById("about-x");
    const hl1 = shadow.getElementById("hl-1");
    const vl1 = shadow.getElementById("vl-1");
    const hl2 = shadow.getElementById("hl-2");
    const textBlocks = shadow.getElementById("text-blocks");
    const block1p = shadow.querySelectorAll("#block-1 > p");
    const block2p = shadow.querySelectorAll("#block-2 > p");
    const aboutLogo = shadow.getElementById("about-logo");
    const socialsContainerMobile = shadow.getElementById("socials-container-mobile");

    // ---- Hook up external button (global, outside component) ----
    const aboutMeCircles = document.querySelectorAll("#circle-about-me");


    aboutMeCircles.forEach(circle => {
        circle.addEventListener('click', () => {
            showElements([about, hl1, vl1, hl2, ...block1p, ...block2p, aboutLogo]);
            toggleHomePageCarousel();

            if(isMobile()) {
              let sectionHeight = getOuterHeight(aboutImg) + getOuterHeight(textBlocks) + getOuterHeight(socialsContainerMobile);
              let vl1TopValue = parseFloat(getComputedStyle(vl1).top);
              console.log(sectionHeight);
              console.log(vl1TopValue);
              vl1.style.height = `calc(${sectionHeight}px - ${vl1TopValue}px)`;

            }
        });
    })

    // ---- Close button ----
    aboutX.addEventListener("click", () => {
        hideElements([about, hl1, vl1, hl2, ...block1p, ...block2p, aboutLogo]);
        // menuLabels.forEach(m => m.classList.remove("visible"));
        toggleHomePageCarousel(); // global function
    });

    document.addEventListener("show-about", () => {
      showElements([about, hl1, vl1, hl2, ...block1p, ...block2p, aboutLogo]);
    });
  }
}

// Register custom element
customElements.define("my-about", MyAbout);
