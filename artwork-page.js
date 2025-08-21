import { hideElements, showElements } from './utils.js';

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

setTimeout(() => {
      menuButton.classList.add("transition", "after-welcome");
}, 500);



let activeSingleItems = [];
let activeSeries = [];

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
        renderMobileView(activeSingleItems);
    } else {
        renderDesktopView(activeSingleItems, activeSeries);
    }
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

        li.addEventListener('click', () => {
            selectedArtworkIdx = i;
            selectArtwork(item);

            
        });
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

        li.addEventListener('click', () => {
            selectedArtworkIdx = i;
            selectArtwork(item);

            
        });
        itemListSeries.appendChild(li);
    });
    
}

function registerEvents(singleItems, seriesItems) {
    atl1.addEventListener("click", () => {
        atl1.classList.add("remain");
        atl1.classList.remove("unselected");
        atl2.classList.add("unselected");
        atl2.classList.remove("remain");
        showElements([...singleItems]);
        hideElements([...seriesItems]);
        enableSinglesMode();
        resetSelection();
    })

    atl2.addEventListener("click", () => {
        atl2.classList.add("remain");
        atl2.classList.remove("unselected");
        atl1.classList.add("unselected");
        atl1.classList.remove("remain");
        hideElements([...singleItems]);
        showElements([...seriesItems]);
        enableSeriesMode()
        resetSelection();
    })
}


function resetSelection() {
    clearSelection();
    clearArtworks();
    hideElements([...warnings, note]);
}


function clearSelection() {
    const items = Array.from(document.getElementsByClassName("item"));
    items.forEach(item => {
        item.style.transform = "translateX(0px)";
        item.classList.remove('remain');
    });
}

function hoverSelection(listItem, item, mode = "singles") {
    menuButton.style.color = item.mainColor;
    if (listItem != null) {
        listItem.style.transform = mode=="singles" ? "translateX(50px)" : "translateX(-50px)";
        listItem.classList.add('remain');
    }
    

    
    // preloadAndChangeBackgroundImage(artworkSubject, `assets/artworks/${item.folderName}/subject.webp`);

    if (mode == "series") {
        if (item.locked) {
            clearArtworks();
            showElements([...warnings]);
            hideElements([note]);
            return;
        } else {
            preloadAndChangeBackgroundImage(artWork1, `assets/artworks/${item.folderName}/full.webp`);
            preloadAndChangeBackgroundImage(artWork2, `assets/artworks/${item.folderName}/mockup-v-1.webp`); /*TODO: change the path here*/ 
        }
    } else {
        preloadAndChangeBackgroundImage(artWork1, `assets/artworks/${item.folderName}/full.webp`);
    }
    showElements([note]);
    hideElements([...warnings]);
}

function clearArtworks() {
    artWork1.style.backgroundImage = "none";
    artWork2.style.backgroundImage = "none";
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
        span.textContent = " (Coming soon)";
        el.appendChild(span);
    }
}

function enableSeriesMode() {
    ac1.classList.add('series');
    ac2.classList.add('series');
}

function enableSinglesMode() {
    ac1.classList.remove('series');
    ac2.classList.remove('series');
}


function isMobile() {
    //we're not checking screen size bc desktop could resize to small screen size 
    // this checks whether the device supports touch
    return "ontouchend" in document;
}