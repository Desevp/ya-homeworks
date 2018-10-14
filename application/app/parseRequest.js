// app/filter.js

function filter(obj, request, parameter) {
  if (request) {
    let typerequest = request[parameter].split(':');
    return obj.filter(v => typerequest.includes(v[parameter]));
  }
}

module.exports.filter = filter;
