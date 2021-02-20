'use strict';

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));

// API handler
app.use('/api', require('./router'))

// 404 handler
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/404.html');
})

const PORT = process.env.PORT || 9999
app.listen(PORT, () => console.log('server jalan di port %s', PORT))