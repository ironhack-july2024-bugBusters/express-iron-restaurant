const express = require("express");
const logger = require('morgan');

const pizzasArr = require("./data/pizzas.js");


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
// Example of middleware
//

function doSomething(req, res, next){
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


// GET /pizzas?maxPrice=xxx
app.get("/pizzas", (req, res, next) => {

    const { maxPrice } = req.query;

    // if maxPrice not provided, return the whole list
    if(maxPrice === undefined){
        res.json(pizzasArr);
        return;
    }
    
    // if maxPrice is provided, return only the pizzas with that maximum price
    const filteredPizzas = pizzasArr.filter( pizzaDetails => pizzaDetails.price <= maxPrice );
    res.json(filteredPizzas);
})


// GET /pizzas/:pizzaId
app.get("/pizzas/:pizzaId", (req, res, next) => {

    const {pizzaId} = req.params;

    const pizzaToDisplay = pizzasArr.find( (element) => element.id == pizzaId );   

    res.json(pizzaToDisplay);
});





app.listen(3000, () => {
    console.log("🏃 Our app is running in port... ")
});


