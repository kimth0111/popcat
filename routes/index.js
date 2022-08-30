const express = require("express");
const { render } = require("nunjucks");
const { getChat } = require("../game");

const router = express.Router();
router.get("/set", (req, res) => {
  res.render("set", { title: "설정" });
});
router.get("/onetwo", (req, res) => {
  res.render("onetwo", { title: "OneTwo" });
});
router.get("/", (req, res) => {
  res.render("game", { title: "POPCAT" });
});

module.exports = router;
