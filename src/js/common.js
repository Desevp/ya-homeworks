document.addEventListener('DOMContentLoaded', function () {
  'use strict';
  @@include('flux/eventEmitter.js')
  @@include('flux/dispatcher.js')
  @@include('flux/store.js')
  @@include('flux/view.js')
  @@include('links.js')
  @@include('reducer.js')

  @@include('fluxCommon.js')

  @@include('partials/main.js')
  @@include('partials/eventTemplate.js')
});

window.onload = function() {

};
