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
  return res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
// assumes that the key is the ISBN.
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let book = null;
    Object.keys(books).forEach(key => {        
        if (key === isbn) {
            book = books[key];
        }        
    });
    if (book){
        return res.status(200).json(book);
    } else {
        return res.status(210).json({message: `No books with isbn: ${isbn} found!`});
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    
    let author = req.params.author;
    let authorBooks = new Array;
    let bookCount = 0;
    let authors = "";
    Object.keys(books).forEach(key => {
        bookCount += 1;
        authors += books[key].author + ", ";
        if (books[key].author === author) {
            authorBooks.push(books[key]);
        }       
    });
    if (authorBooks.length > 0){
        // return res.send(`Found ${authorBooks.length} Books By ${author}: ${JSON.stringify(authorBooks)}`);
        return res.status(200).json(authorBooks);
    } else {
        return res.send(JSON.stringify(`${authorBooks.length} out of ${bookCount} Books by Authors: ${authors} Found`));    
    }
    
 
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    let title = req.params.title;
    let titleBooks = new Array;
    Object.keys(books).forEach(key => {
        if (books[key].title === title) {
            titleBooks.push(books[key]);
        }       
    });
    if (titleBooks.length > 0){
        // return res.send(`Found ${authorBooks.length} Books By ${author}: ${JSON.stringify(authorBooks)}`);
        return res.status(200).json(titleBooks);
    } else {
        return res.send(JSON.stringify(`${titleBooks.length} out of ${bookCount} Books by Authors: ${authors} Found`));    
    }
    
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let reviews = new Array;
    Object.keys(books).forEach(key => {        
        if (books[key] === isbn) {
            let book = books[key];
            let reviews = book.reviews;            
        }       
    });
    if (reviews.length > 0){
        // return res.send(`Found ${authorBooks.length} Books By ${author}: ${JSON.stringify(authorBooks)}`);
        return res.status(200).json(reviews);
    } else {
        return res.status(210).json(`No Reviews found for isbn ${isbn}`);            
    }
});

module.exports.general = public_users;
