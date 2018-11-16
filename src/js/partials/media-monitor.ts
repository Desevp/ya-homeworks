(function() {
  const monitor = document.querySelector('.media-monitor');
  const videoSections = monitor.querySelectorAll('.js-show-video');
  const videoItems = monitor.querySelectorAll('video');
  const close = monitor.querySelector('.js-video-close');
  const controlWrappers = monitor.querySelectorAll('.media-monitor__controls');
  const soundElement:HTMLElement = monitor.querySelector('.js-video-sound');
  let currentFullItem:HTMLElement|boolean = false;
  let currentNum:number|boolean = false;

  const context	= new AudioContext();
  const node = context.createScriptProcessor(2048, 1, 1);
  const MEDIA_ELEMENT_NODES = new WeakMap();

  const showSound = throttle(function(array) {
    soundElement.style.height = `${average(array) * 2}px`
  }, 50);

  for (let i = 0; i < videoSections.length; i++) {
    videoSections[i].addEventListener('click', function() {
      let curItem:number = [].indexOf.call(this.parentElement.children, this);
      fullscrenVideo(this, curItem);
    });

    let inputControlContrast = videoSections[i].querySelector('.media-monitor__control-contrast');
    let inputControlBrightness = videoSections[i].querySelector('.media-monitor__control-brightness');

    inputControlContrast.addEventListener('change', function(e:Event) {
      if (currentFullItem) {
        changeFilter(currentFullItem, 'contrast',  (e.target as HTMLInputElement).value);
      }
    });

    inputControlBrightness.addEventListener('change', function(e) {
      if (currentFullItem) {
        changeFilter(currentFullItem, 'brightness',  (e.target as HTMLInputElement));
      }
    });
  }

  close.addEventListener('click', showAllVideo);

  // Увеличить видео
  function fullscrenVideo(item, current:number) {
    currentNum = current;
    videoItems[current].muted = false;
    item.classList.add('media-monitor__section--is-full');
    monitor.classList.add('is-fullscreen');
    let leftTrans = (item.offsetLeft > 0)?'-50%':'50%';
    let topTrans = (item.offsetTop > 0)?'-50%':'50%';
    item.style.transform = `translate(${leftTrans}, ${topTrans}) scale(2, 2)`;
    currentFullItem: HTMLElement = item.querySelector('.media-monitor__inner');
    close.classList.add('media-monitor__close--is-show');
    soundElement.classList.add('media-monitor__sound--is-show');
    controlWrappers[currentNum].classList.add('media-monitor__controls--is-show');
    beginAnalyzeSound(videoItems[current]);
  }

  // Вернуться ко всем видео
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

  // Изменение фильтра
  function changeFilter(item, filter, value) {
    item.style.filter = `${filter}(${value}%)`;
  }

  // Начать анализ звука
  function beginAnalyzeSound(videoItem) {
    let source;
    context.resume();

    if (MEDIA_ELEMENT_NODES.has(videoItem)) {
      source = MEDIA_ELEMENT_NODES.get(videoItem);
    } else {
      source = context.createMediaElementSource(videoItem);
      MEDIA_ELEMENT_NODES.set(videoItem, source);
    }

    let analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize = 1024;

    node.addEventListener('audioprocess', function() {
      const array:any = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      showSound(array);
    });

    source.connect(analyser);
    source.connect(context.destination);
    node.connect(context.destination);
    analyser.connect(node);
  }

  // Приостановить анализ звука
  function endAnalyzeSound(context) {
    context.suspend();
  }

  // Средние значения
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

  // Тормозилка
  function throttle(func, ms) {
    let isThrottled = false,
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
