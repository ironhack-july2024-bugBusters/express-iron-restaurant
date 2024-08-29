const router = require('express').Router();

const Pizza = require("../models/Pizza.model");


// GET /pizzas?maxPrice=xxx
router.get("/pizzas", (req, res, next) => {

    const { maxPrice } = req.query;

    let filter = {};

    if (maxPrice) {
        filter = { price: { $lte: maxPrice } };
    }

    Pizza.find(filter)
        .populate("cook")
        .then((pizzaArr) => {
            res.json(pizzaArr);
        })
        .catch(e => {
            console.log("Error getting pizzas from DB...", e);
            res.status(500).json({ error: "Failed to get list of pizzas" });
        });
})


// GET /pizzas/:pizzaTitle
router.get("/pizzas/:pizzaTitle", (req, res, next) => {

    const { pizzaTitle } = req.params;

    Pizza.findOne({ title: pizzaTitle })
        .populate("cook")
        .then((pizzaFromDB) => {
            res.json(pizzaFromDB);
        })
        .catch(e => {
            console.log("Error getting pizza details from DB...", e);
            res.status(500).json({ error: "Failed to get pizza details" });
        });
});


// POST /pizzas
router.post("/pizzas", (req, res, next) => {

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
router.put("/pizzas/:pizzaTitle", (req, res, next) => {

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
router.delete("/pizzas/:pizzaTitle", (req, res, next) => {

    const { pizzaTitle } = req.params;

    Pizza.deleteOne({ title: pizzaTitle })
        .then(response => {
            res.json(response);
        })
        .catch((error) => {
            console.error("Error deleting pizza...", error);
            res.status(500).json({ error: "Failed to delete a pizza" });
        });

})



module.exports = router;