import Scrollbar from '../../src/lib/scrollbar';
import './script';
import './main';

const scrollbar = new Scrollbar();
const scrollbarTwo = new Scrollbar();
const scrollbarPopup = new Scrollbar();
const scrollbarSearch = new Scrollbar();

document.addEventListener('DOMContentLoaded', initMain);

function initMain() {
  const scrollContainer = document.querySelector('.scroll-cont');
  if (scrollContainer) {
    scrollbar.init(scrollContainer);
  }

  const scrollContainerTwo = document.querySelector('.scroll-cont-bottom');
  if (scrollContainerTwo) {
    scrollbarTwo.init(scrollContainerTwo);
  }

  const scrollContainerPopup = document.querySelector('.scroll-cont-popup');
  if (scrollContainerPopup) {
    scrollbarPopup.init(scrollContainerPopup);
  }

  const scrollContainerPopupSearch = document.getElementById("add-tech-scroll-cont");
  if (scrollContainerPopupSearch) {
    scrollbarSearch.init(scrollContainerPopupSearch);
  }
}
