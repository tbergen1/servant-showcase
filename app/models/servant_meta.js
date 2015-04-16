// Module dependencies.
var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

/**
 * ServantMeta
 * Since each Servant that connects to your application is basically a subaccount, 
 * this model's purpose is to store that subaccount data for each Servant.
 */
var ServantMetaSchema = new Schema({
    servant_id: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    user: {
        type: Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    },
    last_connected: {
        type: Date
    }
});

mongoose.model('ServantMeta', ServantMetaSchema);