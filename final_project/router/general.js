const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here  
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
// This will always return an error "Not Found" 
// because the "books" data in bookdb.js 
// contains no ISBN property.
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;  
    if (isbn) {
        let isbnbooks = books.filter((book) => book.isbn === isbn);
        if (isbnbooks) {
            return res.send(JSON.stringify(isbnbooks));
        } else {
            return res.send(JSON.stringify("Sory no book found with this ISBN ${isbn}!"));
        }
    } 
    return res.send(JSON.stringify("message: Please supply an ISBN!"));
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;    
    let outmsg = "";
    let booksByAuthor = [];
    
    if (author){            
        let bookCount = books.length;    
        for (let i = 1; i < bookCount; i++) {            
            let auth = books[i].author;
            let title = books[i].title;
            if (auth === author){            
                outmsg += "Author: " + auth + " Title: " + title + ", "
            }
            // if (book.author === author){
            //     booksByAuthor.push(book);
            // }
        }  
        //if (booksByAuthor.length > 0){            
            return res.send(JSON.stringify(outmsg));           
        // } else {
        //     return res.send(JSON.stringify("No books found by author " + author + " !"));
        // }
    }    
    return res.send(JSON.stringify("Please supply an author!"));
 
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
