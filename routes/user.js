const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const {Admin,User,Course} = require('../db/index')
const jwt = require('jsonwebtoken');
const UserMiddleware = require("../middleware/user");
const { Types } = require("mongoose");
const  secret_key = "karthik_key"

// User Routes
router.post('/signup', async (req, res) => {
    const username = req.headers.username;
    const password = req.headers.password
    const existinguser = await User.findOne({username:username})
    if(!existinguser){
        const newadmin = await new User({
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
    const userexists = await User.find({username:username , password:password})
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

router.get('/courses', userMiddleware ,async (req, res) => {
    // Implement listing all courses logic
    const courselist = await Course.find({})
    res.json({
        courselist : courselist
    })
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    const courseId = req.params.courseId
    const username = req.username
    const courseItem = await Course.findOne({_id:courseId},{_id:true})
    await User.updateOne({username:username},{
        $push:{
            CoursesPurchased:courseItem
        }
    })
    res.send("order purchased!")
    });

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
        const username = req.username
        const data = await User.find({username:username})
        const purchasedId =data [0].CoursesPurchased
        const coursedata = await Course.find({
            _id : {
                "$in" : purchasedId
            }
        })
        res.json({
            coursedata: coursedata
        }
        )
});

module.exports = router