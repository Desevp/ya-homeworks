// app/timers.js

function getTimeToCurrent(beginTime){
  let diffMs = Date.now() - beginTime;
  let timer = new Date(diffMs);
  return timer.toISOString().substr(11, 8);
}

module.exports.getTimeToCurrent = getTimeToCurrent;
