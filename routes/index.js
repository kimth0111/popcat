const express = require("express");
const { render } = require("nunjucks");

const router = express.Router();
router.get("/set", (req, res) => {
  res.render("set", { title: "캣캣" });
});
router.get("/", (req, res) => {
  res.render("game", { title: "캣캣" });
});

module.exports = router;
