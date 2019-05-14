const { ObjectId } = require('mongodb');
const Product = require('../models/product.js');
const User = require('../models/user.js');

const createProduct = async (req, res, next) => {
    try {
        const {
            name,
            userId,
            price,
            color,
            isAvailable,
            payload
        } = req.body;
        const existedUser = await User.findOne({_id: ObjectId(userId)});
        if (!existedUser) {
            return next(new Error('USER_NOT_FOUND'));
        }
        
        const existedProduct = await Product.findOne({name});
        if (existedProduct) {
            return next(new Error('Product_already_existed'))
        }
        const product = new Product ({
            name,
            userId: ObjectId(userId),
            price,
            color,
            isAvailable,
            payload
        })
        const savedProduct = await product.save();
        return res.status(200).json({
            message: 'Create new product successfully',
            savedProduct
        });
    } catch (e) {
        return next(e);
    }
}

const deleteProduct = async (req, res, next) => {
    try {   
        const { id } = req.params;
        const deletingProduct = await Product.findOneAndDelete({_id: ObjectId(id)});
        if (!deletingProduct) {
            return next(new Error('PRODUCT_NOT_FOUND'));
        }
        return res.status(200).json({
            message: 'Delete product succesfully',
            deletedProductData : deletingProduct 
        });
    } catch (e) {
        return next(e);
    }
}

const getProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const getProduct = await Product.findOne({_id: ObjectId(id)});
        if (!getProduct) {
            return next(new Error('PRODUCT_NOT_FOUND'));
        }
        const getUserOfProduct = await User.find({_id: ObjectId(getProduct.userId)});;
         const product = {...getProduct._doc};
        product.users = getUserOfProduct;
        return res.status(200).json({
            message : 'Info Product of id : ' + id ,
            data : product
        });
    } catch (e) {
        return next(e);
    }
};

const getListProduct = async (req, res, next) => {
    try {
        const getProducts = await Product.find().lean();
        if (!getProducts) {
            return next(new Error('NOT_DATA'));
        }
        const getUsers = await User.find().lean();
        const products = [...getProducts];
        const users = [...getUsers]; 
        const result = products.map((product) => {
            product.users = [];
            const getuser = users.find((user) => {
                return user._id.toString() === product.userId.toString();
            });
            if (getuser) {
                product.users = getuser;
            }
            return product;
        })
        return res.status(200).json({
            message: 'List products',
            result
        });
    } catch (e) {
        return next(e);
    }
}

const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            name,
            userId,
            price,
            color,
            isAvailable,
            payload
        } = req.body;
        const existedUser = User.findOne({_id: ObjectId(userId)});
        if (!existedUser) {
            return next(new Error('UserId_does_not_exist'));
        }
        const existedProduct = Product.findOne({name});
        if (!existedProduct) {
            return next(new Error('Name_of_product_already_exist'));
        }
        const newValues = {
            name,
            userId,
            price,
            color,
            isAvailable,
            payload
        };
        Object.keys(newValues).forEach( function(key) {
            if (newValues[key] === undefined) {
                delete newValues[key];
            }
        });
        const updateInfo = {$set: newValues};
        const updatingProduct = await Product.findOneAndUpdate({_id: ObjectId(id)}, updateInfo);
        if (!updatingProduct) {
            return next(new Error('PRODUCT_NOT_FOUND'));
        }

        return res.status(200).json({
            message: 'Update product successfully',
            oldData: updatingProduct,
            dataChanges: newValues
        });
    } catch (e) {
        return next(e);
    }
}

module.exports = {
    createProduct,
    deleteProduct,
    getProduct,     
    getListProduct,
    updateProduct
};
