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


(function() {
  let videoItems = document.querySelectorAll('.js-show-video');
  let close = document.querySelector('.js-video-close');

  for (var i = 0; i < videoItems.length; i++) {
    videoItems[i].addEventListener('click', function() {
      fullscrenVideo(this);
    }, false);
  }

  let currentFullItem = false;

  close.addEventListener('click', function(){
    showAllVideo();
  });

  var monitor = document.querySelector('.media-monitor');

  function fullscrenVideo(item) {
    item.classList.add('media-monitor__section--is-full');
    monitor.classList.add('is-fullscreen');
    monitor.classList.add('is-fullscreen2');

    let leftTrans = (item.offsetLeft > 0)?'-50%':'50%';
    let topTrans = (item.offsetTop > 0)?'-50%':'50%';
    item.style.transform = `translate(${leftTrans}, ${topTrans}) scale(2, 2)`;

    currentFullItem = item;

    close.classList.add('media-monitor__close--is-show');
  }

  function showAllVideo() {
    if (currentFullItem) {
      currentFullItem.style.transform = 'translate(0, 0) scale(1, 1)';
      monitor.classList.remove('is-fullscreen');
      monitor.classList.remove('is-fullscreen2');
      close.classList.remove('media-monitor__close--is-show');

      let timer = setTimeout(function() {
        currentFullItem.classList.remove('media-monitor__section--is-full');
        currentFullItem = false;
        clearTimeout(timer);
      }, 500);
    }
  }
})();
