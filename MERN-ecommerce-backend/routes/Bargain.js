const express = require("express");

const {
  createBargain,
  fetchBargains,
  fetchBargainsOfProductByUser,
  acceptBargain,
  rejectBargain,
  deleteBargain,
} = require("../controller/Bargain");

const router = express.Router();

router.get("/", fetchBargains).post("/", createBargain);
router.get("/:productId/:userId", fetchBargainsOfProductByUser);
router.patch("/accept/:id", acceptBargain);
router.patch("/reject/:id", rejectBargain);
router.delete("/:id", deleteBargain);

exports.router = router;
