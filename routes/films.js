const express = require("express");
const router = express.Router();
const { list, create, show, update, remove } = require("../controllers/film.controller");

router.get("/", list);

router.post("/",  create);

router.get("/:filmId", show);

router.put("/:filmId", update);

router.delete("/:filmId",remove);

module.exports = router;