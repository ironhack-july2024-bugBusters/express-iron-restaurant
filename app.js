const express = require("express");
const logger = require('morgan');
const mongoose = require("mongoose");

const Pizza = require("./models/Pizza.model.js");

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


// GET /pizzas?maxPrice=xxx
app.get("/pizzas", (req, res, next) => {

    const { maxPrice } = req.query;

    let filter = {};

    if (maxPrice) {
        filter = { price: { $lte: maxPrice } };
    }

    Pizza.find(filter)
        .then((pizzaArr) => {
            res.json(pizzaArr);
        })
        .catch(e => {
            console.log("Error getting pizzas from DB...", e);
            res.status(500).json({ error: "Failed to get list of pizzas" });
        });
})


// GET /pizzas/:pizzaTitle
app.get("/pizzas/:pizzaTitle", (req, res, next) => {

    const { pizzaTitle } = req.params;

    Pizza.findOne({ title: pizzaTitle })
        .then((pizzaFromDB) => {
            res.json(pizzaFromDB);
        })
        .catch(e => {
            console.log("Error getting pizza details from DB...", e);
            res.status(500).json({ error: "Failed to get pizza details" });
        });
});


// POST /pizzas
app.post("/pizzas", (req, res, next) => {

    const pizzaDetails = req.body;

    Pizza.create(pizzaDetails)
        .then((pizzaFromDB) => {
            console.log("Success, pizza created!", pizzaFromDB);
            res.status(201).json(pizzaFromDB);
        })
        .catch(e => {
            console.log("Error creating a new pizza...", e);
            res.status(500).json({ error: "Failed to create a new pizza" });
        });
});


// PUT /pizzas/:pizzaTitle
app.put("/pizzas/:pizzaTitle", (req, res, next) => {

    const { pizzaTitle } = req.params;
    const newDetails = req.body;

    Pizza.findOneAndUpdate({ title: pizzaTitle }, newDetails, { new: true })
        .then(pizzaFromDB => {
            res.json(pizzaFromDB);
        })
        .catch((error) => {
            console.error("Error updating pizza...", error);
            res.status(500).json({ error: "Failed to update a pizza" });
        });
});


// DELETE /pizzas/:pizzaTitle
app.delete("/pizzas/:pizzaTitle", (req, res, next) => {

    const { pizzaTitle } = req.params;

    Pizza.deleteOne({title: pizzaTitle})
        .then(response => {
            res.json(response);
        })
        .catch((error) => {
            console.error("Error deleting pizza...", error);
            res.status(500).json({ error: "Failed to delete a pizza" });
        });

})





app.listen(PORT, () => {
    console.log(`🏃 Our app is running in port... ${PORT}`);
});


