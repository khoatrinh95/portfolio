import { hideElements, showElements, isHomePage, isMobile } from './utils.js';

class MyMenu extends HTMLElement {
  async connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });

    // Fetch HTML + CSS
    const [htmlResponse, cssResponse] = await Promise.all([
      fetch("menu.html"),
      fetch("menu.css")
    ]);

    const html = await htmlResponse.text();
    const css = await cssResponse.text();

    // Inject styles + HTML into Shadow DOM
    shadow.innerHTML = `
      <style>${css}</style>
      ${html}
    `;

    // ---- Grab elements inside shadow DOM ----
    const menu = shadow.querySelector(".menu");
    const menuX = shadow.getElementById("menu-x");
    const menuTitle = shadow.getElementById("menu-title");
    const menuVerticalLine = shadow.getElementById("menu-vertical-line");
    const menuVerticalLineMobile = shadow.getElementById("menu-vertical-line-mobile");
    const menuLabels = shadow.querySelectorAll(".menu-label");
    const menuLabelImg = shadow.getElementById("menu-label-image");

    // ---- Hook up external button (global, outside component) ----
    const menuButton = document.getElementById("menu-button");

    if (menuButton) {
      menuButton.addEventListener("click", () => {
        showElements([menu, ...menuLabels]);
        toggleHomePageCarousel(); // global function

        if (isMobile()) {
          showElements([menuVerticalLineMobile]);
        }
      });
    }

    // ---- Close button ----
    menuX.addEventListener("click", () => {
      hideElements([menu, ...menuLabels]);
      toggleHomePageCarousel(); // global function

      if (isMobile()) {
          hideElements([menuVerticalLineMobile]);
      }
    });

    // ---- Clicking the title goes to home page ----
    menuTitle.addEventListener("click", () => {
      hideElements([menu, ...menuLabels]);
      window.location.href = 'index.html';
      toggleHomePageCarousel();
    });

    // ---- Hover effects on labels ----
    menuLabels.forEach(m => {
      m.addEventListener("mouseover", () => {
        menuVerticalLine.style.transition = "transform 0.3s ease";
        menuVerticalLine.style.transitionDelay = "0.3s";
        menuVerticalLine.style.transformOrigin = "top";
        menuVerticalLine.classList.add("visible");
        changeMenuImage(m, false); // global function
      });

      m.addEventListener("mouseleave", () => {
        menuVerticalLine.style.transitionDelay = "0s";
        menuVerticalLine.style.transition = "none";
        menuVerticalLine.classList.remove("visible");
        changeMenuImage(m, true); // global function
      });

      m.addEventListener("click", () => {
        switch (m.textContent) {
            case "Artwork":
                this.dispatchEvent(new CustomEvent("show-artwork-transition", {
                  bubbles: true,        // important! lets event go up DOM
                  composed: true        // important! lets event escape shadow DOM
                }));
                hideElements([menu, ...menuLabels]);

                setTimeout(() => {
                  window.location.href = 'artwork-page.html';
                  this.dispatchEvent(new CustomEvent("hide-artwork-transition", {
                  bubbles: true,        // important! lets event go up DOM
                  composed: true        // important! lets event escape shadow DOM
                }));
                }, 1000);
                break;
            case "Shop":
                window.open('https://das-haus-von-quoi.square.site','_blank');
                break;
            case "About":
                this.dispatchEvent(new CustomEvent("show-about", {
                  bubbles: true,        // important! lets event go up DOM
                  composed: true        // important! lets event escape shadow DOM
                }));
                hideElements([menu, ...menuLabels]);
                break;
            case "Events":
                
                break;
            case "Contact":
                this.dispatchEvent(new CustomEvent("show-contact", {
                  bubbles: true,        // important! lets event go up DOM
                  composed: true        // important! lets event escape shadow DOM
                }));
                hideElements([menu, ...menuLabels]);
                break;
            }
      });
    });

    function changeMenuImage(menuLabel, remove) {
        if (remove) {
            menuLabelImg.style.opacity = 0;
        } else {
            menuLabelImg.style.opacity = 1;
            let width = '20vw';

            switch (menuLabel.textContent) {
            case "Artwork":
                width = '25vw'
                menuLabelImg.src = 'assets/artworks/singles/statue/mockup-h-1.webp';
                break;
            case "Shop":
                width = '40vw'
                menuLabelImg.src = 'assets/images/shop.png';
                break;
            case "About":
                menuLabelImg.src = 'assets/images/about-me.webp';
                break;
            case "Events":
                menuLabelImg.src = 'assets/images/Logo.webp';
                break;
            case "Contact":
                menuLabelImg.src = 'assets/images/about-me-profile.webp';
                break;
            }

            menuLabelImg.style.width = width;
            
        }
    }

    function toggleHomePageCarousel() {
      if (isHomePage()) {
        toggleCarousel();
      }
    }
  }
}

// Register custom element
customElements.define("my-menu", MyMenu);
