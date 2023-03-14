# eCom-app-api
Node/Express REST API to provide typical functionality found in an ecommerce website.  Users can create accounts, view products, add products to a cart, and place/view orders.

## Running the app
You can either interact with a deployed version, or run the app locally on your machine.
If you prefer the deployed version option, [skip ahead](#using-the-deployed-version).


### Running locally
To run locally, `npm install`, then `npm run start`

This project requires a [PostgreSQL](https://www.postgresql.org/) database to be running locally.  Reference the ERD diagram located in the `resources` folder of this repo to view the tables structure.  

#### **Environment variables**
Make sure to create a `.env` file and include the following variables:  
- `PGDATABASE` — assigned your database name 
- `SECRET` — assigned your express session secret
- `PORT` (_Optional_ ) — assigned your desired server port number

#### **Creating database tables**
To easily populate your database with the relevant tables, `npm run create-db`.  This will create tables in your database if they don't already exist.  The configuration for this script can be found in the  `setupDB.js` file located in the root of this project.  

Alternatively, run the `setupDB.sql` file directly in your postgres client.

Once the app is running locally, you can access the API at `http://localhost:<your-port>`.  
Swagger documentaion will be available at `http://localhost:<your-port>/docs`.

### Using the deployed version
This app is deployed on Render and its base URL is `https://ecom-app-api-5syq.onrender.com`.  
[Swagger documentaion is available for this version](https://ecom-app-api-5syq.onrender.com/docs) as well.

## Testing
Most endpoints are protected and require authentication.  In order to properly access these endpoints, you will need to have a session cookie present when making your request.  This is accessed by hitting the `/login` endpoint first.  

>**Note:** Session cookies are not supported by Swagger UI, so its "Try it out" feature won't work.  
HTTP clients will automatically store cookies and send them with subsequent requests.  

You can use various HTTP clients such as [Postman](https://www.postman.com/), [Insomnia](https://insomnia.rest/), or [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) (which works within VS Code) to make requests to the API endpoints.
