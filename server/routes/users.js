var express = require('express');
var router = express.Router();

var User = require('../models/users');
require('../util/util.js')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', (req, res, next) => {
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(param, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
      console.log("err:", err)
    } else {
      if (doc) {
        res.cookie("userId", doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        res.cookie("userName", doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        //req.session.user=doc;
        res.json(
          {
            status: '0',
            msg: '',
            result: {
              userName: doc.userName
            }
          }
        )
      } else {
        res.json({
          status: '1',
          msg: '账号名货密码错误'
        })
      }
    }
  })
})

//登出接口
router.post('/logout', (req, res, next) => {
  res.cookie('userId', '', {
    path: '/',
    maxAge: 0
  })
  res.json({
    status: '0',
    msg: '',
    result: ''
  })
})
//登陆检测
router.get('/checkLogin', (req, res, next) => {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: { userName: req.cookies.userName }
    })
  } else {
    res.json({
      status: '1',
      msg: '未登陆',
      result: ''
    })
  }
})
//购物车数据
router.get('/cartList', (req, res, next) => {
  if (req.cookies.userId) {
    User.findOne({ userId: req.cookies.userId }, (err, doc) => {
      if (err) {
        res.json({
          status: '1',
          msg: '无此用户',
          result: ''
        })
      } else {
        if (doc) {
          res.json({
            status: '0',
            msg: '',
            result: doc
          })
        }
      }
    })
  } else {
    res.json({
      status: '1',
      msg: '请先登陆',
      result: ''
    })
  }
})
//购物车 删除货物
router.post('/cart/del', (req, res, next) => {
  let productId = req.body.productId;
  let userId = req.cookies.userId;
  if (userId) {
    User.update({ userId: userId }, { $pull: { cartList: { productId: productId } } }, (err, doc) => {
      if (err) {
        res.json({
          status: '1',
          msg: '删除失败',
          result: ''
        })
      } else {
        res.json({
          status: '0',
          msg: '',
          result: doc
        })
      }
    })
  } else {
    res.json({
      status: '1',
      msg: '请先登陆',
      result: ''
    })
  }
})

//修改购物车 商品数据
router.post('/cart/edit', (req, res, next) => {
  var userId = req.cookies.userId,
    productId = req.body.productId,
    productNum = req.body.productNum,
    checked = req.body.checked;
  User.update({ userId: userId, 'cartList.productId': productId }, { 'cartList.$.productNum': productNum, 'cartList.$.checked': checked }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: '修改失败',
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: doc
        })
      }
    }
  })
})
router.post('/cart/checkAll', (req, res, next) => {
  var userId = req.cookies.userId,
    checkAllFlag = req.body.checkAllFlag;
  User.findOne({ userId: userId }, (err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: '请先登陆',
        result: ''
      })
    } else {
      if (userDoc) {
        userDoc.cartList.forEach((item) => {
          item.checked = checkAllFlag ? 1 : 0;
        })
        userDoc.save((err, doc) => {
          if (err) {
            res.json({
              status: '1',
              msg: '选择失败',
              rusult: ''
            })
          } else {
            res.json({
              status: '0',
              msg: '',
              result: doc
            })
          }
        })
      }
    }
  })
})

//取用户地址
router.get('/address', (req, res, next) => {
  var userId = req.cookies.userId;
  if (!userId) {
    res.json({
      status: '1',
      msg: '请先登陆',
      result: ''
    })
  } else {
    User.findOne({ userId: userId }, (err, doc) => {
      if (err) {
        res.json({
          status: '1',
          msg: '地址获取失败',
          result: ''
        })
      } else {
        res.json({
          status: '0',
          msg: '',
          result: doc.addressList
        })
      }
    })
  }
})
// 设置默认地址
router.post('/address/setDefault', (req, res, next) => {
  var userId = req.cookies.userId,
    addressId = req.body.addressId;
  if (!userId) {
    res.json({
      status: '1',
      msg: '请先登陆',
      result: ''
    })
  } else {
    User.findOne({ userId: userId }, (err, userDoc) => {
      if (err) {
        res.json({
          status: '1',
          msg: '获取用户失败',
          result: ''
        })
      } else {
        userDoc.addressList.forEach((item) => {
          if (item.addressId == addressId) {
            item.isDefault = true;
          } else {
            item.isDefault = false;
          }
        })
        userDoc.save((err, doc) => {
          if (err) {
            res.json({
              status: '0',
              msg: '设置默认地址失败',
              result: ''
            })
          } else {
            res.json({
              status: '0',
              msg: '',
              result: ''
            })
          }
        })
      }
    })
  }
})

//地址 删除
router.post('/address/del', (req, res, next) => {
  var userId = req.cookies.userId,
    addressId = req.body.addressId;
  if (!userId) {
    res.json({
      status: '1',
      msg: '请先登陆',
      result: ''
    })
  } else {
    User.update({ userId: userId }, { $pull: { addressList: { addressId: addressId } } }, (err, doc) => {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      } else {
        res.json({
          status: '0',
          msg: '',
          result: ''
        })
      }
    })
  }
})

// 保存订单信息
router.post('/payment', (req, res, next) => {
  var userId = req.cookies.userId,
    addressId = req.body.addressId,
    orderTotal = req.body.orderTotal;
  if (!userId) {
    res.json({
      status: '0',
      msg: '请先登陆',
      result: ''
    })
  } else {
    User.findOne({ userId: userId }, (err, userDoc) => {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      } else {
        var address = {}, goodsList = [];
        userDoc.addressList.some((item) => {
          if (item.addressId == addressId) {
            address = item;
            return true;
          }
        })
        userDoc.cartList.forEach((item) => {
          if (item.checked == 1) {
            goodsList.push(item)
          }
        })

        var plateform = '622'
        var r1 = Math.floor(Math.random() * 10)
        var r2 = Math.floor(Math.random() * 10)
        var sysdate = new Date().Format("yyyyMMddhhmmss")
        var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')
        var orderId = plateform + r1 + sysdate + r2

        var order = {
          orderId: orderId,
          orderTotal: orderTotal,
          addressInfo: address,
          goodsList: goodsList,
          orderStatus: 1,
          createDate: createDate
        }
        userDoc.orderList.push(order)
        userDoc.save((err, doc) => {
          if (err) {
            res.json({
              status: '1',
              msg: err.message,
              result: ''
            })
          } else {
            res.json({
              status: '0',
              msg: '',
              result: { orderId: order.orderId, orderTotal: orderTotal }
            })
          }
        })
      }
    })
  }
})

//订单成功页面 取金额
router.get('/orderDetail', (req, res, next) => {
  var userId = req.cookies.userId,
    orderId = req.param('orderId');
  if (!userId) {
    res.json({
      status: '1',
      msg: '请先登陆',
      result: ''
    })
  } else {
    User.findOne({userId:userId},(err,userDoc)=>{
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else{
        if(!orderId){
          res.json({
            status:'1',
            msg:'此订单号无效',
            result:''
          })
        }else{
          var orderTotal=0
          var isExist=false
          userDoc.orderList.some((item)=>{
            if(item.orderId==orderId){
              orderTotal=item.orderTotal
              isExist=true
              return true
            }
          })
          if(isExist){
            res.json({
              status:'0',
              msg:'',
              result:orderTotal
            })
          }else{
            res.json({
              status:'1',
              msg:'无此订单号',
              result:''
            })
          }
          
        }
      }
    })
  }
})

//登陆成功后获取购物车商品数量
router.get('/cartCount',(req,res,next)=>{
  var userId = req.cookies.userId;
  if (!userId) {
    res.json({
      status: '1',
      msg: '请先登陆',
      result: ''
    })
  } else {
    User.findOne({userId:userId},(err,userDoc)=>{
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else{
        var cartCount=0;
        userDoc.cartList.map((item)=>{
          cartCount = Number(cartCount) + Number(item.productNum)
        })
        res.json({
          status:'0',
          msg:'',
          result:{cartCount:cartCount}
        })
      }
    })
  }
})
module.exports = router;
