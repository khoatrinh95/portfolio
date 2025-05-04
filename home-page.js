const artCircles = document.querySelectorAll("#circle-art");
const aboutMeCircles = document.querySelectorAll("#circle-about-me");
const mixCircles = document.querySelectorAll(".mix-circle");
const displayText = document.querySelector("p#hovered-item");
const customCursor = document.getElementById("custom-cursor");
const aboutMeSection = document.getElementById("about-me-section");
const aboutMeExit = document.getElementById("top-bar-about-me");
const circleButtonHome = document.querySelectorAll(".mix-circle");

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