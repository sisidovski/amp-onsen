const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'));

const getFullURL = (req) => req.protocol + '://' + req.get('host') + req.originalUrl;

const onsens = [
  {
    name: 'Dogo onsen',
    img: 'https://www.visitehimejapan.com/image/rendering/attraction_image/4211/trim.800/3/2?v=c156583acd94d8709ffccc3c46c3d9508004972d'
  },
  {
    name: 'Akiu onsen',
    img: 'https://d3hg7snzn13jf0.cloudfront.net/files/kanko/893/893--2038855060f0e02b053ba1a74ab26746.jpg'
  },
  {
    name: 'Hokkawa onsen',
    img: 'https://www.guidoor.jp/wordpress/wp-content/uploads/2017/07/e4718c0ab3eeec065f29283b1d0b7614.jpg'
  }
];

const getOnsens = () => {
  const normalize = input => input.replace(/\sonsen$/, '').toLowerCase();
  return onsens.map(onsen => {
    const normalized = normalize(onsen.name);
    const url = `/${normalized}`;
    return {
      id: normalized,
      name: onsen.name,
      url: url,
      ampUrl: `${url}/amp`,
      img: onsen.img
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

app.get('/:name/amp', (req, res) => {
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

app.get('/:name', (req, res) => {
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
