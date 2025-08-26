import { checkFileExists } from './network.js';

async function doesFileExist(fileUrl) {
    try {
      const exists = await checkFileExists(fileUrl);
      return exists;
    } catch (e) {
      console.error('Error in doesFileExist:', e);
      return false;
    }
  }



function showElements(elements) {
  elements.forEach(e => {
    if (e) e.classList.add("visible");
  });
}

function showElementsWithTransition(elements) {
  elements.forEach(e => {
    if (e) e.classList.add("visible", "transition");
  });
}


function hideElements(elements) {
  elements.forEach(e => {
    if (e) e.classList.remove("visible");
  });
}

function addInvisibleWithTransition(elements) {
  elements.forEach(e => {
    if (e) {
      e.classList.add("invisible", "transition");
    }
  });
}

function removeInvisibleWithTransition(elements) {
  elements.forEach(e => {
    if (e) {
      e.classList.remove("invisible", "transition");
    }
  });
}

function getCurrentPageName() {
  // Get the full path after the domain
  const path = window.location.pathname; 
  // Example: "/about/contact.html"

  // Extract just the file name
  const page = path.split("/").pop(); 
  // Example: "contact.html"

  // Remove extension if you only want the base name
  return page.split(".")[0]; 
}

function isHomePage() {
  return getCurrentPageName() == "index" || getCurrentPageName() == "";
}

function toggleHomePageCarousel() {
      if (isHomePage()) {
        toggleCarousel();
      }
    }

function isMobile() {
    //we're not checking screen size bc desktop could resize to small screen size 
    // this checks whether the device supports touch
    return "ontouchend" in document;
}

function getScrollPercent() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return (scrollTop / docHeight) * 100;
}

function getOuterHeight(el) {
  const style = getComputedStyle(el);
  return el.offsetHeight +
         parseFloat(style.marginTop) +
         parseFloat(style.marginBottom);
}


export {
  doesFileExist, 
  showElements, 
  hideElements, 
  getCurrentPageName, 
  isHomePage, 
  isMobile, 
  showElementsWithTransition, 
  addInvisibleWithTransition,
  removeInvisibleWithTransition,
  toggleHomePageCarousel,
  getScrollPercent,
  getOuterHeight
};