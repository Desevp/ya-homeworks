(function() {
  // открытие мобильного меню
  class toggleMenu {
    constructor(btnClass) {
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
})();
