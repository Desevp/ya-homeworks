// app/index.j

const express = require('express');
const app = express();
const fs = require('fs');
const timer = require('./timer')
const parseRequest = require('./parseRequest')

const port = 8000;
const beginTime = Date.now();
const TYPES = ['info', 'critical'];

app.use(express.static(__dirname + '/views'));

app.get('/status', (request, response) => {
  let curTimer = timer.getTimeToCurrent(beginTime);
  response.send(`${curTimer}`)
})

app.get('/api/events', (request, response, next) => {
  fs.readFileAsync = function(filename) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filename, function(err, data){
          if (err)
            reject(err);
          else
            resolve(data);
        });
    });
  };

  fs.readFileAsync('application/events.json')
    .then(data => {
      return JSON.parse(data);
    })
    .then((data)=>{
      if (Object.keys(request.query).length === 0 && request.query.constructor === Object) {
        response.send(data);
      }
      else {
        // проверка на тип
        let checkedType = request.query['type'].split(':').every(function(item){
          return (TYPES.includes(item));
        })

        if (checkedType) {
          let res = parseRequest.filter(data.events, request.query, 'type');
          response.send(res);
        }
        else {
          response.status(400).send('incorrect type');
        }
      }
    })
    .catch(next);
});

// Error handlers
app.use(function(err, req, res, next) {
  res.status(523);
  res.send(err);
});

app.use(function(req, res){
  res.status(404);
  res.sendFile(__dirname + '/views/404.html');
});

app.listen(port, (err) => {
  if (err) {
    return console.log('error');
  }
  console.log(`server is listening on ${port}`);
})
