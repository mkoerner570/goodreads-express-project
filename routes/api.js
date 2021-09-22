const express = require('express');
const db = require('../db/models');
const { asyncHandler } = require('../utils');
const router = express.Router();

router.get('/:id(\\d+)', asyncHandler( async (req, res, next) => {
    //Grab the apiId
    const api_id = req.params.id;

    //Search for the specific API
    const api = await db.Api.findByPk(api_id, {include: { model: db.Tag }});

    //TODO Run a query to find the APIs average rating

    //Get the logged in user, if they exist
    //Else just create an empty array to pass into the render
    let toolboxes;

    let user_id;
    if(req.session.auth) {
        user_id = req.session.auth.userId

        //Get the user's toolboxes
        toolboxes = await db.Toolbox.findAll({
            where: {
                user_id
            }
        })
    } else {
        toolboxes = [];
    }

    //Get the reviews for the API
    const reviews = await db.Review.findAll({
        where: {
            api_id
        },
        include: { model: db.User }
    })

    //Render the page if it exists
    //TODO Replace avgRating with actual score
    if (api) {
        return res.render('api', {title: `Ace API - ${api.name}`, api, toolboxes, avgRating: 5, reviews, user_id})
        // res.send(reviews)
    } else {
        next()
    }
}))


module.exports = router;
