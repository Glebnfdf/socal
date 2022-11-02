export default class Scrollbar {
  constructor() {
    this.thumbMinSize = 20;
    this.showScrollHandler = null;
    this.timerEnable = false;
    this.timerId = 0;
  }

  init(container) {
    let isValid = this.setElementsReference(container);
    if (!isValid) {
      console.error("Не найдены html элементы для scrollbar");
      return;
    }
    this.addObserver();
    this.addListener();
  }

  setElementsReference(container) {
    if (container) {
      const contentWrapper = container.querySelector(".scroll-content-wrapper");
      const track = container.querySelector(".scroll-vtrack");
      const thumb = container.querySelector(".scroll-thumb");
      if (contentWrapper && track && thumb) {
        this.container = container;
        this.contentWrapper = contentWrapper;
        this.track = track;
        this.thumb = thumb;
        return true;
      }
    }
    return false;
  }

  addObserver() {
    // наблюдаем за изменением высоты контейнера
    this.resizeContObserver = new ResizeObserver(() => {
      this.resizeContHandle();
    });
    this.resizeContObserver.observe(this.container);

    // наблюдаем за изменением дочерних элементов
    this.mutationObserver = new MutationObserver(() => {
      this.resizeContHandle();
    })
    this.mutationObserver.observe(this.contentWrapper, {
      childList: true,
      characterData: true,
      subtree: true
    })

    this.resizeContHandle();
  }

  addListener() {
    this.contentWrapper.addEventListener("scroll", this.scrollHandle);
    this.thumb.addEventListener("mousedown", this.startDragThumb);
  }

  destroy() {
    if (this.resizeContObserver) {
      this.resizeContObserver.disconnect();
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    this.contentWrapper.removeEventListener("scroll", this.scrollHandle);
    this.thumb.removeEventListener("mousedown", this.startDragThumb);
    this.container = null;
    this.contentWrapper = null;
    this.track = null;
    this.thumb = null;
    this.showScrollHandler = null;
    clearTimeout(this.timerId);
  }

  resizeContHandle() {
    // таймер - это костыль на непонятную историю: в процессе формирования Dom дерева в какой-то момент (не понятно
    // почему) размер this.contentWrapper.scrollHeight становится большим, но после нормализуются, однако нормальное
    // значение в библиотеку не поступает, поэтому библиотека оперирует предыдущим не верным состоянием и отсюда баги
    if (!this.timerEnable) {
      this.timerEnable = true;
      this.timerId = setTimeout(() => {
        this.timerEnable = false;
        this.setTrackVisible();
        this.setThumbHeight();
      }, 50);
    }
  }

  setTrackVisible() {
    if (this.contentWrapper.offsetHeight === this.contentWrapper.scrollHeight) {
      this.trackVisible = false;
      this.track.style.display = "none";
    } else {
      this.trackVisible = true;
      this.track.style.display = "block";
    }
    if (this.showScrollHandler) {
      this.showScrollHandler(this.contentWrapper.offsetHeight !== this.contentWrapper.scrollHeight);
    }
  }

  setThumbHeight() {
    if (this.trackVisible) {
      this.thumb.style.height =
        `${Math.max(
          Math.round((this.contentWrapper.clientHeight / this.contentWrapper.scrollHeight) * this.track.clientHeight) - 4,
          this.thumbMinSize
        )}px`;
    }
  }

  scrollHandle = () => {
    if (this.trackVisible) {
      this.thumb.style.top = `${Math.min(
        Math.round(this.contentWrapper.scrollTop / this.contentWrapper.scrollHeight * this.track.clientHeight) + 2,
        this.track.clientHeight - this.thumb.clientHeight)}px`;
    }
  }

  startDragThumb = (event) => {
    this.isScrollDrag = true;
    this.initialMouseY = event.clientY;
    this.initialVScrollTop = this.contentWrapper.scrollTop;
    window.addEventListener("mousemove", this.draggingVThumb);
    window.addEventListener("mouseup", this.stopDragging);
    window.addEventListener("mouseleave", this.stopDragging);
  }

  draggingVThumb = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const deltaY = (event.clientY - this.initialMouseY) * (this.contentWrapper.offsetHeight / this.thumb.clientHeight);
    this.contentWrapper.scrollTop =
      Math.min(
        this.initialVScrollTop + deltaY,
        this.contentWrapper.scrollHeight - this.contentWrapper.offsetHeight
      );
  }

  stopDragging = () => {
    this.isScrollDrag = false;
    window.removeEventListener("mousemove", this.draggingVThumb);
    window.removeEventListener("mouseup", this.stopDragging);
    window.removeEventListener("mouseleave", this.stopDragging);
  }

  getIsScrollDrag() {
    return this.isScrollDrag;
  }

  scroll2Top() {
    this.contentWrapper.scrollTop = 0;
    this.thumb.style.top = 2 + "px";
  }

  showScrollListener = (_showScrollHandler) => {
    this.showScrollHandler = _showScrollHandler;
  }
}
