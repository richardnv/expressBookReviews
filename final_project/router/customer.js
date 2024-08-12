const express = require('express');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const customer_routes = express.Router();

public_users.post("customer/login", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    // if auth is successful the create JWT and store it in the session.
    return res.status(404).json({message: "not implemented"});
});
