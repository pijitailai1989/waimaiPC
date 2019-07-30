import axios from 'axios'

export default {
  namespaced: true,
  state() {
    return {
      sellerInfo: {
        // businessEndTime: null,
        // businessStartTime: null,
        // deliveryScheme: null,
        // deliveryInfo: null,
        // deliveryInfoEn: null,
        // distance: null,
        // id: null,
        // km: null,
        // lat: null,
        // limitDeliveryCost: null,
        // location: null,
        // locationEn: null,
        // logistics: null,
        // logo: null,
        // lon: null,
        // notice: null,
        // noticeEn: null,
        // phone: null,
        // score: null,
        // sellerName: null,
        // sellerNameEn: null
      }
    }
  },
  mutations: {
    setSeller(state, data) {
      state.sellerInfo = data
    }
  },
  actions: {
    // 搜索
    // async ajaxSearch(store, data) {
    //   let {data: res} = await axios.post('/openservice/indexSearch', data)
    //   return res
    // },
    // // 商家分类
    async ajaxSellerClass() {
      let {data: res} = await axios.post('/openservice/getIndexSellerLabel')
      return res
    },
    // // 商家列表
    async ajaxSellerList(store, data) {
      let {data: res} = await axios.post('/openservice/getSortSellerListPage', data)
      return res
    },
    // // 商家排序及筛选
    async ajaxSellerSort(store, data) {
      let {data: res} = await axios.post('/openservice/getSortSellerListPage', data)
      return res
    },
    // // 商家信息
    async ajaxSellerInfo(store, data) {
      let {data: res} = await axios.post('/openservice/getSellerInfo', data)
      if (res.code === 1) {
        // store.commit('setSeller', res.data)
      }
      return res
    },
    // // 商家菜品列表
    async ajaxSellerGoods(store, data) {
      let {data: res} = await axios.post('/openservice/getSellerGoods', data)
      return res
    },
    // // 商家评价列表
    async ajaxSellerRate(store, data) {
      let {data: res} = await axios.post('/openservice/getOrderCommentListPage', data)
      return res
    },
    // // 商家评分统计
    async ajaxSellerPoints(store, data) {
      let {data: res} = await axios.post('/openservice/getOrderCommentInfo', data)
      return res
    },
    // // 商家资质信息
    async ajaxSellerQualification(store, data) {
      let {data: res} = await axios.post('/openservice/getSellerSaterial', data)
      return res
    },
    // // 举报商家
    async ajaxReportSeller(store, data) {
      let auth = localStorage.getItem('auth')
      let {data: res} = await axios.post('/innerservice/addComplaints', data)
      return res
    }
  }
}
