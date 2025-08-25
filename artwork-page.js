import { 
    hideElements, 
    showElements, 
    isMobile, 
    showElementsWithTransition, 
    addInvisibleWithTransition,
    removeInvisibleWithTransition,
    getScrollPercent,
    doesFileExist
} from './utils.js';

const menuButton = document.getElementById("menu-button");
const itemListSingle = document.getElementById('item-list-single');
const itemListSeries = document.getElementById('item-list-series');
const artWork1 = document.getElementById("ir1");
const artWork2 = document.getElementById("ir2");
const atl1 = document.getElementById("atl1");
const atl2 = document.getElementById("atl2");
const ac1 = document.getElementById("ac1");
const ac2 = document.getElementById("ac2");
const warnings = document.querySelectorAll(".warning");
const note = document.getElementById("note");
const detailSection = document.getElementById("detail-section");
const subject = document.getElementById("subject");
const backToListLabel = document.getElementById("back-to-list-label");
const detailVerticalLine = document.getElementById("detail-vertical-line");
const detailInfo = document.getElementById("detail-info");
const detailComponents = document.querySelectorAll(".detail-component");
const mockupV1 = document.getElementById("mockup-v-1");
const mockupV2 = document.getElementById("mockup-v-2");
const mockupH1 = document.getElementById("mockup-h-1");
const video1 = document.getElementById("video");
const closeUpArt1 = document.getElementById("detail-1");
const closeUpArt2 = document.getElementById("detail-2");
const desc1 = document.getElementById("desc-1");
const desc2 = document.getElementById("desc-2");
const desc3 = document.getElementById("desc-3");
const desc4 = document.getElementById("desc-4");
const shadows = document.querySelectorAll(".shadow");
const backToTopLabel = document.getElementById("back-to-top-label-container");
const shopLabel = document.getElementById("desc-4");
const singleItemCarousel = document.getElementById("single-item-carousel");
const seriesItemCarousel = document.getElementById("series-item-carousel");

setTimeout(() => {
      menuButton.classList.add("transition", "after-welcome");
      menuButton.style.zIndex = "3";
}, 500);

let mode;
let onScrollFnc;
let selectedItem;
let activeSingleItems = [];
let activeSeries = [];
let onTouchStart = null;
let onTouchEnd = null;
let onTouchMove = null;
let selectedArtworkIdx = 0;

const [artworksResponse, seriesResponse] = await Promise.all([
      fetch("artworks.json"),
      fetch("artworks-series.json")
]);

const artworks = await artworksResponse.json();
const series = await seriesResponse.json();

activeSingleItems = artworks.filter(a => a.active);
activeSeries = series.filter(s => s.active);
initializeUI()


function initializeUI() {
    if (isMobile()) {
        renderMobileView(activeSingleItems, activeSeries);
    } else {
        renderDesktopView(activeSingleItems, activeSeries);
    }
}

function renderMobileView(singleItems, seriesItems) {
    populateMobileList(singleItems, "singles");
    populateMobileList(seriesItems, "series");
    registerEvents([singleItemCarousel], [seriesItemCarousel]);
    initializeMobileInteraction(singleItems, seriesItems);
}

function populateMobileList(items, mode="singles") {
    let itemCarousel = mode=="singles" ? singleItemCarousel : seriesItemCarousel;
    let itemClass = mode=="singles" ? "single-item-c" : "series-item-c";

    items.forEach((item, i) => {
        const div = document.createElement('div');
        div.classList.add('item-c', itemClass);
        setListItemLabels(div, item);
        itemCarousel.appendChild(div);
    });

    const allItemC = Array.from(document.getElementsByClassName(itemClass));
    const firstItem = allItemC[0];
    const firstItemLength = firstItem.getBoundingClientRect().width;

    itemCarousel.style.transform = `translateX(-${firstItemLength / 2}px)`;

    styleItemCarousel(allItemC, 0);
}

function renderDesktopView(singleItems, seriesItem) {
    populateSinglesList(singleItems);
    populateSeriesList(seriesItem)
    const singleListItems = document.querySelectorAll('.single-item');
    const seriesListItems = document.querySelectorAll('.series-item');
    registerEvents(singleListItems, seriesListItems);
}

function populateSinglesList(items) {
    items.forEach((item, i) => {
        const li = document.createElement('li');
        li.classList.add('item', 'label-underlined-when-hovered', 'single-item');
        li.style.setProperty("--underline-offset", "40vw");
        li.textContent = item.title;
        li.style.transitionDelay = `${i * 30}ms`;

        li.addEventListener('mouseover', () => {
            clearSelection();
            hoverSelection(li, item);
        });

        li.addEventListener('mouseleave', () => {
            clearSelection();
            hoverSelection(li, item);
        });

        if (!item.locked) {
            li.addEventListener('click', () => {
                selectArtwork(item);  
            });
        }
        itemListSingle.appendChild(li);
    });
}

function populateSeriesList(items) {
    items.forEach((item, i) => {
        const li = document.createElement('li');
        li.classList.add('item', 'label-underlined-when-hovered-right', 'series-item');
        li.style.setProperty("--underline-offset", "20vw");
        li.style.setProperty("--underline-origin", "right");
        li.style.setProperty("--underline-side", "1");
        setListItemLabels(li, item);
        li.style.transitionDelay = `${i * 30}ms`;

        li.addEventListener('mouseover', () => {
            clearSelection();
            hoverSelection(li, item, "series");
        });

        li.addEventListener('mouseleave', () => {
            clearSelection();
            hoverSelection(li, item, "series");
        });
        
        if (!item.locked) {
            li.addEventListener('click', () => {
                selectArtwork(item);  
            });
        }
        
        itemListSeries.appendChild(li);
    });
    
}

function registerEvents(singleItems, seriesItems) {
    atl1.addEventListener("click", () => {
        // Singles mode
        atl1.classList.add("remain");
        atl1.classList.remove("unselected");
        atl2.classList.add("unselected");
        atl2.classList.remove("remain");
        showElements([...singleItems]);
        hideElements([...seriesItems]);
        disableSeriesMode([ac1, ac2, subject]);
        clearSelectionAndArtWork();
        mode = "singles";
        selectedArtworkIdx = 0;
        showHoverSelectionMobile(selectedArtworkIdx);
    })

    atl2.addEventListener("click", () => {
        // Series mode
        atl2.classList.add("remain");
        atl2.classList.remove("unselected");
        atl1.classList.add("unselected");
        atl1.classList.remove("remain");
        hideElements([...singleItems]);
        showElements([...seriesItems]);
        enableSeriesMode([ac1, ac2, subject])
        clearSelectionAndArtWork();
        mode = "series";
        selectedArtworkIdx = 0;
        showHoverSelectionMobile(selectedArtworkIdx);
    })

    backToListLabel.addEventListener("click", () => {
        backToList()
    })

    backToTopLabel.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    })
}


function clearSelectionAndArtWork() {
    clearSelection();
    clearArtworks();
    hideElements([...warnings, note]);
    deregisterClickArtworks();
}


function clearSelection() {
    const items = Array.from(document.getElementsByClassName("item"));
    items.forEach(item => {
        item.style.transform = "translateX(0px)";
        item.classList.remove('remain');
    });
}

function hoverSelection(listItem, item, mode = "singles") {
    if (item.locked === true) {
        clearArtworks();
        showElements([...warnings]);
        hideElements([note]);
        deregisterClickArtworks();
        return;
    }
    if (!isMobile() && listItem != null) {
        listItem.style.transform = mode=="singles" ? "translateX(50px)" : "translateX(-50px)";
        listItem.classList.add('remain');
    }

    if (mode == "series") {
        preloadAndChangeBackgroundImage(artWork1, `assets/artworks/${item.folderName}/full.webp`);
        preloadAndChangeBackgroundImage(artWork2, `assets/artworks/${item.folderName}/mockup-v-1.webp`); /*TODO: change the path here*/ 

    } else {
        preloadAndChangeBackgroundImage(artWork1, `assets/artworks/${item.folderName}/full.webp`);
    }
    registerClickArtworks();
    preloadAndChangeBackgroundImage(subject, `assets/artworks/${item.folderName}/subject.webp`);
    showElements([note]);
    hideElements([...warnings]);
    selectedItem = item;
}

function enterDetailModeFnc() {
    selectArtwork(selectedItem);
}

function registerClickArtworks() {
    [ac1, ac2].forEach(el => {
        el.addEventListener("click", enterDetailModeFnc);
        el.style.cursor = "pointer";
    })
}

function deregisterClickArtworks() {
    [ac1, ac2].forEach(el => {
        el.removeEventListener("click", enterDetailModeFnc);
        el.style.cursor = "auto";
    })
}


function clearArtworks() {
    artWork1.style.backgroundImage = "none";
    artWork2.style.backgroundImage = "none";
    subject.style.backgroundImage = "none";
}


function preloadAndChangeBackgroundImage(el, url) {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      el.style.backgroundImage = `url(${url})`;
    };
}

function changeBackgroundColor(color){
    document.body.style.backgroundColor = color;
}

function setListItemLabels(el, item) {
    el.textContent = item.title; // always set the base text first

    if (item.locked) {
        const span = document.createElement("span");
        span.style.color = "red";
        span.textContent = " (*)";
        el.appendChild(span);
    }
}

function enableSeriesMode(els) {
    els.forEach(el => {
        el.classList.add('series');
    })
}

function disableSeriesMode(els) {
    els.forEach(el => {
        el.classList.remove('series');
    })
}

function selectArtwork(item) {
    const items = Array.from(document.getElementsByClassName("item"));

    clearSelection();
    showElementsWithTransition([subject, backToListLabel]);
    hideElements([...items, singleItemCarousel, seriesItemCarousel]);
    addInvisibleWithTransition([ac1, ac2, atl1, atl2]);
    changeBackgroundColor(item.mainColor);
    changeDetailPhotos(item);
    changeDescriptions(item);
    changeDetailVideo(item);
    changeShopLabel(item);
    deregisterClickArtworks();
    note.textContent = "(Slide down for details)";
    note.style.color= "white";
    menuButton.style.color = "white";
    detailInfo.style.display = "flex";
    document.body.style.overflowY = "scroll";
    document.body.style.overflowX = "hidden";
    onScrollFnc = function () {
        onScroll(item);
    };

    window.removeEventListener('scroll', onScrollFnc);
    window.addEventListener('scroll', onScrollFnc);

    if (mode == "series") {
        disableSeriesMode([subject]);
        desc4.textContent = "Shop this series"
    } else {
        desc4.textContent = "Shop this print"
    }

    if (isMobile()) {
        removeEvents();
        removeItemsFromDOM();
    }
}

function backToList(item) {
    const singleItems = Array.from(document.getElementsByClassName("single-item"));
    const seriesItems = Array.from(document.getElementsByClassName("series-item"));
    registerClickArtworks();
    hideElements([subject, backToListLabel, detailVerticalLine]);
    removeInvisibleWithTransition([ac1, ac2, atl1, atl2]);
    note.textContent = "(Click for details)";
    note.style.color= "black";
    changeBackgroundColor("white");
    menuButton.style.color = "black";
    document.body.style.overflowY = "hidden";
    document.body.style.overflowX = "hidden";
    detailInfo.style.display = "none";
    window.removeEventListener('scroll', onScrollFnc);
    

    if (mode == "series") {
        enableSeriesMode([subject]);
        setTimeout(() => {
            showElementsWithTransition([...seriesItems, seriesItemCarousel]);
        }, 500);
    } else {
        setTimeout(() => {
            showElementsWithTransition([...singleItems, singleItemCarousel]);
        }, 500);
    }

    if (isMobile()) {
        addEvents();
        putBackItemsInDOM();
    }
}

function onScroll(item) {
    const scrollPercent = Math.min(getScrollPercent() / 100, 1);
    if (scrollPercent > 0.1) {
        showElementsWithTransition([detailVerticalLine, ...shadows, ...detailComponents, backToTopLabel]);
        changeBackgroundColor('#000000');
        hideElements([note])
    } else {
        hideElements([detailVerticalLine, ...shadows, ...detailComponents, backToTopLabel]);
        changeBackgroundColor(item.mainColor); 
        showElements([note])
    }  
}

function changeDetailPhotos(item) {
    mockupV1.style.backgroundImage = `url(assets/artworks/${item.folderName}/mockup-v-1.webp)`;
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
    video1.style.display = 'block';
    video1.load();
    if (isMobile()) {
        detailVerticalLine.style.transform = "scale(0.87)"
    }
  } else {
    // Clear src so browser doesn't even try
    video1.removeAttribute('src');
    video1.style.display = 'none';
    video1.load(); // important: resets the video element
    detailVerticalLine.style.transform = "scale(0.74)"
  }
}


function changeDescriptions(item) {
    desc1.textContent = item.desc1;
    desc2.textContent = item.desc2;

    desc3.textContent = item.title;
    desc3.style.fontSize = "regular";

    const span = isMobile() ? document.createElement("p") : document.createElement("span");
    span.textContent = "Digital Painting";
    desc3.appendChild(span);
}

function handleClickShopLabel() {
    window.open(selectedItem.shopLink,'_blank');
}

function changeShopLabel(item) {
    shopLabel.removeEventListener("click", handleClickShopLabel);
    shopLabel.addEventListener("click", handleClickShopLabel);
}

function styleItemCarousel(allDivs, idx) {
    allDivs.forEach((div, i) => {
        div.style.color = i === idx ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.3)';
    });
}


function initializeMobileInteraction(singleItems, seriesItems) {

    // Shared between events
    let isTouching = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let deltaX = 0;

    // --- Event handlers ---
    onTouchStart = (e) => {
        if (e.touches.length !== 1) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        currentX = startX;
        currentY = startY;
        isTouching = true;
    };

    onTouchMove = (e) => {
        if (!isTouching || e.touches.length !== 1) return;
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
        e.preventDefault();
    };

    onTouchEnd = () => {
        if (mode === undefined) return
        let items = mode=="singles" ? singleItems : seriesItems;


        isTouching = false;
        deltaX = currentX - startX;  
        const viewportHeight = window.innerHeight;
        
        if (currentY < viewportHeight/5) {
            // if touch above the labels -> do not register
            return;
        }
        if (deltaX > 0) {
            // swipe right
            selectedArtworkIdx = Math.max(0, --selectedArtworkIdx);
        }  else if (deltaX < 0) {
            //swipe left
            selectedArtworkIdx = Math.min(items.length-1, ++selectedArtworkIdx);
        } else {
            // touch select

            // if touch in the middle section of the screen
            
            if (currentY > viewportHeight/6 && currentY < viewportHeight/8*7) {
                if(items[selectedArtworkIdx].locked === true) {
                    return;
                }
                selectArtwork(items[selectedArtworkIdx]);
            }
        }
        showHoverSelectionMobile(selectedArtworkIdx);
    };
    addEvents();
}

function showHoverSelectionMobile(idx) {
    let itemClass = mode=="singles" ? "single-item-c" : "series-item-c";
    let items = mode=="singles" ? activeSingleItems : activeSeries;
    let itemCarousel = mode=="singles" ? singleItemCarousel : seriesItemCarousel;
    const allDivs = Array.from(document.getElementsByClassName(itemClass));
    
    hoverSelection(null, items[idx]);
    styleItemCarousel(allDivs, idx);
    const offset = getOffset(allDivs, idx);
    itemCarousel.style.transform = `translateX(-${offset}px)`;
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

function removeItemsFromDOM() {
    // need this bc we need to remove the items from the DOM
    // otherwise, it overflows to the left, causing the page to be scrollable horizontally
    setTimeout(() => {
        [singleItemCarousel, seriesItemCarousel, ac1, ac2].forEach(el => {
            el.style.display = 'none'
        })
    }, 1000);
}

function putBackItemsInDOM() {
    [singleItemCarousel, seriesItemCarousel].forEach(el => {
        el.style.display = 'flex'
    });
    [ac1, ac2].forEach(el => {
        el.style.display = 'block'
    });
}