import axios from 'axios'

export default {
  namespaced: true,
  state() {
    return {
      userInfo: null
    }
  },
  mutations: {
    setUser(state, data) {
      state.userInfo = data
    }
  },
  actions: {
    // 获取图片识别码
    async ajaxCodeImg(store, data) {
      let res = await axios
      .post('/openService/getCaptchaImage', data,{
        responseType: 'arraybuffer'
      })
      .then(response => new Buffer(response.data, 'binary').toString('base64'))
      .then(data => {
        return 'data:image/png;base64,'+data
      });
      return res
    },
    // 发送短信
    async ajaxSendMessage(store, data) {
      let {data: res} = await axios.post('/openService/getPhoneVcode', data)
      return res
    },
    // 校验是否需要图形验证码
    async ajaxImageFlag(store, data) {
      let {data: res} = await axios.post('/openService/getCaptchaImageFlag', data)
      return res
    },
    // 校验短信验证码(手机注册模块)
    async ajaxCheckCode(store, data) {
      let {data: res} = await axios.post('/openService/checkPhoneRegVcode', data)
      return res
    },
    // 校验手机短信是否正确(找回密码模块)
    async ajaxCheckPhoneVcode(store, data) {
      let {data: res} = await axios.post('/openService/checkPhoneVcode', data)
      return res
    },
    // 登录
    async ajaxLogin(store, data) {
      let {data: res} = await axios.post('/openService/login', data)
      return res
    },
    // 退出登录
    async ajaxLogout(store, data) {
      let {data: res} = await axios.post('/openService/logout', data)
      return res
    },
    // 注册
    async ajaxRegister(store, data) {
      let {data: res} = await axios.post('/openService/mobileRegister', data)
      return res
    },
    // 获取用户信息
    async ajaxUserInfo(store) {
      // let auth = localStorage.getItem('auth')
      // let {data: res} = await axios.post('innerService/userinfo', null, JSON.parse(auth))
      let {data: res} = await axios.post('innerService/userinfo')
      return res
    },
    // // 忘记密码
    async ajaxForgetPassword(store, data) {
      let {data: res} = await axios.post('/openService/resetPassword', data)
      return res
    },
    // // 修改密码
    async ajaxChangePassword(store, data) {
      let {data: res} = await axios.post('/innerService/ChangeThePassword', data)
      return res
    },
    // 修改资金密码
    async ajaxChangePayPassword(store, data) {
      let {data: res} = await axios.post('/innerService/ChangeThePayPassword', data)
      return res
    },
    // // 新增资金密码
    // async ajaxAddMoneyPassword(store, data) {
    //   let auth = localStorage.getItem('auth')
    //   let {data: res} = await axios.post('/innerservice/MoneyPassword', data, JSON.parse(auth))
    //   return res
    // },
    // // 资金密码状态
    // async ajaxMoneyPasswordStatus() {
    //   let auth = localStorage.getItem('auth')
    //   let {data: res} = await axios.post('/innerservice/balanceAndCoupon', null, JSON.parse(auth))
    //   return res
    // },
    // // 修改昵称或头像
    async ajaxChangeUserInfo(store, data) {
      // let {data: res} = await axios.post('innerService/ChangeThePhotoAndName', data, JSON.parse(auth))
      let {data: res} = await axios.post('/innerService/ChangeThePhotoAndName', data)
      return res
    },
    async ajaxChangeUserPhone(store, data) {
      // let auth = localStorage.getItem('auth')
      // let {data: res} = await axios.post('innerService/ChangeThePhotoAndName', data, JSON.parse(auth))
      let {data: res} = await axios.post('/innerService/updateMobileBind', data)
      return res
    },
    // // 获取用户已有地址列表
    async ajaxAddressList(store, data) {
      // let auth = localStorage.getItem('auth')
      let {data: res} = await axios.post('/innerService/getReceivingAddress', data)
      return res
    },
    // // 新增地址
    async ajaxNewAddress(store, data) {
      // let auth = localStorage.getItem('auth')
      let {data: res} = await axios.post('/innerService/insertReceivingAddress', data)
      return res
    },
    // // 修改地址
    async ajaxChangeAddress(store, data) {
      // let auth = localStorage.getItem('auth')
      let {data: res} = await axios.post('/innerService/updateReceivingAddress', data)
      return res
    },
    // // 删除地址
    async ajaxDeleteAddress(store, data) {
      // let auth = localStorage.getItem('auth')
      let {data: res} = await axios.post('/innerService/deleteReceivingAddress', data)
      return res
    },
    // // 获取收藏列表
    async ajaxCollectList(store, data) {
      // let auth = localStorage.getItem('auth')
      let {data: res} = await axios.post('/innerservice/getCollectionSellerListPage', data)
      return res
    },
    // // 收藏商家
    async ajaxCollectStatus(store, data) {
      // let auth = localStorage.getItem('auth')
      let {data: res} = await axios.post('/innerservice/collectionSeller', data)
      return res
    },
    // 取消收藏
    async ajaxCollect(store, data) {
      // let auth = localStorage.getItem('auth')
      let {data: res} = await axios.post('/innerservice/disCollectionSeller', data)
      return res
    },
    // // 获取个人中心余额与优惠券数量
    async ajaxAccountBalance(store, data) {
      // let auth = localStorage.getItem('auth')
      let {data: res} = await axios.post('/innerService/userAccountBalance', null)
      return res;
    },
    // // 获取用户余额明细
    async ajaxBalanceLog(store, data) {
      // let auth = localStorage.getItem('auth')
      let {data: res} = await axios.post('/innerService/balanceLog', data)
      return res;
    },
    // 获取下单 优惠券 与满减 最优
    async ajaxDiscount(store, data) {
      let {data: res} = await axios.post('/innerService/PreferentialInformation', data)
      return res
    },
    // // 个人中心优惠券
    // async ajaxCouponUser(store, data) {
    //   let auth = localStorage.getItem('auth')
    //   let {data: res} = await axios.post('/innerservice/couponlog', data, JSON.parse(auth))
    //   return res
    // },
    // // 获取优惠券（下单）
    // async ajaxCouponList(store, data) {
    //   let auth = localStorage.getItem('auth')
    //   let {data: res} = await axios.post('/innerservice/myCoupon', data, JSON.parse(auth))
    //   return res
    // },
    // // 获取满减（下单）
    // async ajaxFullReduction(store, data) {
    //   let auth = localStorage.getItem('auth')
    //   let {data: res} = await axios.post('/innerservice/FullReduction', data, JSON.parse(auth))
    //   return res
    // },
    // // 获取可送外卖地址
    // async ajaxArea() {
    //   let {data: res} = await axios.post('/openservice/getArea', null)
    //   return res
    // },
    // // 获取可送外卖地址
    async ajaxPosition(store, data) {
      let {data: res} = await axios.post('/openservice/positioning', data)
      return res
    },
    // 根据商家地址获取可送货地址
    async ajaxUserOrderAddress(store, data) {
      let {data: res} = await axios.post('/innerService/UserOrderAddress', data)
      return res
    },
    // 查询招聘信息列表
    async ajaxGetRecruitmentInfoList(store, data) {
      let {data: res} = await axios.get('/openservice/getRecruitmentInfoList', data)
      return res
    },
    // 查询招聘信息列表
    async ajaxGetRecruitmentInfoById(store, data) {
      let {data: res} = await axios.get('/openservice/getRecruitmentInfoById', data)
      return res
    },
    // 查询招聘信息列表
    async ajaxGetRecruitmentArea(store, data) {
      let {data: res} = await axios.get('/openservice/getRecruitmentArea', data)
      return res
    }
  }
}
