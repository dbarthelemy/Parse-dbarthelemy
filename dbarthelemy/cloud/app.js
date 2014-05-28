//
//  app.js
//  dbarthelemy
//
//  Created by David Barthelemy on 21/05/15.
//  Copyright (c) 2013 David Barthelemy, iMakeit4U. All rights reserved.
//

// Helper funcitons
function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 

// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var app = express();

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/hello', function(req, res) {
  var highlight = 'Thanks!';
  var message = 'I\'ll come back to you as soon as possible';

  res.render('hello', { highlight: highlight, message: message });
});

app.post('/hello', function(req, res) {
  var highlight = 'Ooops!';
  var message = 'You did not enter a valid email... are you a bot?';
  var email = req.body.email;

  if (validateEmail(email)) {
    var Contact = Parse.Object.extend("Contact");
    var aContact = new Contact();
 
  	aContact.set("email", email);
 
  	aContact.save(null, {
  	  success: function(aContact) {
        // Execute any logic that should take place after the object is saved.
        Parse.Cloud.run('sendMail', { message: email }, {
          success: function(result) {
          },
          error: function(error) {
          }
        });

        highlight = 'Great!';
        message = 'I\'ll come back to you as soon as possible';
        res.render('hello', { highlight: highlight, message: message });
  	  },
  	  error: function(aContact, error) {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and description.
        console.error('Failed to create new object, with error code: ' + error.description);

        highlight = 'Ooops!';
        message = 'An error has occured... I\'ll fix that ASAP';
        res.render('hello', { highlight: highlight, message: message });
  	  }
    });    
  }
  else {
    res.render('hello', { highlight: highlight, message: message });
  }
});

// // Example reading from the request query string of an HTTP get request.
// app.get('/test', function(req, res) {
//   // GET http://example.parseapp.com/test?message=hello
//   res.send(req.query.message);
// });

// // Example reading from the request body of an HTTP post request.
// app.post('/test', function(req, res) {
//   // POST http://example.parseapp.com/test (with request body "message=hello")
//   res.send(req.body.message);
// });

// Custom 404 handling
app.use(function(req, res){
  if (req.accepts('html')) {
    // respond with html page
    highlight = 'Ooops! this page no longer exists';
    res.render('404', { highlight: highlight, message: req.url });
    return;
  }
  else if (req.accepts('json')) {
    // respond with json
    res.status(404);
    res.send({ error: 'Not found' });
    return;
  }
  else {
    // default to plain-text. send()
    res.type('txt').send('Not found');
  }
});

// Attach the Express app to Cloud Code.
app.listen();
