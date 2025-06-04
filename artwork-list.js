import { doesFileExist } from './utils.js';

const circleHomeButton = document.getElementsByClassName("circle-button")[0];
const circleBackToListButton = document.getElementsByClassName("circle-button")[1];
const homeLabel = document.getElementById("home-label");
const backToListLabel = document.getElementById("back-to-list-label");
const artWorkContainer = document.getElementById("artwork-container");
const artWorkFrame = document.getElementById("outer-rectangle");
const artWork = document.getElementById("inner-rectangle");
const detailSection = document.getElementById("detail");
const overviewSection = document.getElementById("overview");
const detailTitle = document.getElementById("detail-title");
const artworkSubject = document.getElementById("artwork-subject");
const list = document.getElementById('item-list');
const detailFullArt = document.getElementById("full-art");
const closeUpArtSection = document.getElementById("close-up-art-section");
const closeUpArt1 = document.getElementById("close-up-art-1");
const closeUpArt2 = document.getElementById("close-up-art-2");
const video1 = document.getElementById("video-1");
const videoSource1 = document.getElementById("video-source-1");
const mockupH1 = document.getElementById("mockup-h-1");
const mockupV1 = document.getElementById("mockup-v-1");
const mockupV2 = document.getElementById("mockup-v-2");
const desc1 = document.getElementById("desc-1");
const desc2 = document.getElementById("desc-2");
const circleFooters = Array.from(document.getElementsByClassName("circle-footer"));
const footer = document.getElementsByClassName("footer")[0];
const mixCircleFooter = document.getElementById("mix-circle-footer");
const shopLabel = Array.from(document.getElementsByClassName("shop-label"))[0];
const getInTouchLabel = document.getElementById("l3");
const aboutMeLabel = document.getElementById("l1");
const aboutMeSection = document.getElementById("about-me-section");
const aboutMeExit = document.getElementById("top-bar-about-me");
const itemCarousel = document.getElementById("item-carousel");
const clickForDetails = document.getElementById("click-for-detail");


let onScrollFnc = null;
let handleClickShopLabel = null;



getInTouchLabel.addEventListener('click', () => {
    window.location.href = "mailto:dashausvonquoi@gmail.com";
})

aboutMeLabel.addEventListener('click', () => {
    aboutMeSection.classList.add("visible");
})

aboutMeExit.addEventListener('click', () => {
    aboutMeSection.classList.remove("visible");
  })

resetShopLabel();



circleBackToListButton.addEventListener('click', () => {
    backToList();
});

if (!isMobile()) {
    footer.addEventListener('mouseover', () => {
        moveLogoCircles();
    })
    footer.addEventListener('mouseleave', () => {
        const scrollPercent = Math.min(getScrollPercent() / 100, 1);
        if (scrollPercent > 0.98) {
            return;
        }
        unmoveLogoCircles();
    })
    circleHomeButton.addEventListener('mouseover', () => {
        homeLabel.classList.add('visible');
    });

    circleHomeButton.addEventListener('mouseleave', () => {
        homeLabel.classList.remove('visible');
    });

    circleBackToListButton.addEventListener('mouseover', () => {
        backToListLabel.classList.add('visible');
    });

    circleBackToListButton.addEventListener('mouseleave', () => {
        backToListLabel.classList.remove('visible');
    });
}



let activeItems = [];

fetch('artworks.json')
    .then(res => res.json())
    .then(items => {
        activeItems = items.filter(item => item.active);
        initializeUI();
    })
    .catch(err => console.error('Error loading JSON:', err));

function initializeUI() {
    if (isMobile()) {
        renderMobileView(activeItems);
    } else {
        renderDesktopView(activeItems);
    }
    renderDefault(activeItems)
}

function renderMobileView(items) {
    items.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = 'item-c';
        div.textContent = item.title;
        itemCarousel.appendChild(div);
    });

    const allItemC = Array.from(document.getElementsByClassName("item-c"));
    const firstItem = allItemC[0];
    const firstItemLength = firstItem.getBoundingClientRect().width;

    itemCarousel.style.transform = `translateX(-${firstItemLength / 2}px)`;

    styleItemCarousel(allItemC, 0);
    initializeMobileInteraction(allItemC, items);
}

function renderDesktopView(items) {
    items.forEach((item, i) => {
        const li = document.createElement('li');
        li.className = 'item';
        li.textContent = item.title;
        li.style.transitionDelay = `${i * 30}ms`;

        li.addEventListener('mouseover', () => {
            clearSelection();
            changeArtwork(li, item);
        });

        li.addEventListener('click', () => {
            selectArtwork(item);
            setTimeout(() => checkInitialScroll(), 3000);

            
        });

        list.appendChild(li);
    });
}

function renderDefault(items) {
    const listItems = document.getElementsByClassName("item");
    changeArtwork(listItems[0], items[0]);
}


function clearSelection() {
    const items = Array.from(document.getElementsByClassName("item"));
    items.forEach(item => {
        let currentString = item.textContent;
        item.textContent = currentString.replace("→ ", "");
    });
}

function changeArtwork(listItem, item) {
    changeBackgroundColor(item.backgroundColor);
    circleHomeButton.style.backgroundColor = item.mainColor;
    circleBackToListButton.style.backgroundColor = item.mainColor;
    if (listItem != null) {
        listItem.textContent = '→ ' + item.title;
    }
    

    preloadAndChangeBackgroundImage(artWork, `assets/artworks/${item.folderName}/full.webp`);
    preloadAndChangeBackgroundImage(artworkSubject, `assets/artworks/${item.folderName}/subject.webp`);
}


function preloadAndChangeBackgroundImage(el, url) {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      el.style.backgroundImage = `url(${url})`;
    };
  }
  

function changeDescriptions(item) {
    desc1.textContent = item.desc1;
    desc2.textContent = item.desc2;
}

function changeDetailTitle(item) {
    detailTitle.textContent = item.title;
    detailTitle.style.color = item.mainColor;
}

function changeDetailPhotos(item) {
    detailFullArt.style.backgroundImage = `url(assets/artworks/${item.folderName}/mockup-v-1.webp)`;
    closeUpArt1.style.backgroundImage = `url(assets/artworks/${item.folderName}/detail-1.webp)`;
    closeUpArt2.style.backgroundImage = `url(assets/artworks/${item.folderName}/detail-2.webp)`;
    mockupH1.style.backgroundImage = `url(assets/artworks/${item.folderName}/mockup-h-1.webp)`;
    mockupV2.style.backgroundImage = `url(assets/artworks/${item.folderName}/mockup-v-2.webp)`;
}

async function changeDetailVideo(item) {
  const file = `assets/artworks/${item.folderName}/video.webm`;
  const exists = await doesFileExist(file);

  if (exists) {
    video1.src = file;
    video1.style.display = 'block'; // or '' to reset to CSS default
    video1.load();
  } else {
    video1.style.display = 'none';
  }
}


function onScroll(item) {
    fadeDetailTitle();
    fadeBackgroundColor(item);
    fadeSections();
    if (!isMobile()) {
        expandFooter();
    }
}

function changeBackgroundColor(color){
    document.body.style.backgroundColor = color;
}

function fadeBackgroundColor(item){
    const scrollPercent = Math.min(getScrollPercent() / 100, 1);
    if (scrollPercent > 0.1) {
        changeBackgroundColor('#000000');
    } else {
        changeBackgroundColor(item.backgroundColor);    
    }
    
}

function changeShopLabel(item) {
    shopLabel.textContent= "Shop this print";
    shopLabel.removeEventListener("click", handleClickShopLabel);
    handleClickShopLabel = function () {
        window.open(item.etsyLink,'_blank');
    };
    shopLabel.addEventListener("click", handleClickShopLabel);
}

function resetShopLabel() {
    shopLabel.textContent= "Shop";
    shopLabel.removeEventListener("click", handleClickShopLabel);
    handleClickShopLabel = function () {
        window.open('https://dashausvonquoi.etsy.com','_blank');
    };
    shopLabel.addEventListener("click", handleClickShopLabel);
}

function fadeDetailTitle() {
    const scrollPercent = Math.min(getScrollPercent() / 100, 1);
    const opacity = Math.max((1 - scrollPercent*2) * 0.5, 0.1);
    detailTitle.style.opacity = opacity;
}

function fadeSections() {
    const scrollPercent = Math.min(getScrollPercent() / 100, 1);
    if (scrollPercent > 0.075) {
        desc1.classList.add("visible");
        detailFullArt.classList.add("visible");
      
    } else {
        desc1.classList.remove("visible");
        detailFullArt.classList.remove("visible");
    }

    if (scrollPercent > 0.25) {
        desc2.classList.add("visible");
        closeUpArtSection.classList.add("visible");
        
    } else {
        desc2.classList.remove("visible");
        closeUpArtSection.classList.remove("visible");
    }

    if (scrollPercent > 0.65) {
        mockupH1.classList.add("visible");        
    } else {
        mockupH1.classList.remove("visible");
    }

    if (scrollPercent > 0.85) {
        mockupV2.classList.add("visible");        
    } else {
        mockupV2.classList.remove("visible");
    }
}

function moveLogoCircles() {
    circleFooters.forEach(cf => {
        cf.classList.add("visible");
    })
    mixCircleFooter.classList.add("visible");
}

function unmoveLogoCircles() {
    circleFooters.forEach(cf => {
        cf.classList.remove("visible");
    })
    mixCircleFooter.classList.remove("visible");
}

function expandFooter() {
    const scrollPercent = Math.min(getScrollPercent() / 100, 1);
    if (scrollPercent > 0.98) {
        moveLogoCircles();
    } else {
        unmoveLogoCircles();
    }
}

let animationInterval;

function stopRepeatingBounceOnScroll() {
    const scrollPercent = getScrollPercent();

    if (scrollPercent > 10) {
        clearInterval(animationInterval);
        window.removeEventListener('scroll', stopRepeatingBounceOnScroll);
        circleFooters[0].classList.remove('animation');
    }
}

function checkInitialScroll() {
    const movingCircle = circleFooters[0];
    const scrollPercent = getScrollPercent();
    if (scrollPercent > 10) {
        return;
    } else {
        movingCircle.classList.add("animation");

        animationInterval = setInterval(() => {
            movingCircle.classList.remove('animation'); // reset
            void movingCircle.offsetWidth; // force reflow
            movingCircle.classList.add('animation');
        }, 5000);

        window.addEventListener('scroll', stopRepeatingBounceOnScroll);
    }
}


function getScrollPercent() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return (scrollTop / docHeight) * 100;
}

function isMobile() {
  return window.innerWidth <= 768;
}

let onTouchStart = null;
let onTouchEnd = null;
let onTouchMove = null;

function initializeMobileInteraction(allDivs, items) {
    // Shared between events
    let isTouching = false;
    let startX = 0;
    let currentX = 0;
    let deltaX = 0;
    let currentIdx = 0;

    // --- Event handlers ---
    onTouchStart = (e) => {
        if (e.touches.length !== 1) return;
        startX = e.touches[0].clientX;
        currentX = startX;
        isTouching = true;
    };

    onTouchMove = (e) => {
        if (!isTouching || e.touches.length !== 1) return;
        currentX = e.touches[0].clientX;
        e.preventDefault();
    };

    onTouchEnd = () => {
        isTouching = false;
        deltaX = currentX - startX;  
        
        if (deltaX > 0) {
            // swipe right
            currentIdx = Math.max(0, --currentIdx);
        }  else if (deltaX < 0) {
            //swipe left
            currentIdx = Math.min(items.length-1, ++currentIdx);
        } else {
            // touch select
            selectArtwork(items[currentIdx]);
        }
        changeArtwork(null, items[currentIdx]);
        styleItemCarousel(allDivs, currentIdx);
        const offset = getOffset(allDivs, currentIdx);
        itemCarousel.style.transform = `translateX(-${offset}px)`;

    };
    addEvents();
}

function addEvents() {
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
}

function removeEvents() {
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
}

function getOffset(allDivs, idx) {
    // to know how much to move the item-carousel by currentIdx
    
    const marginRight = 20; // this comes from the margin-right of .item-c

    if (idx < 0 || idx >= allDivs.length) {
        return 0;
    }
    
    let offset = 0;
    for (let i = 0; i <= idx; i++) {
        let distance = allDivs[i].getBoundingClientRect().width;
        let gap = marginRight;
        if (i==idx) {
            distance = distance / 2;
            gap = 0;
        }
        offset += distance + gap;
    }

    return offset;
}

function styleItemCarousel(allDivs, idx) {
    allDivs.forEach((div, i) => {
        div.style.color = i === idx ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.3)';
    });
}

function selectArtwork(item) {
    artWorkContainer.classList.add('move-left');
    artWorkFrame.classList.add('invisible');
    detailSection.classList.add('visible');
    artworkSubject.classList.add('visible');
    detailTitle.classList.add('visible');
    circleBackToListButton.classList.add('visible');
    changeDetailTitle(item);
    changeDetailPhotos(item);
    changeDetailVideo(item);
    changeDescriptions(item);
    changeShopLabel(item);
    onScrollFnc = function () {
        onScroll(item);
    };

    window.removeEventListener('scroll', onScrollFnc);
    window.addEventListener('scroll', onScrollFnc);

    if (isMobile()) {
        itemCarousel.classList.add('invisible');
        clickForDetails.classList.add('invisible');
        backToListLabel.classList.add('visible');
        removeEvents();
    } else {
        list.classList.add('slide-left');
    }
}

function backToList() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.removeEventListener('scroll', onScrollFnc);
    artWorkContainer.classList.remove('move-left');
    artWorkFrame.classList.remove('invisible');
    detailSection.classList.remove('visible');
    
    artworkSubject.classList.remove('visible');
    detailTitle.classList.remove('visible');
    circleBackToListButton.classList.remove('visible');
    backToListLabel.classList.remove('visible');
    resetShopLabel();

    if (isMobile()) {
        itemCarousel.classList.remove('invisible');
        clickForDetails.classList.remove('invisible');
        addEvents();
    } else {
        list.classList.remove('slide-left');
    }
}
