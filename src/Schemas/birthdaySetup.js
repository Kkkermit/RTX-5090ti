const { model, Schema } = require('mongoose');
 
let birthdayschema = new Schema ({
    Guild: String,
    Channel: String,
    Role: String
})
 
module.exports = model('birthdayschema', birthdayschema);