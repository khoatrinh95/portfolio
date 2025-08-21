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


function hideElements(elements) {
  elements.forEach(e => {
    if (e) e.classList.remove("visible");
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
  return getCurrentPageName() == "index";
}

export {doesFileExist, showElements, hideElements, getCurrentPageName, isHomePage};