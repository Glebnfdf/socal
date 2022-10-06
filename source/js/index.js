import Scrollbar from './scrollbar.js';
import './script';
import './main';

const scrollbar = new Scrollbar();
document.addEventListener('DOMContentLoaded', initMain);

function initMain() {
  const scrollContainer = document.querySelector('.scroll-cont');
  if (scrollContainer) {
    scrollbar.init(scrollContainer);
  }
}
