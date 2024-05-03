const express = require('express');

const { createReview, fetchProductReviews } = require('../controller/Review');

const router = express.Router();

router.get('/:productId', fetchProductReviews).post('/', createReview);

exports.router = router;