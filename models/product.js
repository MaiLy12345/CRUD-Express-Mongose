const { mongoose }= require('./index.js');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 2,
        max: 50,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    price: {
        type: Number,
        min: 100,
        max: 999999,
        required: true
    },
    color: [{
        type: String,
        required: true
    }],
    isAvailable: {
        type: Boolean,
        default: true
    },
    payload: {
        releasedAt: {
            type: Date,
            required: true
        },
        expiredAt: {
            type: Date,
            required: true
        }
        
    }
});

const Product = mongoose.model('products', productSchema);
module.exports = Product;
