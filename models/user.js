const { mongoose } = require('./index.js')
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        min: 3,
        max: 30,
        unique: true,
        required: true
    },
    password: {
        type: String,
        min: 6,
        max: 30,
        required: true
    }
});
const User = mongoose.model('users', userSchema);
module.exports = User;