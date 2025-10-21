const express = require("express")
const router = express.Router()
const ownerModel = require("../models/owners-model")

if(process.env.NODE_ENV === "development") {
     router.post("/create" ,async  (req , res) => {
        let owners = await ownerModel.find()
        if(owners.length > 0) {
            return res
            .status(502)
            .send("you dont have permission to create a new owner")
        }

        let {fullname , email, password} = req.body
        let createdOwner = await  ownerModel.create({
            fullname,
            email,
            password
    })
        res.status(201).send(createdOwner)
    })
}

router.get("/admin" , (req , res) => {
    let sucess = req.flash("sucess")
    res.render("createproducts" , {sucess})
})



module.exports = router