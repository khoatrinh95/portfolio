const mainCarousel = document.querySelectorAll(".main-carousel")[0];
const artCircles = document.querySelectorAll("#circle-art");
const artCirclePhotos = document.querySelectorAll(".circle-art-photo");
const aboutMeCircles = document.querySelectorAll("#circle-about-me");
const mixCircles = document.querySelectorAll(".mix-circle");
const displayText = document.querySelector("p#hovered-item");
const customCursor = document.getElementById("custom-cursor");
const aboutMeSection = document.getElementById("about-me-section");
const circleButtonHome = document.querySelectorAll(".mix-circle");
const backgroundCircles = document.getElementById("background-circles");
const topRightTitle = document.getElementById("top-right-title-home-page");
const topLeftTitle = document.getElementById("top-left-title-home-page");
const homePageContent = document.getElementById("home-page-content");
const welcomeLogoContainer = document.getElementById("welcome-logo-container");
const welcomeBackground = document.getElementById("welcome-background");
const welcomeBackgroundSubject = document.getElementById("welcome-background-subject");
const welcomeBackgroundColoredRectangle = document.getElementById("welcome-background-colored-rectangle");
const welcomeBackgroundColoredHorizontalLine = document.getElementById("welcome-background-colored-horizontal-line");
const welcomeBackgroundColoredVerticalLine = document.getElementById("welcome-background-colored-vertical-line");
const welcomeLogoCircles = document.querySelectorAll(".welcome-logo-circle");
const menuButton = document.getElementById("menu-button");
const carousel = document.getElementById('main-carousel');

const hasVisited = sessionStorage.getItem('hasVisitedThisSession');

if (!hasVisited) {
  let waitAnimationInterval = null;
  window.addEventListener('load', () => {
    welcomeLogoCircles.forEach(c => {
      c.classList.remove('wait-animate');
      void c.offsetWidth; // force reflow
      c.classList.add('wait-animate');
    });

    waitAnimationInterval = setInterval(() => {
      welcomeLogoCircles.forEach(c => {
        c.classList.remove('wait-animate');
        void c.offsetWidth; // force reflow
        c.classList.add('wait-animate');
      })
    }, 3000);

    setTimeout(() => {
      topRightTitle.classList.add("transition", "after-welcome");
      topLeftTitle.classList.add("transition", "after-welcome");
      welcomeLogoContainer.classList.add("after-welcome");
      homePageContent.classList.add("visible");
      welcomeBackground.classList.add("transition", "after-welcome");
      welcomeBackgroundSubject.classList.add("transition", "after-welcome");
      welcomeBackgroundColoredRectangle.classList.add("transition", "after-welcome");
      welcomeBackgroundColoredHorizontalLine.classList.add("transition", "after-welcome");
      welcomeBackgroundColoredVerticalLine.classList.add("transition", "after-welcome");
      menuButton.classList.add("transition", "after-welcome");
      mainCarousel.classList.add("visible");
      clearInterval(waitAnimationInterval);
    }, 5000);
    sessionStorage.setItem('hasVisitedThisSession', 'true');
  })
} else {
  topRightTitle.classList.add("after-welcome");
  topLeftTitle.classList.add("after-welcome");
  welcomeLogoContainer.style.display = 'none';
  homePageContent.classList.add("visible");
  welcomeBackground.classList.add("after-welcome");
  welcomeBackgroundSubject.classList.add("after-welcome");
  welcomeBackgroundColoredRectangle.classList.add("after-welcome");
  welcomeBackgroundColoredHorizontalLine.classList.add("after-welcome");
  welcomeBackgroundColoredVerticalLine.classList.add("after-welcome");
  menuButton.classList.add("after-welcome");
  mainCarousel.classList.add("visible");
}

// remove the patterns
if (false) {
  // Generate dots
  const pattern = document.getElementById('pattern');
  const cols = Math.ceil(window.innerWidth / 75);
  const rows = Math.ceil(window.innerHeight / 75);
  for (let i = 0; i < cols * rows; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    pattern.appendChild(dot);
  }

  const dots = document.querySelectorAll('.dot');
  document.addEventListener('mousemove', e => {
    dots.forEach(dot => {
      const rect = dot.getBoundingClientRect();
      const dx = rect.left + rect.width / 2 - e.clientX;
      const dy = rect.top + rect.height / 2 - e.clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // coeeficient of dx and dy
      const cx = dx > 0 ? -1 : 1;
      const cy = dy > 0 ? -1 : 1;

      if (distance < 60) {
        dot.style.opacity = 0.5;
        translateX = distance * 0.1 * cx;
        translateY = distance * 0.1 * cy;
        dot.style.transform = `scale(1.3) translate(${translateX}px, ${translateY}px)`;
      } else if (distance < 100) {
        dot.style.opacity = 0.2;
        translateX = distance * 0.05 * cx;
        translateY = distance * 0.05 * cy;
        dot.style.transform = `scale(1.3) translate(${translateX}px, ${translateY}px)`;
      } else if (distance < 120) {
        dot.style.opacity = 0.1;
        dot.style.transform = 'scale(1.1)';
      } else if (distance < 140) {
        dot.style.opacity = 0.05;
      } else {
        dot.style.opacity = 0;
      }
    });
  });
}



let scrollX = 0;
let boostSpeed = 0;
let animationFrameId = null;
let isRunning = false;

function toggleCarousel() {
  const baseSpeed = 1;
  const scrollMultiplier = 0.05;
  const contentWidth = carousel.scrollWidth / 2;

  // Shared between events
  let isTouching = false;
  let startX = 0;

  // --- Event handlers ---
  const onWheel = (e) => {
    if (!isRunning) return;
    e.preventDefault();
    boostSpeed += e.deltaY * scrollMultiplier;
  };

  const onTouchStart = (e) => {
    if (!isRunning || e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    isTouching = true;
  };

  const onTouchMove = (e) => {
    if (!isRunning || !isTouching || e.touches.length !== 1) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;
    boostSpeed -= deltaX * 0.1;
    startX = currentX;
    e.preventDefault();
  };

  const onTouchEnd = () => {
    isTouching = false;
  };

  function addEvents() {
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
  }

  function removeEvents() {
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
  }

  function animate() {
    if (!isRunning) return;

    scrollX += baseSpeed + boostSpeed;

    if (scrollX >= contentWidth) {
      scrollX -= contentWidth;
    } else if (scrollX < 0) {
      scrollX += contentWidth;
    }

    carousel.style.transform = `translateX(${-scrollX}px)`;

    boostSpeed *= 0.9;

    animationFrameId = requestAnimationFrame(animate);
  }

  if (isRunning) {
    // 🔴 Pause
    isRunning = false;
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    removeEvents();
  } else {
    // 🟢 Resume
    isRunning = true;
    addEvents();
    animate();
  }
}



toggleCarousel();

let activeItems = [];
fetch('artworks.json')
    .then(res => res.json())
    .then(items => {
        activeItems = items.filter(item => item.active);
        initializeUI();
    })
    .catch(err => console.error('Error loading JSON:', err));

function initializeUI() {
  mainArtPhoto = activeItems[0].folderName;
  photoPath = `assets/artworks/singles/${mainArtPhoto}/full.webp`;
  artCirclePhotos.forEach(img => {
    img.src = photoPath
  })
}

artCircles.forEach(circle => {
  circle.addEventListener('mouseenter', () => {
    displayText.textContent = "Artwork";
    customCursor.textContent = "Artwork";
    customCursor.style.display = isMobile() ? "none" : "block";
  });
  circle.addEventListener('mouseleave', () => {
    displayText.textContent = '';
    customCursor.style.display = "none";
  });
  circle.addEventListener('mousemove', (e) => {
    cursorMovement(e);
  });
  circle.addEventListener('click', () => {
    circle.dispatchEvent(new CustomEvent("show-artwork-transition", {
      bubbles: true,        // important! lets event go up DOM
      composed: true        // important! lets event escape shadow DOM
    }));

    setTimeout(() => {
      window.location.href = 'artwork-page.html';
      circle.dispatchEvent(new CustomEvent("hide-artwork-transition", {
      bubbles: true,        // important! lets event go up DOM
      composed: true        // important! lets event escape shadow DOM
    }));
    }, 1000);
    
    
  });
})

aboutMeCircles.forEach(circle => {
  circle.addEventListener('mouseenter', () => {
    displayText.textContent = "About Me";
    customCursor.textContent = "About Me";
    customCursor.style.display = isMobile() ? "none" : "block";
  });
  circle.addEventListener('mouseleave', () => {
    displayText.textContent = '';
    customCursor.style.display = "none";
  });
  circle.addEventListener('mousemove', (e) => {
    cursorMovement(e);
  });

  circle.addEventListener('click', () => {
    circle.dispatchEvent(new CustomEvent("show-about", {
      bubbles: true,        // important! lets event go up DOM
      composed: true        // important! lets event escape shadow DOM
    }));
  });
})

mixCircles.forEach(circle => {
  circle.addEventListener('mouseenter', () => {
    displayText.textContent = "Youtube";
    customCursor.textContent = "Youtube";
    customCursor.style.display = isMobile() ? "none" : "block";
  });
  circle.addEventListener('mouseleave', () => {
    displayText.textContent = '';
    customCursor.style.display = "none";
  });
  circle.addEventListener('mousemove', (e) => {
    cursorMovement(e);
  });
  circle.addEventListener('click', () => {
    window.open('https://www.youtube.com/@LifeOfQuoi', '_blank');
  });
})




function cursorMovement(e) {
  customCursor.style.left = `${e.clientX - 20}px`;
  customCursor.style.top = `${e.clientY + 30}px`;
}


if (isMobile()) {
  const screenMidX = window.innerWidth / 2;
  const rangeStart = screenMidX - 400;
  const rangeEnd = screenMidX;

  let frameCounter = 0;
  const frameSkip = 4; // Run midpoint check every 4 frames (~15fps)

  function checkMidpoint() {

    artCircles.forEach(circle => {
      const rect = circle.getBoundingClientRect();
      const leftX = rect.left;

      if (leftX > rangeStart && leftX < rangeEnd) {
        displayText.textContent = "Artwork";
      }
    });

    aboutMeCircles.forEach(circle => {
      const rect = circle.getBoundingClientRect();
      const leftX = rect.left;

      if (leftX > rangeStart && leftX < rangeEnd) {
        displayText.textContent = "About Me";
      }
    });

    mixCircles.forEach(circle => {
      const rect = circle.getBoundingClientRect();
      const leftX = rect.left;

      if (leftX > rangeStart && leftX < rangeEnd) {
        displayText.textContent = "Youtube";
      }
    });
  }

  function checkMidpointLoop() {
    frameCounter++;

    if (frameCounter % frameSkip === 0) {
      checkMidpoint();
    }

    requestAnimationFrame(checkMidpointLoop);
  }

  requestAnimationFrame(checkMidpointLoop);
}


function isMobile() {
  //we're not checking screen size bc desktop could resize to small screen size 
  // this checks whether the device supports touch
    return "ontouchend" in document;
}

function isIPadOrTablet() {
  const ua = navigator.userAgent.toLowerCase();
  return (
    (ua.includes("ipad") || (ua.includes("macintosh") && "ontouchend" in document)) ||  // iPadOS (iPads now report as Mac sometimes)
    (ua.includes("android") && !ua.includes("mobile"))  // Android tablets
  );
}

function showElements(elements) {
  elements.forEach(e => {
    if (e) e.classList.add("visible");
  });
}


function hideElements(elements) {
  elements.forEach(e => {
    if (e) e.classList.remove("visible");
  });
}
