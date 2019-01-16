const express = require('express');
const path = require('path');

const app = express();

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'));

const getFullURL = (req) => req.protocol + '://' + req.get('host') + req.originalUrl;

const onsens = ['Dogo onsen', 'Akiu onsen', 'Hokkawa onsen']

const getOnsens = () => {
  const normalize = input => input.replace(/\sonsen$/, '').toLowerCase();
  return onsens.map(onsen => {
    const normalized = normalize(onsen);
    const url = `/paradise/${normalized}`;
    return {
      id: normalized,
      name: onsen,
      url: url,
      ampUrl: `${url}/amp`
    };
  });
};

const getBase = (req) => {
  return {
    url: getFullURL(req),
  };
}

app.get('/', (req, res) => {
  const data = {
    base: getBase(req),
    onsens: getOnsens()
  };
  res.set('vary', 'AMP-Cache-Transform');
  res.render('list', data);
});

app.get('/paradise/:name/amp', (req, res) => {
  const name = req.params.name;
  const onsens = getOnsens();

  const target = onsens.find(onsen => onsen.id === name);

  const data = {
    base: getBase(req),
    target
  };
  res.set('vary', 'AMP-Cache-Transform');
  res.render('amp-item', data)
});

app.get('/paradise/:name', (req, res) => {
  const name = req.params.name
  const onsens = getOnsens();

  const target = onsens.find(onsen => onsen.id === name);

  const data = {
    base: getBase(req),
    target
  };
  res.render('item', data)
});

app.get('/healthcheck', (req, res) => {
	res.send('hello');
});

app.listen(3000);
