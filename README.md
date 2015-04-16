# Servant Boilerplate: MEAN Stack
 		 
A Servant Boilerplate Application already integrated with [Servant](https://www.servant.co) built on the MEAN (MongoDB, Express, Angular, Node) stack.  Use this to rapidly build Servant applications by starting with this boilerplate application.  It's what we use! –  The Servant Team
 		 
## Features:		
		
* **Lean MEAN Stack:** There is little bloat in this version of the MEAN stack.		
* **User Management:** User Authentication via Servant is already built and ready to use.  Authentication libraries like Passport are not needed.
* **Subscription Billing via ServantPay:** Charge for subscriptions using ServantPay (currently in Beta).
* **Single Page Application:** Architected to be a Single Page Application.		
* **Database:** A MongoDB database is setup and user records are stored automatically when a user connects their servants.		
* **Webhooks:** Webhook integration is already set up.  Every time content is created/edited/destroyed on a Servant connected to this app, this app is notified.		
* **Production Ready:** Minifies javascript files for use in production and more.		
* **Servant Visual Elements:** Servant graphics, colors & more are included to match Servant's visual style		
		
### Quick-start		
**Register Your Application On Servant**
Go to https://www.servant.co and register your application in the developers area of the dashboard.  You will want to register two applications, one for Development and one for Production.
		
For the Development Application, enter this Redirect URL when you register it on Servant: *http://localhost:8080/servant/callback*	

**Set Environment Variables
Create a .env file in the root directory (the 'app' folder) and put your Servant Client ID and Client Secret in there like this:

    SERVANT_CLIENT_ID=jkaJ98aLjlajJHFKJ98
    SERVANT_SECRET_KEY=asfkl8asLJIUHALKJ98a098JHFDALKj


**Install Dependencies**		
		
    npm install	

**Start Application**	
In your terminal, navigate to the application directory and run `gulp` to start the application.
		
    gulp		
		
**Open Browser**
		
    http://localhost:8080	

**Production Build**
To minify your public assets for production, run `gulp build`.  The app will automatically use the minified assets in a production environment.	
				
		
### Deploying To Heroku:		
		
Remember to set the following environment variables on your Heroku Server:		
* NODE_ENV = production		
* SERVANT_CLIENT_ID = yourclientkey		
* SERVANT_SECRET_KEY = yoursecretkey	
* MongoDB connection uri (Change this in server.js too)	
		
Use this command to set environment variables: 		
		
    heroku config:set SERVANT_CLIENT_ID=yourclientkey

In a production environment, the application looks for a MongoDB Connection URI in your environment variables.  This happens near the top of the server.js file.  Configure your database here.