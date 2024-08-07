const { Router } = require("express");
const router = Router();
const adminMiddleware = require("../middleware/admin");
const {Admin,User,Course} = require('../db/index')
const jwt = require('jsonwebtoken');
const  secret_key = "karthik_key"

// Admin Routes
router.post('/signup', async (req, res) => {
    const username = req.headers.username;
    const password = req.headers.password
    const existinguser = await Admin.findOne({username:username})
    if(!existinguser){
        const newadmin = await new Admin({
            username: username,
            password: password
        })
        newadmin.save();
        res.send("user has been created")
    }
    res.send("user already exists")    
});

router.post('/signin', async (req, res) => {
    // Implement admin signin logic
    const username = req.body.username;
    const password = req.body.password;
    console.log(username)
    const userexists = await Admin.find({username:username , password:password})
    console.log(userexists.username)
    if(userexists){
        const token = jwt.sign(username,secret_key)
        res.json({
            token: token
        })
    }else{
        res.send("user doesnt exist")
    }
    
});

router.post('/courses', adminMiddleware, async (req, res) => {
    const newCourse = new Course({
        title : req.body.title,
        description: req.body.description,
        price: req.body.price,
        published: req.body.published,
        imageLink: req.body.imageLink
    })
        newCourse.save();
        res.send("course has been created")
});

router.get('/courses', adminMiddleware ,async (req, res) => {
    // Implement listing all courses logic
    const courselist = await Course.find({})
    res.json({
        courselist : courselist
    })
});

module.exports = router;