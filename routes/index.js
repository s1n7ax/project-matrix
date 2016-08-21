const express = require('express');
const router = express.Router();
const Locator = require('../locator');
const Services = require(Locator.servicesPath.services);





router.get('/', function (req, res, next) {
  res.sendFile(Locator.viewsPath.index);
});


router.post('/createProject', function (req, res, next) {
	let service = new Services('Project');
	console.log('okay i got the post');
	console.log(req.body);
  service.create(service, req.body, res); 
});


module.exports = router;
