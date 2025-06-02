const artCircles = document.querySelectorAll("#circle-art");
const aboutMeCircles = document.querySelectorAll("#circle-about-me");
const mixCircles = document.querySelectorAll(".mix-circle");
const displayText = document.querySelector("p#hovered-item");
const customCursor = document.getElementById("custom-cursor");
const aboutMeSection = document.getElementById("about-me-section");
const aboutMeExit = document.getElementById("top-bar-about-me");
const circleButtonHome = document.querySelectorAll(".mix-circle");
const backgroundCircles = document.getElementById("background-circles");
const topRightTitle = document.getElementById("top-right-title-home-page");
const topLeftTitle = document.getElementById("top-left-title-home-page");
const homePageContent = document.getElementById("home-page-content");
const welcomeLogoContainer = document.getElementById("welcome-logo-container");
const welcomeBackground = document.getElementById("welcome-background");
const welcomeLogoCircles = document.querySelectorAll(".welcome-logo-circle");
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
      welcomeLogoContainer.classList.add("transition", "after-welcome");
      homePageContent.classList.add("visible");
      welcomeBackground.classList.add("transition", "after-welcome");
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
}


if (!isMobile()) {
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
  const scrollMultiplier = 0.1;
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
    boostSpeed -= deltaX * 0.5;
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
    window.location.href = 'artwork-list.html';
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
    aboutMeSection.classList.add("visible");
    toggleCarousel();
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

aboutMeExit.addEventListener('click', () => {
  aboutMeSection.classList.remove("visible");
  toggleCarousel();
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
  return window.innerWidth <= 768;
}