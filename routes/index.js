const express = require("express");
const { render } = require("nunjucks");
const { getChat } = require("../game");
const {betting} = require("../onetwo");

const router = express.Router();
router.get("/set", (req, res) => {
  res.render("set", { title: "설정" });
});
router.get("/onetwo", (req, res) => {
  res.render("onetwo", { title: "OneTwo" });
});
router.post("/onetwo/bet", (req, res)=>{
  betting(req.body)
  res.json({});
});
router.get("/", (req, res) => {
  res.render("game", { title: "POPCAT" });
});

module.exports = router;
