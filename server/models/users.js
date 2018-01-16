var mongoose = require('mongoose');

var schema=new mongoose.Schema({
    "userId":String,
    "userName":String,
    "userPwd":String,
    "orderList":Array,
    "cartList":[
        {
            "productId":String,
            "productName":String,
            "salePrice":String,
            "productImage":String,
            "checked":String,
            "productNum":String
        }
    ],
    "addressList":[
        {
            "isDefault":Boolean,
            "addressId":String,
            "userName":String,
            "streetName":String,
            "postCode":String,
            "tel":String
        }
    ]
});

module.exports = mongoose.model("users",schema);