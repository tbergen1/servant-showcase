// Module dependencies.
var mongoose = require('mongoose'),
    async = require('async'),
    User = mongoose.model('User'),
    ServantMeta = mongoose.model('ServantMeta'),
    Config = require('../../config/config');

// Instantiate ServantSDK
var ServantSDK = require('servant-sdk-node')({
    application_client_id: process.env.SERVANT_CLIENT_ID,
    application_client_secret: process.env.SERVANT_SECRET_KEY
});


/**
 * Servant Connect Callback
 *
 * - Handles Initial Authorization
 * - Also used as the "Log in" function
 * - Fetches User Profile From Servant
 * - Copies User Information to Your Database
 *
 */
var servantConnectCallback = function(req, res) {
    var self = this;

    // Helper function updates user in database each time they connect
    self._saveUser = function(tokens, newUser, callback) {
        // Get User & Servants
        ServantSDK.getUserAndServants(tokens.access_token, function(error, response) {
            if (error) return callback(error, null);
            var servant_user = response.user;
            // Create/Update User in local database
            User.find({
                servant_user_id: response.user._id
            }).limit(1).exec(function(error, users) {
                if (error) return callback(error, null);
                if (!users.length) var user = new User();
                else var user = users[0];
                user.full_name = servant_user.full_name;
                user.nick_name = servant_user.nick_name;
                user.email = servant_user.email;
                user.servant_user_id = servant_user._id;
                user.servant_access_token = tokens.access_token;
                user.servant_access_token_limited = tokens.access_token_limited;
                user.servant_refresh_token = tokens.refresh_token;
                user.updated = new Date();
                user.last_signed_in = new Date();
                user.save(function(error, user) {
                    if (error) return callback(error, null);
                    if (!response.servants.length) return callback(null, user);
                    // Callback
                    return callback(null, user);
                }); // user.save
            });
        }); // Servant.getUserAndServants
    }; // _saveUser())

    // If AuthorizationCode was included in the parameters, the user hasn't authorized. Exchange AuthCode For Tokens
    if (req.query.code) {
        ServantSDK.exchangeAuthCode(req.query.code, function(error, servant_tokens) {
            if (error) return res.status(500).json({
                error: error
            });
            self._saveUser(servant_tokens, true, function(error, user) {
                if (error) return res.status(500).json({
                    error: error
                });
                // Save Session & Redirect
                req.session = {
                    user: user
                };
                return res.redirect('/');
            });
        }); // Servant Authentication Callback
    }
    // If RefreshToken was included in the parameters, the User has already authenticated
    if (req.query.refresh_token) {
        self._saveUser(req.query, false, function(error, user) {
            if (error) return res.status(500).json({
                error: error
            });
            // Save Session & Redirect
            req.session = {
                user: user
            };
            return res.redirect('/');
        });
    }
    // Otherwise Throw Error
    if (!req.query.code && !req.query.refresh_token) return res.status(500).json({
        error: 'Something went wrong with connecting to this user'
    });
}; // authenticationCallback

// Servant Webhooks Callback
var servantWebhooksCallback = function(req, res) {
    console.log("Servant Webhook Received: ", req.body);
    // Always respond to Servant with status 200
    res.json({
        status: 'Webhook Received'
    });
};


module.exports = {
    servantConnectCallback: servantConnectCallback,
    servantWebhooksCallback: servantWebhooksCallback
};