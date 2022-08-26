const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemon = require('nodemon');

// initialise express app
const app = express();

// bodyparser to parse requests 
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

app.use(cors());
