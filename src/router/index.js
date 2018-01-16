import Vue from 'vue'
import Router from 'vue-router'

import GoodsList from './../views/GoodsList.vue'
import Cart from '@/views/cart'
import Address from '@/views/address'
import OrderConfirm from '@/views/OrderConfirm'
import OrderSuccess from '@/views/orderSuccess'

Vue.use(Router)

export default new Router({
    routes:[
        {
            path:'/',
            name:'goodsList',
            component:GoodsList
        },{
            path:'/cart',
            name:'cart',
            component:Cart
        },{
            path:'/address',
            name:'address',
            component:Address
        },{
            path:'/orderConfirm',
            name:'orderConfirm',
            component:OrderConfirm
        },{
            path:'/orderSuccess',
            name:'orderSuccess',
            component:OrderSuccess
        }
    ]
})