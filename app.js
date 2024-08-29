const express = require("express");
const logger = require('morgan');
const mongoose = require("mongoose");


const PORT = 3000;

// Create an express server instance named `app`
// `app` is the Express server that will be handling requests and responses
const app = express();


// Setup the request logger to run on each request
app.use(logger('dev'));

// Make the static files inside of the `public/` folder publicly accessible
app.use(express.static('public'));


// JSON middleware to parse incoming HTTP requests that contain JSON
app.use(express.json());


// 
// Connect to DB
// 

mongoose.connect("mongodb://127.0.0.1:27017/iron-restaurant")
    .then((response) => {
        console.log(`Connected! Database Name: "${response.connections[0].name}"`);
    })
    .catch((error) => console.log("Error connecting to DB...", error));


//
// Example of middleware
//

function doSomething(req, res, next) {
    console.log("doing something...");
    next();
}

app.use("/", doSomething);



// 
// Routes
// 


// GET /
app.get("/", (req, res, next) => {
    res.sendFile(__dirname + '/views/home-page.html');
});

// GET /contact
app.get("/contact", (req, res, next) => {
    res.sendFile(__dirname + '/views/contact-page.html');
})



// 
// Mount routes
// 

app.use("/", require("./routes/pizza.routes.js"));
app.use("/", require("./routes/cook.routes.js"));




app.listen(PORT, () => {
    console.log(`🏃 Our app is running in port... ${PORT}`);
});


