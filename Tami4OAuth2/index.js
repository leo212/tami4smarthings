const request = require('request-promise-native');
const querystring = require('querystring');

const clientId = "myclientid";
const clientSecret = "myclientsecret";

exports.handler = async (event, context) => {
  console.log(`event: ${JSON.stringify(event)}`);
  try {
    if (event.requestContext.http.path == "/authorize") {
      const redirect_uri = event.queryStringParameters.redirect_uri;
      const state = event.queryStringParameters.state;
      const htmlContent = `<!DOCTYPE html>
                            <html>
                            <head>
                              <title>Phone Number Form</title>
                              <meta name="viewport" content="width=device-width, initial-scale=1">
                              <!-- Import Material Design Lite CSS and JS files -->
                              <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.indigo-pink.min.css">
                              <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
                              <script src="https://www.google.com/recaptcha/enterprise.js?render=6Lf-jYgUAAAAAEQiRRXezC9dfIQoxofIhqBnGisq"></script>
                            </head>
                            <body>
                              <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
                            	<header class="mdl-layout__header">
                            	  <div class="mdl-layout__header-row">
                            		<span class="mdl-layout-title">Tami4 Login</span>
                            	  </div>
                            	</header>
                            	<main class="mdl-layout__content">
                            	  <div class="mdl-grid">
                            		<div class="mdl-cell mdl-cell--4-col mdl-cell--4-offset">
                            		  <div class="mdl-card mdl-shadow--2dp">
                            			<div class="mdl-card__title">
                            			  <h2 class="mdl-card__title-text">Enter Your Phone Number</h2>
                            			</div>
                            			<div class="mdl-card__supporting-text">
                            			  <form id="phone-form">
                            				<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                            				  <input class="mdl-textfield__input" type="tel" id="phone-number" name="phone-number" required>
                            				  <label class="mdl-textfield__label" for="phone-number">Phone Number</label>
                            				  <span class="mdl-textfield__error">Please enter a valid phone number</span>
                            				</div>
                            				<div class="mdl-card__actions mdl-card--border">
                            				  <button type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                            					Submit
                            				  </button>
                            				</div>
                            			  </form>
                            			</div>
                            		  </div>
                            		</div>
                            	  </div>		  
                            	  </main>
                            	  <script>
                            		const form = document.querySelector('#phone-form');
                            		form.addEventListener('submit', event => {
                            			event.preventDefault(); // prevent default form submission behavior
                            			
                            			const phoneNumber = document.querySelector('#phone-number').value;
                            			
                            			// Remove leading zero from phone number
                            			const fullPhoneNumber = '972'+phoneNumber.replace(/^0+/, '');
                            			
                            			grecaptcha.enterprise.ready(function() {
                            				grecaptcha.enterprise.execute("6Lf-jYgUAAAAAEQiRRXezC9dfIQoxofIhqBnGisq", {action: 'submit'}).then(function(token) {
                            				  // redirect the page back to generateOTP action
                            				  window.location = "/generateOTP?phoneNumber="+fullPhoneNumber+"&recaptchaToken="+token+"&redirect_uri=${redirect_uri}&state=${state}";			  
                            			  });
                            			});
                            		});
                            	  </script>
                            	</body>
                              </html>`;
              
              
      console.log(htmlContent);
      
      return {
        statusCode:200,
        headers: {
          "Content-Type": "text/html"
        },
        body: htmlContent};
    }
    else if (event.requestContext.http.path == "/generateOTP") {
      const url = "https://swelcustomers.strauss-water.com//public/phone/generateOTP";
      const phoneNumber = event.queryStringParameters.phoneNumber;
      const recaptchaToken = event.queryStringParameters.recaptchaToken;
      const redirect_uri = event.queryStringParameters.redirect_uri;
      const state = event.queryStringParameters.state;
      
      console.log(phoneNumber);
      console.log(recaptchaToken);
      
      const data = await request(
            {
              method:'POST',
              url:url, 
              headers: { 'Content-Type': 'application/json'},
              body: { "phoneNumber": "+"+phoneNumber, "recaptchaToken": recaptchaToken },
              json:true
            });
      return {
        statusCode: 302,
        headers: {
          'Location': `/enterOTPpage?phoneNumber=${phoneNumber}&redirect_uri=${redirect_uri}&state=${state}`
        }
      } 
    } else if (event.requestContext.http.path == "/enterOTPpage") {
      const redirect_uri = event.queryStringParameters.redirect_uri;
      const state = event.queryStringParameters.state;
      const phoneNumber = event.queryStringParameters.phoneNumber;
      
      const htmlContent = `<!DOCTYPE html>
                            <html>
                            <head>
                              <title>Tami 4 Login</title>
                              <meta name="viewport" content="width=device-width, initial-scale=1">
                              <!-- Import Material Design Lite CSS and JS files -->
                              <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.indigo-pink.min.css">
                              <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
                              <script src="https://www.google.com/recaptcha/enterprise.js?render=6Lf-jYgUAAAAAEQiRRXezC9dfIQoxofIhqBnGisq"></script>
                            </head>
                            <body>
                              <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
                            	<header class="mdl-layout__header">
                            	  <div class="mdl-layout__header-row">
                            		<span class="mdl-layout-title">Tami4 Login</span>
                            	  </div>
                            	</header>
                            	<main class="mdl-layout__content">
                            	  <div class="mdl-grid">
                            		<div class="mdl-cell mdl-cell--4-col mdl-cell--4-offset">
                            		  <div class="mdl-card mdl-shadow--2dp">
                            			<div class="mdl-card__title">
                            			  <h2 class="mdl-card__title-text">Enter the OTP</h2>
                            			</div>
                            			<div class="mdl-card__supporting-text">
                            			  <form id="otp-form">
                            				<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                            				  <input class="mdl-textfield__input" type="digits" id="otp" name="otp" required>
                            				  <label class="mdl-textfield__label" for="otp">OTP</label>
                            				</div>
                            				<div class="mdl-card__actions mdl-card--border">
                            				  <button type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                            					Submit
                            				  </button>
                            				</div>
                            			  </form>
                            			</div>
                            		  </div>
                            		</div>
                            	  </div>		  
                            	  </main>
                            	  <script>
                            		const form = document.querySelector('#otp-form');
                            		form.addEventListener('submit', event => {
                            			event.preventDefault(); // prevent default form submission behavior
                            			
                            			const otp = document.querySelector('#otp').value;
                            			
                            			grecaptcha.enterprise.ready(function() {
                            				grecaptcha.enterprise.execute("6Lf-jYgUAAAAAEQiRRXezC9dfIQoxofIhqBnGisq", {action: 'submit'}).then(function(token) {
                            				  // redirect the page back to submitOTP action
                            				  window.location = "/submitOTP?phoneNumber=${phoneNumber}&otp="+otp+"&recaptchaToken="+token+"&redirect_uri=${redirect_uri}&state=${state}";
                            			  });
                            			});
                            		});
                            	  </script>
                            	</body>
                              </html>`;
              
      return {
        statusCode:200,
        headers: {
          "Content-Type": "text/html"
        },
        body: htmlContent};
      
    } else if (event.requestContext.http.path == "/submitOTP") {
      const url = "https://swelcustomers.strauss-water.com//public/phone/submitOTP";
      const phoneNumber = event.queryStringParameters.phoneNumber;
      const otp = event.queryStringParameters.otp;
      const recaptchaToken = event.queryStringParameters.recaptchaToken;
      const redirect_uri = event.queryStringParameters.redirect_uri;
      const state = event.queryStringParameters.state;
      
      console.log(phoneNumber);
      console.log(recaptchaToken);
      console.log(otp);
      
      const data = await request(
            {
              method:'POST',
              url:url, 
              headers: { 'Content-Type': 'application/json'},
              body: { "phoneNumber": "+"+phoneNumber, "recaptchaToken": recaptchaToken, "code": otp},
              json:true
            });
      return {
        statusCode: 302,
        headers: {
          'Location': `${redirect_uri}?code=${Buffer.from(JSON.stringify(data)).toString('base64')}&state=${state}`
        }
      } 
    } else if (event.requestContext.http.path == "/token") {
      let base64body = event.body;
      // decode it 
      const body = Buffer.from(base64body, 'base64').toString('ascii');
      
      const bodyJson = body.split('&').reduce((obj, pair) => {
        const [key, value] = pair.split('=');
        obj[key] = decodeURIComponent(value);
        return obj;
      }, {});
      
      console.log(JSON.stringify(bodyJson));

      // check what is the grant type
      if (bodyJson.client_id == clientId && bodyJson.client_secret == clientSecret) {
        if (bodyJson.grant_type == "authorization_code") {
          let jwtEncoded = bodyJson.code;
          let jwt = Buffer.from(jwtEncoded, 'base64').toString('ascii');
          console.log(JSON.stringify(jwt));
          return jwt;
        } else if (bodyJson.grant_type=='refresh_token') {
          const url = "https://swelcustomers.strauss-water.com/public/token/refresh";
          const data = await request(
            {
              method:'POST',
              url:url, 
              headers: { 'Content-Type': 'application/json'},
              body: {"token" : bodyJson.refresh_token },
              json:true});
          return JSON.stringify(data);
        } else {
          return {
              statusCode: 500,
              body: JSON.stringify(`Unexpected request: ${JSON.stringify(event.body)}`),
            };
          }
        }
    } 
    else
    return {
        statusCode: 500,
        body: JSON.stringify(`Unexpected request: ${JSON.stringify(event.body)}`),
      };
  } catch (error) {
    console.error(error);
    const response = {
      statusCode: 500,
      body: JSON.stringify(`Internal server error: ${error}`),
    };
    return response;
  }
};
