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


const carousel = document.getElementById('main-carousel');
  let scrollX = 0;
  let baseSpeed = 1; // automatic scroll speed
  let boostSpeed = 0; // from scroll or swipe
  const scrollMultiplier = 0.1;

  // Get half the scroll width (since content is duplicated)
  let contentWidth = carousel.scrollWidth / 2;

  // Handle desktop scroll
  window.addEventListener('wheel', (e) => {
    e.preventDefault(); // block vertical scroll
    boostSpeed += e.deltaY * scrollMultiplier;
  }, { passive: false });

  // Mobile swipe handling
  let startX = 0;
  let isTouching = false;

  window.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      startX = e.touches[0].clientX;
      isTouching = true;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isTouching || e.touches.length !== 1) return;

    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;

    boostSpeed -= deltaX * 0.5; // adjust multiplier to control sensitivity
    startX = currentX;

    e.preventDefault(); // block vertical scroll on mobile
  }, { passive: false });

  window.addEventListener('touchend', () => {
    isTouching = false;
  });

  function animate() {
    scrollX += baseSpeed + boostSpeed;

    // seamless looping
    if (scrollX >= contentWidth) {
      scrollX -= contentWidth;
    } else if (scrollX < 0) {
      scrollX += contentWidth;
    }

    carousel.style.transform = `translateX(${-scrollX}px)`;

    // gradually reduce boost speed (inertia)
    boostSpeed *= 0.9;

    requestAnimationFrame(animate);
  }

  animate();




artCircles.forEach(circle => {
  circle.addEventListener('mouseenter', () => {
    displayText.textContent = "Artwork";
    customCursor.textContent = "Artwork";
    customCursor.style.display = "block";
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
    customCursor.style.display = "block";
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

  });
})

mixCircles.forEach(circle => {
  circle.addEventListener('mouseenter', () => {
    displayText.textContent = "Youtube";
    customCursor.textContent = "Youtube";
    customCursor.style.display = "block";
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
})

function cursorMovement(e) {
  customCursor.style.left = `${e.clientX - 20}px`;
  customCursor.style.top = `${e.clientY + 30}px`;
}