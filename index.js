const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const userRoute = require('./apis/user.js');
const productRoute = require('./apis/products.js');
const models = require('./models');
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

models
.connectDB()
.then(console.log('Connect db OK'))
.catch(function (e) {
    console.error('Connect Err');
    console.error(e);
    process.exit(1);
});
    //load route
userRoute.load(app);
productRoute.load(app);

app.use(function (err, req, res, next) {
    console.log(JSON.stringify(err, null, 2));
    if (Array.isArray(err.errors)) {
        const messagese = err.errors.map(function(item) {
            return item.message;
        });
        return res.status(400).json({
            error : messagese
        });
    }
    return res.json({
        message: err.message || 'have error'
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});