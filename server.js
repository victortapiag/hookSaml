// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)

const express = require("express");
const app = express();

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
// Health Check

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// basic auth and parsing
const basicAuth = require("express-basic-auth");
const bodyParser = require("body-parser");
const APIkey ="S3cr3tValue";

var cont = 0;

app.use(bodyParser.json());
/*app.use(
  basicAuth({
    users: { admin: "supersecret" },
    unauthorizedResponse: (req) => "Unauthorized",
  })
);*/

/*
 *
 * SAML Inline Hook code
 *
 */


//SAML Inline Hook POST from Okta (endpoint: tokenHook)

app.post("/samlHook", async (request, response) => {
  console.log(request.headers);
  console.log(request.headers.authorization);
  console.log(request.body.data);

  var returnValue = {
    commands: [
    // ADD SAML Assertion
    { "type": "com.okta.assertion.patch",
      "value": [
            {
            op: "add",
            path: "/claims/h_extHook",
            value: {
              attributes: {
                NameFormat:
                  "urn:oasis:names:tc:SAML:2.0:attrname-format:unspecified",
              },
              attributeValues: [
                {
                  attributes: {
                    "xsi:type": "xs:string",
                  },
                  value: "From SAML Hook",
                },
              ],
              },
            },
            // ADD ANOTHER ASSERTION
            {
            op: "add",
            path: "/claims/h_extHook2",
            value: {
              attributes: {
                NameFormat:
                  "urn:oasis:names:tc:SAML:2.0:attrname-format:unspecified",
              },
              attributeValues: [
                {
                  attributes: {
                    "xsi:type": "xs:string",
                  },
                  value: "From SAML Hook #2",
                },
              ],
              },
            },
            {
              "op": "replace",
              "path": "/claims/array/attributeValues/1/value",
              "value":  "true"
              
            }
           ]
      
    }
  ]

  };

  if (APIkey === request.headers.authorization) {
  	response.send(JSON.stringify(returnValue));
  } else {
	response.status(403).send({ error: { code: 403, message: "Unauthorized." } });
  }
  });

  // listen for requests :)

const listener = app.listen(3001, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

