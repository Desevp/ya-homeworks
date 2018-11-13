document.addEventListener('DOMContentLoaded', function () {
  'use strict';
  @@include('flux/eventEmitter.js')
  @@include('flux/dispatcher.js')
  @@include('flux/store.js')
  @@include('flux/view.js')
  @@include('reducer.js')

  @@include('fluxViews.js')
  @@include('fluxCommon.js')
  @@include('partials/main.js')
  @@include('partials/eventTemplate.js')
});

window.onload = function() {

};
