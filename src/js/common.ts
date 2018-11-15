document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  class toggleMenu {
    burger: HTMLElement;
    constructor(btnClass: string) {
      this.burger = document.querySelector(btnClass);
      this.init();
    }

    init() {
      this.burger.addEventListener('click', function() {
        this.classList.toggle('burger--is-active');
      });
    }
  }

  new toggleMenu('.js-menu');

});
