import axios from 'axios'
import Vue from 'vue'
import {
  getCookie
} from '../utils'

export default {
  namespaced: true,
  state() {
    return {
      cart: [],
      address: {
        id: null
      },
      cart_list: []
    }
  },
  getters: {
    getCart(state) {
      // console.log('getcart',state)
      if (state.cart.length <= 0) {
        let cart = JSON.parse(sessionStorage.getItem('cart'));
        return state.cart = cart || []
      }
    },
    // 获取商品在购物车中的数量
    getNumInCart: ({
      cart
    }) => (id) => {
      let num = 0
      // console.log('NumInCart',cart)
      cart.forEach(item => {
        if (item.data.id === id) num += item.num
      })
      return num
    },
    // 购物车商品总数
    totalNum({
      cart
    }) {
      let num = 0
      cart.forEach(item => {
        num += item.num
      })
      return num
    },
    // 未打折商品总原价
    qualityOriginalTotal: ({
      cart
    }) => (id) => {
      let totalPrice = 0
      cart.forEach(item => {
        // console.log('cart-',item)
        if (item.sellerId === id) {
          if (!item.data.presentPrice) {
            // console.log('商品折后价',item.data.presentPrice)
            let price = (item.data.originalPrice || 0).mul(item.num)
            totalPrice = totalPrice.add(price)
          }
        }
      })
      return totalPrice
    },
    // 总原价
    originalTotal({
      cart
    }) {
      let totalPrice = 0
      cart.forEach(item => {
        let price = (item.data.originalPrice || 0).mul(item.num)
        totalPrice = totalPrice.add(price)
      })
      return totalPrice
    },
    // 总现价
    presentTotal({
      cart
    }) {
      let totalPrice = 0
      cart.forEach(item => {
        totalPrice = totalPrice.add(item.price)
      })
      return totalPrice
    },
    // 餐盒费
    lunchBox({
      cart
    }) {
      let lunchBox = 0
      cart.forEach(item => {
        let price = (item.data.lunchboxPrice || 0).mul(item.num)
        lunchBox = lunchBox.add(price)
      })
      return lunchBox
    }
  },

  mutations: {
    // 设置购物车
    setCart(state, data) {
      // console.log('setCart',data)
      state.cart = data
    },
    // 添加到购物车
    addToCart({
      cart
    }, data) {
      // console.log(data, '单条数据');
      // console.log(cart, '购物车数组')
      let isExisted = false
      let price = 0
      let limitCount = 0
      let count = 1
      cart.forEach(elem => {
        if (elem.data.id == data.id && elem.data.attributeId == data.attributeId && elem.data.specsId == data.specsId) {
          count += elem.num
        }
      })
      if (data.isDiscount == 1) {
        if (count > data.limitNum) {
          price = data.originalPrice
          limitCount = 0
        } else {
          price = data.presentPrice
          limitCount = 1
        }
      } else {
        price = data.originalPrice
        limitCount = 0
      }
      if (data.isDiscount == 1 && count - data.limitNum == 1) {
        if (getCookie('lang') == 'zh') {
          Vue.prototype.$message.warning(`限${data.limitNum}件优惠`);
        } else if (getCookie('lang') == 'en') {
          Vue.prototype.$message.warning(`limit${data.limitNum}discount`);
        }
      }
      function getPrice(item, count, data, price = 0) {
        console.log('count', count, data.limitNum)
        if (data.isDiscount == 1) {
          if (count <= data.limitNum) {
            item.limitCount++
            price = data.presentPrice
          } else {
            // if (count - data.limitNum == 1) {
            //   if (getCookie('lang') == 'zh') {
            //     Vue.prototype.$message.warning(`限${data.limitNum}件优惠`);
            //   } else if (getCookie('lang') == 'en') {
            //     Vue.prototype.$message.warning(`limit${data.limitNum}discount`);
            //   }
            // }
            price = data.originalPrice
          }
        } else {
          price = data.originalPrice
        }
        return price
      }
      // console.log('count', count)
      // data.stock--;
      if (data.stock < count) {
        if (getCookie('lang') == 'zh') {
          Vue.prototype.$message.warning(`商品库存不足`);
        } else if (getCookie('lang') == 'en') {
          Vue.prototype.$message.warning(`Insufficient inventory`);
        }
        return
      } else {
        cart.forEach(item => {
          if (item.data.id == data.id && item.data.attributeId == data.attributeId && item.data.goodsId == data.goodsId && item.data.labelId == data.labelId && item.data.specsId == data.specsId) {
            /**
             * @return 无规格无属性
             */
            if (data.isSpecs == 0 && !data.attributeId) {
              if (data.isDiscount == 0) {
                price = data.originalPrice
                item.num++;
              } else {
                // 有优惠
                if (data.id == item.data.id) {
                  item.num++
                  if (item.num - data.limitNum == 1) {
                    if (getCookie('lang') == 'zh') {
                      Vue.prototype.$message.warning(`限${data.limitNum}件优惠`);
                    } else if (getCookie('lang') == 'en') {
                      Vue.prototype.$message.warning(`limit${data.limitNum}discount`);
                    }
                  }
                  // console.log('无规格无属性', item.num, data.limitNum)
                  if (item.num > data.limitNum) {
                    price = data.originalPrice || 0
                  } else {
                    price = data.presentPrice
                  }
                }
              }
            } else if (data.isSpecs == 1 && data.attributeId) {
              /**
               * @return 有规格有属性
               */
              if (data.id == item.data.id && data.specsId && data.specsId == item.data.specsId) {
                item.num++
              }
              // 有优惠
              price = getPrice(item, count, data)
            } else if (data.isSpecs == 1 && !data.attributeId) {
              /**
               * @return  有规格无属性
               */
              if (data.id == item.data.id && data.specsId && data.specsId == item.data.specsId) {
                item.num++
              }
              price = getPrice(item, count, data)
            } else if (data.isSpecs == 0 && data.attributeId) {
              /**
               * @return 无规格有属性
               */
              if (data.id == item.data.id && item.data.attributeId == data.attributeId) {
                item.num++
              }
              price = getPrice(item, count, data)

            }
            item.price = price.add(item.price)
            isExisted = true
          }
          // }
        });
        !isExisted && cart.push({
          data,
          num: 1,
          price,
          limitCount
        })
      }


    },
    // 从购物车中减少
    removeFromCart({
      cart
    }, data) {
      let count = 0
      let price = 0
      let isLoop = false
      let _limitCount = 0
      let addCount = 0
      cart.forEach(elem => {
        if (elem.data.id == data.id && elem.data.attributeId == data.attributeId && elem.data.specsId == data.specsId) {
          count += elem.num
        }
      })

      function getPrice(item, count, data, price = 0) {
        if (data.isDiscount == 1) {
          if (count <= data.limitNum) {
            price = data.presentPrice
            console.log('item.limitCount==========1', item.limitCount)
            item.limitCount--
          } else {
            console.log('item.limitCount============2', item.price, item.num, item.data.presentPrice, item.limitCount)
            if (item.price / (item.num + 1) == item.data.presentPrice) {
              price = data.presentPrice
              console.log('item.limitCount============3', item.limitCount)
              item.limitCount--
              isLoop = true
            } else {
              price = data.originalPrice
            }
          }
        } else {
          console.log('item.limitCount==========4', item.limitCount)
          price = data.originalPrice
        }
        console.log('price', price)
        return price
      }
      cart.forEach((item, index) => {
        if (item.data.id == data.id && item.data.attributeId == data.attributeId && item.data.labelId == data.labelId && item.data.specsId == data.specsId) {
          if (item.num === 1) {
            if (item.price == item.data.presentPrice) isLoop = true
            cart.splice(index, 1)
          } else {
            console.log(item.num);
            /**
             * @return 无规格无属性
             */
            console.log('无规格无属性')
            if (data.isSpecs == 0 && !data.attributeId) {
              if (data.isDiscount == 0) {
                price = data.originalPrice
                item.num--;
              } else {
                // 有优惠
                if (data.id == item.data.id) {
                  if (data.limitNum < item.num) {
                    price = data.originalPrice || 0
                  } else {
                    price = data.presentPrice
                  }
                  item.num--
                }
              }
            } else if (data.isSpecs == 1 && data.attributeId) {
              /**
               * @return 有规格有属性
               */
              if (data.id == item.data.id && data.specsId && data.specsId == item.data.specsId) {
                item.num--
              }
              console.log('有规格有属性')
              // 有优惠
              price = getPrice(item, count, data)
            } else if (data.isSpecs == 1 && !data.attributeId) {
              /**
               * @return  有规格无属性
               */
              if (data.id == item.data.id && data.specsId && data.specsId == item.data.specsId) {
                item.num--
              }

              price = getPrice(item, count, data)
            } else if (data.isSpecs == 0 && data.attributeId) {
              /**
               * @return 无规格有属性
               */
              console.log('无规格有属性')
              if (data.id == item.data.id && item.data.attributeId == data.attributeId) {
                item.num--
              }
              price = getPrice(item, count, data)

            }
            item.price = price.sub(item.price)
          }
        }

      })
      if (isLoop) {
        for (let [index, elem] of cart.entries()) {
          if (elem.data.id == data.id && elem.data.attributeId == data.attributeId && elem.data.specsId == data.specsId && elem.data.labelId !== data.labelId && elem.price >= elem.data.originalPrice && elem.price / elem.num != elem.data.presentPrice) {
            if (elem.data.isDiscount == 1) {
              elem.price = elem.price - elem.data.originalPrice + elem.data.presentPrice
            }
            console.log('elem.price', elem.price, elem.data.originalPrice, elem.data.presentPrice)
            return
          }
        }
      }
    },
    // 清空购物车
    clearCart({
      cart
    }) {
      cart.splice(0, cart.length)
      // sessionStorage.removeItem('cart')
      // localStorage.removeItem('cart')
    },
    // 选择地址
    setAddress(state, data) {
      // console.log(data)
      state.address = data
      console.log('state.address', state.address)
      // state.address.id = data.id
    },
    // 清空收货地址
    clearAddress(state) {
      // console.log(data)
      state.address = {}
      // console.log('state.address', state.address)
      // state.address.id = data.id
    }
  },
  actions: {
    // 加入购物车 —— 新
    async add_to_cart(store, data) {
      let {
        data: res
      } = await axios.post('/innerService/batchAddGoodsCart', data)
      return res
    },
    // 订单列表
    async ajaxOrderList(store, data) {
      let {
        data: res
      } = await axios.post('/innerService/TheOrderList', data)
      return res
    },
    // // 订单详情
    async ajaxOrderDetail(store, data) {
      let {
        data: res
      } = await axios.post('/innerService/TheOrderDetails', data)
      return res
    },
    // // 退款详情
    async ajaxRefundDetail(store, data) {
      let {
        data: res
      } = await axios.post('/innerService/DetailsOfTheRefund', data)
      return res
    },
    // 申请退款
    async ajaxApplyRefund(store, data) {
      let {
        data: res
      } = await axios.post('/innerService/ToApplyForARefund', data)
      return res
    },
    // // 下单（创建订单）
    async ajaxPlaceOrder(store, data) {
      let {
        data: res
      } = await axios.post('/innerService/orderInfo', data)
      return res
    },
    // 支付订单
    async ajaxPayOrder(store, data) {
      let {
        data: res
      } = await axios.post('/innerService/addPayOrder', data)
      return res
    },
    // 支付宝支付
    async ajaxAliply(store, data) {
      let res = await axios.post('innerService/zfbPayOrder', data)
      return res
    },
    // 生成微信支付二维码
    async ajaxPaymenWebCat(store, data) {
      let res = await axios.post('/openservice/makeQRCode', data, {
        responseType: 'arraybuffer'
      })
        .then(response => new Buffer(response.data, 'binary').toString('base64'))
        .then(data => {
          return 'data:image/png;base64,' + data
        });
      return res
    },
    // // 删除订单
    // async ajaxDeleteOrder(store, data) {
    //   let auth = localStorage.getItem('auth')
    //   let { data: res } = await axios.post('/innerservice/removeOrder', data, JSON.parse(auth))
    //   return res
    // },
    // // 取消订单
    async ajaxCancelOrder(store, data) {
      let {
        data: res
      } = await axios.post('/innerService/CancelTheOrder', data)
      return res
    },
    // //获取qiniu token
    async ajaxGetQiniuToken(store, data) {
      let auth = localStorage.getItem('auth')
      let {
        data: res
      } = await axios.post('/openservice/getImgToken', null, JSON.parse(auth))
      return res.data;
    },
    // // 提交订单评价
    async ajaxSubmitEvaluate({
      store
    }, data) {
      let {
        data: res
      } = await axios.post('/innerService/EvaluationOfTheOrder', data)
      return res
    },
    // // 获取评价详情
    async ajaxEvaluateDetail({
      store
    }, data) {
      let {
        data: res
      } = await axios.post('/innerService/OrderCommentDetailsInfo', data)
      return res
    },
    // // 获取订单评论列表
    async ajaxComment(store, data) {
      let {
        data: res
      } = await axios.post('/innerService/userComment', data)
      return res
    },
    // 删除订单评价
    async ajaxDelComment(store, data) {
      let {
        data: res
      } = await axios.post('/innerService/deleteUserComment', data)
      return res
    },
    // // 获取配送详情
    async ajaxDeliveryDetail({
      store
    }, data) {
      let {
        data: res
      } = await axios.post('/innerService/DistributionLocation', data)
      return res
    },
    async ajaxPaymentList({
      store
    }, data) {
      let {
        data: res
      } = await axios.post('/innerService/getPaymentList', data)
      return res
    }
  }
}
