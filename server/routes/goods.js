var express=require('express');
var router=express.Router();
var mongoose=require("mongoose");
var Goods=require('../models/goods');

mongoose.connect('mongodb://dumall:dumall@127.0.0.1/dumall');
mongoose.connection.on("connected",function(){
    console.log("mongodb success");
});
mongoose.connection.on("err",function(){
    console.log("mongodb fail");
});
mongoose.connection.on("disconnected",function(){
    console.log("mongodb disconnected");
});

router.get("/list",function(req,res,next){
    let page=req.param("page");
    let pageSize=req.param("pageSize");
    let sort=req.param("sort");
    let priceLevel=req.param('priceLevel');
    let params={};
    var priceGt=0,priceLte=0;
    if(priceLevel!='all'){
        switch(+priceLevel){
            case 0:priceGt=0;priceLte=100;break;
            case 1:priceGt=100;priceLte=500;break;
            case 2:priceGt=500;priceLte=1000;break;
            case 3:priceGt=1000;priceLte=2000;break;
        }
        params={
            salePrice:{
                $gt:priceGt,
                $lte:priceLte
            }
        };
    }
    let skip=(page-1)*pageSize;
    let goodsModel=Goods.find(params).skip(skip).limit(pageSize);
    goodsModel.sort({'salePrice':sort});
    goodsModel.exec(function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            });
        }else{
            res.json({
                status:'0',
                msg:'',
                result:{
                    count:doc.length,
                    list:doc
                }
            });
        }
    });
})
//加入到购物车
router.post('/addCart',(req,res,next)=>{
    var userId='100000077',productId=req.body.productId;
    var Users=require('../models/users');
    var someData={};

    function step1(resolve,reject){
        Users.findOne({userId:userId},(err,doc)=>{
            if(err){
                reject(res.json({status:'1',msg:err.message}));
            }else{
                resolve(doc);
            }
        })
    }
    function step2(resolve,reject){
        Goods.findOne({productId:productId},(err,doc)=>{
            if(err){
                reject(res.json({status:'1',msg:err.message}));
            }else{
                resolve({userDoc:someData,proDoc:doc});
            }
        })
    }
    function step3(resolve,reject){
        let goodsItem='';
        someData.userDoc.cartList.forEach(function(item){
            if(item.productId==someData.proDoc.productId){
                goodsItem=item;
                item.productNum++;
            }
        });
        if(goodsItem){
            someData.userDoc.save((err,doc)=>{
                if(err){
                    reject(res.json({status:'1',msg:err.message}));
                }else{
                    resolve(res.json({status:'0',msg:''}));
                }
            });
        }else{
            // var  clone =require('../public/javascripts/common');
            // var proDoc_clone=clone(someData.proDoc);
            // console.log("step3:",proDoc_clone);
            someData.proDoc.productNum=1;
            someData.proDoc.checked=1;
            
            // proDoc_clone.productNum=1;
            // proDoc_clone.checked=1;
            
            someData.userDoc.cartList.push(someData.proDoc);
            someData.userDoc.save((err,doc)=>{
                if(err){
                    reject(res.json({status:'1',msg:err.message}));
                }else{
                    resolve(res.json({status:'0',msg:''}));
                }
            });
        }
        
    }
    new Promise(step1).then(function(val){
        someData=val;
        return new Promise(step2);
    }).then(function(val){
        someData=val;
        return new Promise(step3);
    }).then(function(val){
        //console.info(val);
    });
    
    
})

module.exports=router;