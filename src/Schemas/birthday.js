const { model, Schema } = require('mongoose');
 
let birthdays = new Schema ({
    Guild: String,
    User: String,
    Time: Number,
    Month: String,
    HasRoleSince: String
})
 
module.exports = model('birthdays', birthdays);