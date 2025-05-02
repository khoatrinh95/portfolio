const artCircles = document.querySelectorAll("#circle-art");
const aboutMeCircles = document.querySelectorAll("#circle-about-me");
const mixCircles = document.querySelectorAll(".mix-circle");
const displayText = document.querySelector("p#hovered-item");

artCircles.forEach(circle => {
  circle.addEventListener('mouseenter', () => {
    displayText.textContent = "Artworks";
  });
  circle.addEventListener('mouseleave', () => {
    displayText.textContent = '';
  });
})

aboutMeCircles.forEach(circle => {
  circle.addEventListener('mouseenter', () => {
    displayText.textContent = "About Me";
  });
  circle.addEventListener('mouseleave', () => {
    displayText.textContent = '';
  });
})

mixCircles.forEach(circle => {
  circle.addEventListener('mouseenter', () => {
    displayText.textContent = "Youtube";
  });
  circle.addEventListener('mouseleave', () => {
    displayText.textContent = '';
  });
})



