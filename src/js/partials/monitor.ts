'use strict';
window.onload = function () {
  let monitorEl: HTMLElement = document.querySelector('.js-monitor');
  if (monitorEl) {
    initMonitor(monitorEl);
  }
};

function initMonitor(el:HTMLElement) {
  let screen:HTMLElement = el;
  let screenInner:HTMLElement = el.querySelector('.monitor__screen-inner');
  let scaleTextCont:HTMLElement = document.querySelector('.monitor__scale');
  let brightnessTextCont:HTMLElement = document.querySelector('.monitor__brightness');
  let coefWidth:number = 1;

  const nodeState = {
      startPosition: 0,
      currScale: 1.0,
      scaleFactor: 1.0,
      maxZoom: 4.0,
      minZoom: 1,
      curentBright: 0.5
  };

  interface Coord {
    prevX: number,
    prevY: number
  }

  scaleTextCont.textContent = nodeState.currScale.toString();
  brightnessTextCont.textContent = (nodeState.curentBright * 100).toString();

  const indicatorWidthElement = createWidthIndicator();
  changeWidthIndicator();
  changePositionIndicator(0);

  interface GestureArrayItem {
    id: number,
    startX: number,
    prevX: number,
    startY: number,
    prevY: number
  }

  interface prevType {
    distance?: number,
    angle?: number,
    isGest?: boolean|string, // удалось ли определить жест (false или String)
    delay?: number
  }

  interface CoordAngle {
    x: number,
    y: number
  }


  let gestureArray: GestureArrayItem[]|[] = [];
  let angleStart:number = 0;
  let distanceStart:number = 0;
  let prev:prevType = {};

  screenInner.addEventListener('pointerdown', (event:PointerEvent) => {
      screen.style.transition = 'none';
      screen.setPointerCapture(event.pointerId);

      gestureArray = [ ...gestureArray, {
        id: event.pointerId,
        startX: event.x,
        prevX: event.x,
        startY: event.y,
        prevY: event.y
      }];

      if (gestureArray.length === 2) {
        let t1 = {
          x: gestureArray[0].startX,
          y: gestureArray[0].startY
        }

        let t2 = {
          x: gestureArray[1].startX,
          y: gestureArray[1].startY
        }

        // Расстояние и угол при первом касании

        distanceStart = distance(gestureArray[0], gestureArray[1]);
        angleStart = angle(t1, t2);

        // Информация о предыдущем событии перемещения

        prev = {
          distance: distanceStart,
          angle: angleStart,
          isGest: false, // удалось ли определить жест (false или String)
          delay: 10 // пропускаем первые события
        }
      }
  });

  screen.addEventListener('pointermove', (event) => {
      if (gestureArray.length === 1) {
        // Жест влево-вправо
        const {startX} = gestureArray[0];
        const {x} = event;
        const dx = x - startX;
        let dif = dx + nodeState.startPosition;

        if (dif + screenInner.scrollWidth - screen.offsetWidth < 0) {
          screenInner.style.transform = `translateX(${screen.offsetWidth - screenInner.scrollWidth}) scale( ${nodeState.currScale}, ${nodeState.currScale})`

          changePositionIndicator(screen.offsetWidth - screenInner.scrollWidth);
          return;
        }

        if (dif > 0) {
          screenInner.style.transform = 'translateX(0) scale( ${nodeState.currScale}, ${nodeState.currScale})';
          changePositionIndicator(0);
          return;
        }
        changePositionIndicator(dif);
        screenInner.style.transform = `translateX(${dif}px) scale( ${nodeState.currScale}, ${nodeState.currScale})`;
        gestureArray[0].prevX = x;
      }
      else {
        if (gestureArray.length === 2) {
          // Обновляем информацию о прикосновении

          for (let i = 0; i < gestureArray.length; i++) {
            if (event.pointerId === gestureArray[i].id) {
              const {x, y} = event;
              gestureArray[i].prevX = x;
              gestureArray[i].prevY = y;
            }
          }

          let newCoord = {
            x: gestureArray[0].prevX,
            y: gestureArray[0].prevY
          }

          let newCoord2 = {
            x: gestureArray[1].prevX,
            y: gestureArray[1].prevY
          }

          // Поворот или пинч

          let tempAngle = Math.abs(angle(newCoord, newCoord2) - angleStart);
          let tempDistance = Math.abs(distance(gestureArray[0], gestureArray[1]) - distanceStart);

          if (!prev.isGest && !prev.delay) {
            if (((Math.abs(tempAngle) > 0.2) && (Math.abs(tempDistance) < 20) || (Math.abs(tempAngle) > 0.35))) {
              prev.isGest = 'rotate';
              return
            }

            if (((tempAngle < 0.1) && (Math.abs(tempDistance) > 15) || (Math.abs(tempDistance) > 60))) {
              prev.isGest = 'pinch';
              return
            }
          }

          // pinch
          if (prev.isGest === 'pinch') {
            let temp = nodeState.currScale = distance(gestureArray[0], gestureArray[1]) / distanceStart * nodeState.scaleFactor;

            if (gestureArray.length === 2) {
              if (temp > nodeState.maxZoom) {
                temp = nodeState.maxZoom;
              }
              else if (temp < nodeState.minZoom) {
                temp = nodeState.minZoom;
              }
            }

            screenInner.style.webkitTransform = `scale( ${temp}, ${temp})`;
            nodeState.currScale = temp;
            scaleTextCont.textContent = (Math.round(temp * 100) / 100).toString();
            return;
          }

          //Rotate
          if (prev.isGest === 'rotate') {
            let curAngle = angle(newCoord, newCoord2) - angleStart;

            let brightless = (curAngle > 0)?((nodeState.curentBright >= 1)?1:(nodeState.curentBright * 100 + 2)/100):(nodeState.curentBright <= 0)?0:((nodeState.curentBright * 100 - 2)/100);

            nodeState.curentBright = brightless;
            screenInner.style.webkitFilter = `brightness(${brightless})`;
            brightnessTextCont.textContent = Math.round(nodeState.curentBright * 100).toString();
            return;
          }
          prev.distance = tempDistance;
          prev.angle = tempAngle;
          prev.delay = (prev.delay > 0)?(prev.delay - 1) : 0;
        }
      }
  });

  const cancelEvent = () => {
      if (gestureArray.length === 0) {
          return;
      }

      if (gestureArray.length === 1) {
        nodeState.startPosition = nodeState.startPosition - gestureArray[0].startX +
        gestureArray[0].prevX;
      }

      nodeState.scaleFactor = nodeState.currScale;
      gestureArray.length = 0;
  }

  screen.addEventListener('pointerup', cancelEvent);
  screen.addEventListener('pointercancel', cancelEvent);

  // Создание индикатора ширины
  function createWidthIndicator() {
    let indicatorWidthElement = document.createElement('div');
    indicatorWidthElement.className = 'monitor__screen-indicator';
    screen.appendChild(indicatorWidthElement);
    return indicatorWidthElement;
  }

  // Изменение ширины индикатора
  function changeWidthIndicator() {
    var widthScreen = screen.offsetWidth;
    var widthPicture = screenInner.scrollWidth;
    coefWidth = widthScreen/(widthPicture * nodeState.currScale);
    var widthIndicator = widthScreen * coefWidth;
    indicatorWidthElement.style.width = `${widthIndicator}px`;
  }

  // Изменение позиции индикатора
  function changePositionIndicator(value:number) {
    indicatorWidthElement.style.transform = `translateX(${-value * coefWidth * nodeState.currScale}px)`;
  }

  // Расстояние между двумя точками
  function distance(p1:Coord, p2:Coord) {
    return (Math.sqrt(Math.pow((p1.prevX - p2.prevY), 2) + Math.pow((p1.prevY - p2.prevY), 2)));
  }

  // Угол между двумя векторами
  function angle(p1:CoordAngle, p2:CoordAngle) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
  }
}
