interface EventType {
  type: string,
  title: string,
  source: string,
  time: string,
  description: string,
  icon: string,
  size: string,
  data: DataType
}

interface DataType {
  temperature: string,
  humidity: string
}

interface DataType {
  albumcover: string,
  artist: string,
  track: TrackType,
  volume: string,
}

interface DataType {
  buttons: [string]
}

interface DataType {
  image: [string]
}

interface DataType {
  type: string|[string]
}

interface TrackType {
  name: string,
  length: string
}


declare const data: any;

function eventTemplate(this: void) {
  const events:[EventType] = data.events;
  // микрошаблонизации для Event
  const contentElement: HTMLElement = document.querySelector('.grid');

  if (contentElement) {
    renderTemplate(contentElement, 'event', events);
  }

  function renderTemplate(element: HTMLElement, templateID: string, events:[EventType]) {
    events.forEach (function(event) {
      const el: HTMLTemplateElement = <HTMLTemplateElement>document.querySelector(`#${templateID}`);
      const template = <Element>el.content.cloneNode(true);

      ///Type
      const tempType = template.querySelector('div[data-event-type]');
      if (event.type ==='critical') {
        tempType.classList.add('event--critical');
      }

      // Size
      tempType.classList.add(`grid__item--${event.size}`);

      //Icon
      const tempIcon = template.querySelector('div[data-event-icon]');
      const icon = `icon--${event.icon}${event.type ==='critical'?'-white':''}`;
      tempIcon.classList.add(icon);


      //Title
      const tempTitle: HTMLElement = template.querySelector('h2[data-event-title]');
      tempTitle.innerText = event.title;

      // Source
      const tempSource: HTMLElement = template.querySelector('div[data-event-source]');
      tempSource.innerText = event.source;

      // Source
      const tempTime:HTMLElement = template.querySelector('div[data-event-time]');
      tempTime.innerText = event.time;


      // Content

      if (event.description) {
        const templateContentEl:HTMLTemplateElement = <HTMLTemplateElement>document.getElementById('event-content');
        const templateContent = <Element>templateContentEl.content.cloneNode(true);

        const templateContentInner = templateContent.querySelector('.event__content-inner');

        // var tempInner = templateContent.querySelector('.event__inner');

        // Description

        const tempDescription: HTMLElement = templateContent.querySelector('div[data-event-description]');
        tempDescription.innerText = event.description;

        tempType.appendChild(templateContent);

        if (event.data && event.data.temperature) {
          const templateIndicatorsEl:HTMLTemplateElement = <HTMLTemplateElement>document.getElementById('event-indicators');
          const templateIndicators = <Element>templateIndicatorsEl.content.cloneNode(true);

          const tempTemperature: HTMLElement = templateIndicators.querySelector('span[data-event-temperature]');

          tempTemperature.innerText = event.data.temperature;

          const tempHumidity:HTMLElement = templateIndicators.querySelector('span[data-event-humidity]');
          tempHumidity.innerText = event.data.humidity;

          templateContentInner.appendChild(templateIndicators);
        }

        if (event.data && event.data.albumcover) {
          const tempMusicEl:HTMLTemplateElement = <HTMLTemplateElement>document.getElementById('event-music');


          const tempMusic = <Element> tempMusicEl.content.cloneNode(true);

          const tempMusicTracCover = tempMusic.querySelector('img[data-music-track-cover]');
          tempMusicTracCover.setAttribute('src', event.data.albumcover);

          const tempMusicTrackName:HTMLElement = tempMusic.querySelector('div[data-music-track-name]');
          tempMusicTrackName.innerText = `${event.data.track.name} - ${event.data.artist}`;

          const tempMusicTrackLength:HTMLElement = tempMusic.querySelector('div[data-music-track-length]');
          tempMusicTrackLength.innerText = event.data.track.length;

          const tempMusicVolume:HTMLElement = tempMusic.querySelector('div[data-music-volume]');
          tempMusicVolume.innerText = event.data.volume;
          templateContentInner.appendChild(tempMusic);
        }

        if (event.data && event.data.buttons) {
          const templateAlertEl:HTMLTemplateElement = <HTMLTemplateElement>document.getElementById('event-alert');
          const templateAlert = <Element> templateAlertEl.content.cloneNode(true);
          templateContentInner.appendChild(templateAlert);
        }

        if (event.data && (event.data.type === 'graph')) {
          const templatePictureEl:HTMLTemplateElement = <HTMLTemplateElement>document.getElementById('event-picture');
          const templatePicture = <Element> templatePictureEl.content.cloneNode(true);
          templateContentInner.appendChild(templatePicture);
        }

        if (event.data && event.data.image) {
          const templateCameraEl:HTMLTemplateElement = <HTMLTemplateElement>document.getElementById('event-camera');
          const templateCamera = <Element>templateCameraEl.content.cloneNode(true);
          templateContentInner.appendChild(templateCamera);
        }
      }

      element.appendChild(template);
    });
  }

};

document.addEventListener('DOMContentLoaded', function () {
  'use strict';
  eventTemplate();
});
