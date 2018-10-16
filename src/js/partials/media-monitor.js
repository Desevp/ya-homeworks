(function() {

  let videoItems = document.querySelectorAll('.js-show-video');
  let close = document.querySelector('.js-video-close');
  let monitor = document.querySelector('.media-monitor');
  let currentFullItem = false;
  let currentNum = false;
  let controlWrappers = document.querySelectorAll('.media-monitor__controls');

  for (let i = 0; i < videoItems.length; i++) {
    videoItems[i].addEventListener('click', function() {
      let curItem = [].indexOf.call(this.parentElement.children, this);
      fullscrenVideo(this, curItem);
    });

    let inputControlContrast = videoItems[i].querySelector('.media-monitor__control-contrast');
    let inputControlBrightness = videoItems[i].querySelector('.media-monitor__control-brightness');

    inputControlContrast.addEventListener('change', function(e) {
      if (currentFullItem) {
        changeFilter(currentFullItem, 'contrast', e.target.value);
      }
    });

    inputControlBrightness.addEventListener('change', function(e) {
      if (currentFullItem) {
        changeFilter(currentFullItem, 'brightness', e.target.value);
      }
    });
  }

  close.addEventListener('click', function(){
    showAllVideo();
  });

  function fullscrenVideo(item, current) {
    currentNum = current;
    item.classList.add('media-monitor__section--is-full');
    monitor.classList.add('is-fullscreen');
    let leftTrans = (item.offsetLeft > 0)?'-50%':'50%';
    let topTrans = (item.offsetTop > 0)?'-50%':'50%';
    item.style.transform = `translate(${leftTrans}, ${topTrans}) scale(2, 2)`;
    currentFullItem = item.querySelector('.media-monitor__inner');
    close.classList.add('media-monitor__close--is-show');
    controlWrappers[currentNum].classList.add('media-monitor__controls--is-show');

  }

  function showAllVideo() {
    if (currentFullItem) {
      let section = currentFullItem.parentElement;
      section.style.transform = 'translate(0, 0) scale(1, 1)';
      monitor.classList.remove('is-fullscreen');
      close.classList.remove('media-monitor__close--is-show');
      controlWrappers[currentNum].classList.remove('media-monitor__controls--is-show');

      let timer = setTimeout(function() {
        section.classList.remove('media-monitor__section--is-full');
        currentFullItem = false;
        currentNum = false;
        clearTimeout(timer);
      }, 500);
    }
  }

  function changeFilter(item, filter, value) {
    item.style.filter = `${filter}(${value}%)`;
  }
})();
