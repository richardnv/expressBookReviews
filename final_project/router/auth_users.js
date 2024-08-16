const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    //write code to check is the username is valid
    let existing_users = users.filter((user) => {
        if (existing_users.length == 0) {
            return true;
        } else {
            return false;
        }
    });
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const user = req.body.user;
    const username = user.username;
    const password = user.password;
  
    if (!username || !password) {
        return res.status(300).json({ message: "username and/or password were not supplied" });
    }
    // Generate JWT access token
    let accessToken = jwt.sign({
        data: user
    }, 'fingerprint_customer', { expiresIn: "1h"});

    // Store access token in session
    req.session.authorization = {
        accessToken
    }
    return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;  
  const user = req.body.user;
  const reviewText = req.body.reviewText;
  
  //if (authenticatedUser(user.username, user.password)){
    let book = null;    
    Object.keys(books).forEach(key => {        
        if (key === isbn) {
            book = books[key];
        }        
    });
    // if a book was found
    if (book){
        // isolate the reviews for this book.
        let reviews = book.reviews;        
        let review = null;
        // assume that the reviews element exists.
        // it may be blank.        
        // if book has 1 or more reviews   
        Object.keys(reviews).forEach(review => {
        // find the review belonging to this user
            if (key === user.username) {
                review = reviews[key];
            }
        })

        // if review exists
        if (review){
            if (reviewText) {
                let newreview = {
                    reviewer: user.username,
                    text: reviewText
                };
                review.assign(review, newreview);
                // replace the original reviewtext with the new reviewtext            
                return res.status(200).json({message: "review was updated"});
            } else {
                return res.status(301).json({message: "No text was provided for this review."});
            }
        } else {
            // create a review for this bool for this user with the new reviewText 
            let newreview = { reviewer: user.username, text: reviewText }
            reviews.append(newreview);
            return res.status(200).json({message: "review was saved"});
        }                
    } else {
        return res.status(402).json({ message: "No Book found"});
    }    
    
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
