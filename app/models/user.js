// Module dependencies.
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// User Schema
var UserSchema = new Schema({
    full_name: {
        type: String,
        trim: true
    },
    nick_name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    servant_user_id: {
        type: String,
        unique: true
    },
    servant_access_token: {
        type: String
    },
    servant_access_token_limited: {
        type: String
    },
    servant_refresh_token: {
        type: String
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    },
    last_signed_in: {
        type: Date
    }
});


mongoose.model('User', UserSchema);