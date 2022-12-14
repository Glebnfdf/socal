declare module "scrollbar" {
  export default class Scrollbar {
    constructor();

    init(container: HTMLElement): void;

    destroy(): void;

    getIsScrollDrag(): boolean;

    scroll2Top(): void;

    showScrollListener(showScrollHandler: (isShow: boolean) => void): void;

    scrollToTop(): void;

    scrollToBottom(): void;
  }
}
