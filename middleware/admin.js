const mongoose = require('mongoose')
const {Admin,User,Course} = require('../db/index')
const jwt = require('jsonwebtoken')
const  secret_key  = "karthik_key"


// Middleware for handling auth
async function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const value = req.headers.authentication
    const tokenarray = value.split(" ")
    const jwt_token = tokenarray[1]
    try{
        const decoded = jwt.verify(jwt_token,secret_key)
    const userexists = await Admin.findOne({username:decoded})
    if(userexists){
        next();
    }else{
    res.send("user doesnt not exists")
    }
    }catch(e){
        res.send("invalid token")
    }
    
}

module.exports = adminMiddleware