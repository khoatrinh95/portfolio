const artCircles = document.querySelectorAll("#circle-art");
const aboutMeCircles = document.querySelectorAll("#circle-about-me");
const mixCircles = document.querySelectorAll(".mix-circle");
const displayText = document.querySelector("p#hovered-item");
const customCursor = document.getElementById("custom-cursor");
const aboutMeSection = document.getElementById("about-me-section");
const aboutMeExit = document.getElementById("top-bar-about-me");
const circleButtonHome = document.querySelectorAll(".mix-circle");
const backgroundCircles = document.getElementById("background-circles");


const carousel = document.getElementById('main-carousel');
  let scrollX = 0;
  let contentWidth = carousel.scrollWidth / 2;

  let baseSpeed = 1; // Auto-scroll speed
  let boostSpeed = 0; // Extra speed from user scroll
  let scrollMultiplier = 0.5; // Tweak this for how strong scroll is

  window.addEventListener('wheel', (e) => {
    e.preventDefault(); // 👈 block default vertical scroll

    // Use vertical scroll to boost horizontal movement
    boostSpeed += e.deltaY * scrollMultiplier;
  }, { passive: false }); // 👈 must be false to use preventDefault()

  function animate() {
    scrollX += baseSpeed + boostSpeed;

    // Loop content
    if (scrollX >= contentWidth) {
      scrollX -= contentWidth;
    } else if (scrollX < 0) {
      scrollX += contentWidth;
    }

    // Apply transform
    carousel.style.transform = `translateX(${-scrollX}px)`;

    // Gradually decay boost speed
    boostSpeed *= 0.9; // Decay factor — lower = faster slowdown

    requestAnimationFrame(animate);
  }

  animate();
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
      translateX = distance*0.1*cx;
      translateY = distance*0.1*cy;
      dot.style.transform = `scale(1.3) translate(${translateX}px, ${translateY}px)`;
    } else if (distance < 100) {
      dot.style.opacity = 0.2;
      translateX = distance*0.05*cx;
      translateY = distance*0.05*cy;
      dot.style.transform = `scale(1.3) translate(${translateX}px, ${translateY}px)`;
    } else if (distance < 120) {
      dot.style.opacity = 0.1;
      dot.style.transform = 'scale(1.1)';
    } else if (distance < 140) {
      dot.style.opacity = 0.05;
    } else {
      dot.style.opacity = 0.02;
    }
  });
});

artCircles.forEach(circle => {
  circle.addEventListener('mouseenter', () => {
    displayText.textContent = "Artworks";
    customCursor.textContent = "Artworks";
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
    window.location.href='artwork-list.html';
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
    window.open('https://www.youtube.com/@LifeOfQuoi','_blank');
  });
})

aboutMeExit.addEventListener('click', () => {
  aboutMeSection.classList.remove("visible");
})

function cursorMovement(e) {
  customCursor.style.left = `${e.clientX - 20}px`;
  customCursor.style.top = `${e.clientY + 30}px`;
}