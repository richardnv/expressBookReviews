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

function addReview(bookId, reviewId, reviewContent) {
    if (books[bookId]) {
        books[bookId].reviews[reviewId] = reviewContent;
        console.log(`Review ${reviewId} added/updated on Book ${bookId}.`);
    } else {
        console.log(`Book with ID ${bookId} does not exist.`);
    }
}

function deleteReview(bookId, reviewId) {
    if (books[bookId] && books[bookId].reviews[reviewId]) {
        delete books[bookId].reviews[reviewId];
        console.log(`Review ${reviewId} removed from book ${bookId}.`);
    } else {
        console.log(`Review ${reviewId} not found for book ${bookId}.`);
    }
}

function usernameFromToken(token){    
    const decoded = jwt.verify(token, 'fingerprint_customer');
    return decoded.data;
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
        data: user.username
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
  const token = req.session.authorization.accessToken;  
  const username = usernameFromToken(token);
  const reviewText = req.body.review.text;
  
  addReview(isbn, username, reviewText);  
  return res.status(200).json({ message: "Review Saved" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;  
    const token = req.session.authorization.accessToken;
    const username = usernameFromToken(token);
        
    deleteReview(isbn, username);  
    return res.status(200).json({ message: "Review removed" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
