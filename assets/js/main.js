(function () {
  class PageNav {
    topPosition = 0;
    prevScroll = window.scrollY;

    constructor(element) {
      this.element = element;
      this.updateHeight();

      new ResizeObserver(() => this.updateHeight()).observe(this.element);
      window.addEventListener('scroll', (e) => {
        if (window.matchMedia('(min-width: 600px)').matches) {
          this.setTopPosition(0);
          return;
        }

        const currentScroll = window.scrollY;

        if (this.prevScroll > currentScroll) {
          this.setTopPosition(0);
        } else {
          this.setTopPosition(-this.element.offsetHeight);
        }

        this.prevScroll = currentScroll;
      });
    }

    updateHeight() {
      document.documentElement.style.setProperty(
        '--nav-height',
        `${this.element.clientHeight + this.topPosition}px`,
      );
    }

    setTopPosition(top) {
      if (top == this.topPosition) return;
      this.topPosition = top;
      this.updateHeight();
      this.element.style.top = `${top}px`;
    }
  }

  window.onload = () => {
    const pageNav = new PageNav(document.querySelector('nav'));
  };
})();
