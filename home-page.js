const artCircles = document.querySelectorAll("#circle-art");
const aboutMeCircles = document.querySelectorAll("#circle-about-me");
const mixCircles = document.querySelectorAll(".mix-circle");
const displayText = document.querySelector("p#hovered-item");
const customCursor = document.getElementById("custom-cursor");

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
    customCursor.style.left = `${e.clientX + 10}px`;
    customCursor.style.top = `${e.clientY + 10}px`;
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
    customCursor.style.left = `${e.clientX + 10}px`;
    customCursor.style.top = `${e.clientY + 10}px`;
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
    customCursor.style.left = `${e.clientX + 10}px`;
    customCursor.style.top = `${e.clientY + 10}px`;
  });
})



