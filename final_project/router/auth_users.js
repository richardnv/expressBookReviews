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
    }, 'access', { expiresIn: 60 * 60});

    // Store access token in session
    req.session.authorization = {
        accessToken
    }
    return res.status(200).send("User successfully logged in");

 //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.params.review;
  const user = req.body.user;
  if (authenticatedUser(user.username, user.password)){
    let book = null;
    Object.keys(books).forEach(key => {        
        if (key === isbn) {
            book = books[key];
        }        
    });
    if (book){
        book.reviews.push(`{ "Reviewer": ${user.username}, "Review": ${review} }`);
    }
  }
  return res.status(200).json({message: "Review Saved: " + review});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
