(function() {
  let monitor = document.querySelector('.media-monitor');
  let videoSections = monitor.querySelectorAll('.js-show-video');
  let videoItems = monitor.querySelectorAll('video');
  let close = monitor.querySelector('.js-video-close');
  let currentFullItem = false;
  let currentNum = false;
  let controlWrappers = monitor.querySelectorAll('.media-monitor__controls');
  let soundElement = monitor.querySelector('.js-video-sound');

  for (let i = 0; i < videoSections.length; i++) {
    videoSections[i].addEventListener('click', function() {
      let curItem = [].indexOf.call(this.parentElement.children, this);
      fullscrenVideo(this, curItem);
    });

    let inputControlContrast = videoSections[i].querySelector('.media-monitor__control-contrast');
    let inputControlBrightness = videoSections[i].querySelector('.media-monitor__control-brightness');

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
    videoItems[current].muted = false;
    item.classList.add('media-monitor__section--is-full');
    monitor.classList.add('is-fullscreen');
    let leftTrans = (item.offsetLeft > 0)?'-50%':'50%';
    let topTrans = (item.offsetTop > 0)?'-50%':'50%';
    item.style.transform = `translate(${leftTrans}, ${topTrans}) scale(2, 2)`;
    currentFullItem = item.querySelector('.media-monitor__inner');
    close.classList.add('media-monitor__close--is-show');
    soundElement.classList.add('media-monitor__sound--is-show');
    controlWrappers[currentNum].classList.add('media-monitor__controls--is-show');
    beginAnalyzeSound(videoItems[current]);
  }

  function showAllVideo() {
    if (currentFullItem) {
      let section = currentFullItem.parentElement;
      section.style.transform = 'translate(0, 0) scale(1, 1)';
      monitor.classList.remove('is-fullscreen');
      close.classList.remove('media-monitor__close--is-show');
      soundElement.classList.remove('media-monitor__sound--is-show');
      controlWrappers[currentNum].classList.remove('media-monitor__controls--is-show');
      videoItems[currentNum].muted = true;
      endAnalyzeSound(context);

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


let context	= new AudioContext();
var MEDIA_ELEMENT_NODES = new WeakMap();
let node;

function beginAnalyzeSound(videoItem) {
  var source;
  context.resume();

  if (MEDIA_ELEMENT_NODES.has(videoItem)) {
    source = MEDIA_ELEMENT_NODES.get(videoItem);
  } else {
    source = context.createMediaElementSource(videoItem);
    MEDIA_ELEMENT_NODES.set(videoItem, source);
  }

  var analyser = context.createAnalyser();
  analyser.smoothingTimeConstant = 0.3;
  analyser.fftSize = 1024;

  if (!node) {
    node = context.createScriptProcessor(2048, 1, 1);
  }

  node.addEventListener('audioprocess', function() {
    var array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    showSound(array);
  });

  source.connect(analyser);
  source.connect(context.destination);
  node.connect(context.destination);
  analyser.connect(node);
}

let showSound = throttle(function(array) {
  soundElement.style.height = `${average(array) * 2}px`
}, 50);

function endAnalyzeSound(context) {
  context.suspend();
}

function average(array) {
  let numbers;
  if (array[0] instanceof Array) {
    numbers = array[0];
  }
  else if (typeof array[0] == 'number') {
    numbers = array;
  }
  let sum = 0;
  let average = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  average = sum / numbers.length;
  return average;
}

function throttle(func, ms) {

  var isThrottled = false,
    savedArgs,
    savedThis;

  function wrapper() {

    if (isThrottled) {
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    func.apply(this, arguments);

    isThrottled = true;

    setTimeout(function() {
      isThrottled = false;
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}

})();
