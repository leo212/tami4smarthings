# Tami4 Edge SmartThings Cloud Connector
This is a SmartThings Cloud Connector for Tami4 Edge that allows connecting a Tami4 Edge into SmartThings app as a switch that can be turned on in order to heat the water

## Tami4EdgeCloudConnect
An AWS Lambda function that serves the proper SchemaConnector that fetches all of the connected Tami4 Edge devices from tami4.co.il cloud and add it as a switch on SmartThings
This Lambda function should be use as a webhook when defining the cloud connector app on SmartThings developer portal.

## Tami4OAuth
An AWS Lambda function that serves multiple pages required for cloud connector integration on SmartThings that handles the authentication against swelcustomers.strauss-water.com service:

**/authorize** - initiating authorization against swelcustomers.strauss-water.com handles the login process, the authorization serves a webpage to enter a phone number to connect to tami4.co.il after submiting the phone number the page redirects to /generateOTP

**/generateOTP** - request swelcustomers.strauss-water.com to send an OTP SMS to the phone number. after sending the OTP, redirects to /enterOTPPage

**/enterOTPPage** - serves a webpage to enter the OTP and redirects to /submitOTP

**/submitOTP** - submit the OTP to swelcustomers.strauss-water.com and receive a JWT access token

**/token** - returns the authorized JWT access token to perform actions on tami4.co.il, this endpoint also handles token refreshing if requested using the refresh_token

## Instaling to SmartThings
After serving both Tami4EdgeCloudConnect and Tami4OAuth, you should create a new project as Cloud Connector on https://smartthings.developer.samsung.com/workspace/projects and fill in the details.
More information available in installation.pdf (Hebrew)
