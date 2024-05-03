const Review = require('../model/Review');

exports.createReview = async (req, res) => {
    try{
        const review = new Review(req.body);
        const doc = await review.save();
        res.status(201).json(doc);
    }
    catch(err){
        res.status(400).json(err);
    }
}

exports.fetchProductReviews = async (req, res) => {
    try{
        const reviews = await Review.find({product: req.params.productId}).populate('user').exec();
        res.status(200).json(reviews);
    }
    catch(err){
        res.status(400).json(err);
    }
}