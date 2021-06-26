//add express module to our package
const express = require("express");

//express objects
const app = express();

//creating and start server on port 8000
app.listen(8000, () => {
    console.log("Server is running");
})

//GET Request
app.get("/user/create", (req, res) => {
    console.log("user makes a get request");
    res.send("hello all users")
})

//POST Request
// app.post("/user/create", (req, res) => {
//     res.send("Post data response");
// })

//using Middleware
app.use(express.json());

app.post("/user/create", (req, res) => {
    console.log(req.body);
    // res.send("post Saba data");
    res.send(req.body);
})

//Test with Parameters

// app.get("/test/hello", (req, res) => {
//     console.log("this is a test page");
// })

// app.get("/test/number/:id", (req, res) => {
//     console.log(req.params.id);
//     res.send("love Number test");
// })

//Connect to MongoDB by Import Mongoose
const mongoose = require("mongoose");


//connect our Nodejs with MongoDB server


mongoose.connect("mongodb://localhost:27017/crytocurrency", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("connected to mongodb server succefully!!");

    // })

    //Create  Schema for  customer
    const Schema = mongoose.Schema;
    const userSchema = new mongoose.Schema({
        name: String,
        PhoneNumber: Number,
        email: String,
        password: String
    }, {
        timestamps: true

    })

    //Create a customer model to help to connect  the collection with the schema , meaning the collection will follow the schema
    const userModel = new mongoose.model('users', userSchema);

    // app.post("/users", (req, res) => {
    //     console.log(req.body);
    //     res.send("post new data we created");
    // })

    //Lets Insert data in to  Mongo database server By creating objects
    app.post("/users", (req, res) => {
        let Mongouser = req.body;
        let userObj = new userModel(Mongouser);
        userObj.save().then(() => {
            //console.log("New user is created")
            res.send({ message: "User Registred" })
                .catch((err) => {
                    // console.log(err)
                    res.send({ message: "There is a error Occured" })
                })
        })
    })
})

/// Authentication
/// Lets create a Login

app.post("/users/login", (req, res) => {
    let userDetails = req.body;
    console.log(userDetails);
    res.send("Hello, it is me Dave")

    console.log(err)
    res.send({ message: "There is a error Occured" })
})


/// Fetching the data(check if this user exits in our database or not)

app.post("/users/login", async (req, res) => {     
    let  userDetails = req.body;     
    let  count = await userModel.find(userDetails).countDocuments();  
    if (count === 1) {       
        res.send("New user found") 
    } 
    else {     
        res.send({ message: "wrong username or password" }) 
    } 
})   



///Lets generate a token
const jwt = require("jsonwebtoken");

app.post("/users/login", async(req, res) => {
    let userCredentials = req.body;
    let count = await userModel.find(userCredentials).countDocuments();
    if (count === 1) {
        jwt.sign({ user: userCredentials }, "secretkey", (err, token) => {
            if (err === null) {
                res.send({ token: token });

            } else {

                res.send({ message: "unable to generate a token for you. Please try again!!" })
            }
        })
    }
})


///Middlware to verify request route to see if the  the token is perfect /not

function verifyToken(req, res, next) {
    console.log(req);

}

///Insert verify token to the login to verify
app.post("/users/login", verifyToken, (req, res) => {
    let Mongouser = req.body;
    let userObj = new userModel(Mongouser);
    userObj.save().then(() => {

        res.send({ message: "User Registred" })
            .catch((err) => {

                res.send({ message: "There is a error Occured" })
            })
    })
})



/// app.use(verifyToken());

function verifyToken(req, res, next) {
    //     //     console.log(req.Headers.authorization.toStrings().split(" ")[1]);
    console.log(req);

    res.send("token verified")
}


//--Plz plz take a look this last script */

///Verify token with out Bearer and get only the token value is correct

//function  verifyToken(req, res, next) {    

//     if (req.headers.authorization !== undefined)
//         let token = req.headers.authorization.toString().split(" ")[1];
//     jwt.verify(token, (err, userCredentials) => {
//         if (err === null) {
//             next();
//         } else {
//             res.send("cannot verify token. login again");
//         }


//     })
//     res.send(" Please authenticate yourself first");

// }