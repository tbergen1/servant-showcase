// Module dependencies.
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    ServantMeta = mongoose.model('ServantMeta'),
    async = require('async'),
    _ = require('lodash'),
    Config = require('../../config/config');

// Instantiate ServantSDK
var ServantSDK = require('servant-sdk-node')({
    application_client_id: process.env.SERVANT_CLIENT_ID,
    application_client_secret: process.env.SERVANT_SECRET_KEY
});


var index = function(req, res) {
    // Render Either Home Page or Dashboard Page Depending On User Session
    var variables = {
        connect_url: Config.app.servant_connect_url,
        client_id: process.env.SERVANT_CLIENT_ID,
        name: Config.app.name,
        description: Config.app.description,
        keywords: Config.app.keywords,
        environment: process.env.NODE_ENV
    };

    if (req.session.user) res.render('dashboard', variables);
    else res.render('home', variables);
};

var logOut = function(req, res, next) {
    // Destroy The Session, And Redirect
    req.session = null;
    return res.redirect('/');
};

/**
 * Load User And Servants
 *
 * This function fetches the user and shared servants from Servant via its API.
 * Then, it checks to see if ServantMeta objects have been created for each of the shared servants.
 * Servants are basically subaccounts and ServantMeta records are where you save information related to each Servant (aka subaccount).
 * If no ServantMeta record is found, one is automatically made.
 * ServantMeta records are then merged with the original servants data recieved from Servant and then output in JSON
 * 
 */
var loadUserAndServants = function(req, res, next) {
    ServantSDK.getUserAndServants(req.user.servant_access_token, function(error, response) {
        if (error) return res.status(500).json({
            error: error
        });

        // Load ServantMeta Records
        ServantMeta.find({
            user: req.user._id
        }).lean().exec(function(error, servantmetas) {
            if (error) return res.status(500).json({
                error: error
            });

            // Merge Servant and ServantMeta Data Objects
            async.eachSeries(response.servants, function(servant, servantCallback) {
                // Flag to show ServantMeta exists or needs to be created
                var exists = false;
                for (j = 0; j < servantmetas.length; j++) {
                    // If IDs don't match, skip
                    if (servant._id !== servantmetas[j].servant_id) continue;
                    // If IDs match, merge
                    // Delete _id or it will overwrite the main Servant ID
                    delete servantmetas[j]._id;
                    delete servantmetas[j].user;
                    // Merge ServantMeta with Servant
                    _.assign(servant, servantmetas[j]);
                    // Remove ServantMeta from original array
                    servantmetas.splice(j, 1);
                    exists = true;
                    break;
                };
                // Process Next Servant Or Create ServantMeta
                if (exists) return servantCallback();
                var servantmeta = new ServantMeta({
                    servant_id: servant._id,
                    user: req.user._id
                });
                servantmeta.save(function(error, response) {
                    if (error) return res.status(500).json({
                        error: error
                    });
                    response = response.toObject();
                    delete response._id;
                    delete response.user;
                    // Merge ServantMeta with Servant
                    _.assign(servant, response);
                    // Callback
                    return servantCallback();
                });
            }, function() {
                // Merge User Data Objects
                req.user = req.user.toObject();
                delete req.user._id;
                _.assign(response.user, req.user);
                // Add missing servantmetas
                response.missing_servants = servantmetas;
                // Render
                res.json(response);
            });
        });
    });
};


module.exports = {
    index: index,
    logOut: logOut,
    loadUserAndServants: loadUserAndServants
};