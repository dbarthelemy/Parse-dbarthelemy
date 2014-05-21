//
//  main.js
//  dbarthelemy
//
//  Created by David Barthelemy on 21/05/15.
//  Copyright (c) 2013 David Barthelemy, iMakeit4U. All rights reserved.
//

require('cloud/app.js');

Parse.Cloud.define("sendMail", function(request, response) {
  var config = require('cloud/config.js');
  var Mandrill = require('mandrill');

  Mandrill.initialize(config.mandrillKey());

  Mandrill.sendEmail({
    message: {
      text: request.params.message,
      subject: "New contact",
      from_email: "parse@cloudcode.com",
      from_name: "Cloud Code",
      to: [
        {
          email: "dbarthelemy@imakeit4u.com",
          name: "Barthelemy, David"
        }
      ]
    },
    async: true
    },{
    success: function(httpResponse) {
      console.log(httpResponse);
      response.success("Email sent!");
    },
    error: function(httpResponse) {
      console.error(httpResponse);
      response.error("Uh oh, something went wrong");
    }
  });
});
