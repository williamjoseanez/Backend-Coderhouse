const express = require ("express");
const router = express.Router();
const passport = require("passport");
const UserModel= require ("../dao/models/user.model.js");
const { createHash } = require("../utils/hashBcrypt.js");

router.post("/",passport.authenticate("register",{failureRedirect: "/failedregister"}), async (req,res)=>{
    if(!req.user) return res.status(400).send({status: "error", message: "Credenciales Invalidas"});
    res.redirect("/login");
  })
  
  router.get("failedregister", (req,res)=>{
    res.json({message: "Registro Fallido"})
  });
  
  module.exports = router;