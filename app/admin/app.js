var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');

var multer = require('multer')
var upload = multer({ dest: 'uploads/' });

var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'your cloud_name',
    api_key: 'api_key',
    api_secret: 'api_secret'
});

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/avalnchedb');

var Schema = mongoose.Schema;

var productSchema = new Schema({
    product_name: String,
    brand: String,
    price: Number,
    stock: String,
    img: String,
    description:String,
    type:String
});

var orderSchema = new Schema({
    name: String,
    email: String,
    phone: String,
    address: String,
    payment: String,
    product: String
});
var order = mongoose.model('order', orderSchema);
var product = mongoose.model('product', productSchema);

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use(bodyParser());

app.get('/', function(req, res) {
    res.render('home');
});
app.get('/add_product', function(req, res) {
    res.render('add_product');
});

app.post('/product/add', upload.single('product_image'), function(req, res) {
    cloudinary.uploader.upload(req.file.path, function(result) {
        console.log(result)
        req.body.img = result.url
        var newProduct = product(
            req.body
        )
        newProduct.save(function(err) {
            if (err) throw err;
            res.json({"sucess":"sucessfully created product!"})

        })
    });
});

app.get('/orders', function(req,res){
    order.find({}, function(err,orders){
        console.log(orders);
            res.render('orders', {order:orders});

    })
})


app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
