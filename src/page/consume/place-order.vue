<template>
  <div class="place-order">
    <!--头部-->
    <common-header/>
    <!--主内容-->
    <div class="main">
      <div class="top">
        <h3>{{$t('payMent.paymentHall')}}</h3>
        <el-button type="info" plain @click="goBack">{{$t('payMent.back')}}</el-button>
      </div>
      <common-loading v-if="loading" />
      <!--地址列表-->
      <address-list v-else :addressList="addressList" @refreshList="getAddressList" />
      <!--商品列表-->
      <goods-list :goodsList="goodsList" />
      <!--选择下单-->
      <choose-place :goodsList="goodsList" />
    </div>
    <!--底部-->
    <common-footer/>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import AddressList from "../../components/consume/address-list"
import GoodsList from "../../components/consume/goods-list";
import ChoosePlace from "../../components/consume/choose-place";

export default {
  name: "place-order",
  components: { ChoosePlace, GoodsList, AddressList },
  data() {
    return {
      addressList: [],
      goodsList: [],
      couponList: [],
      reductionList: [],
      sellerInfo: null,
      loading: true
    }
  },
  computed: {
    ...mapState('order', ['cart']),
    ...mapGetters('order', ['originalTotal', 'presentTotal']),
  },
  created () {
    console.log('商家信息1',this.goodsList)
    
  },
  mounted() {
    let sellerInfo = sessionStorage.getItem('sellerInfo')
    if (sellerInfo) {
      this.sellerInfo = JSON.parse(sellerInfo)
      this.getAddressList()
      this.getSellerCart()
    }
    console.log('商家信息',this.goodsList)
    // this.setAddress()
    if(this.goodsList.length<=0){
      this.goBack()
    }
    
  },
  methods: {
    ...mapMutations('order', ['setCart']),
    ...mapActions('user', ['ajaxAddressList' ,'ajaxUserOrderAddress']),
    ...mapMutations('order', ['setAddress']),
    goBack() {
      this.$router.go(-1)
    },
    async getAddressList() {
      this.loading = true;
      let sellerId = this.sellerInfo.id
      this.addressList = [];
      let res = await this.ajaxUserOrderAddress({ sellerId })
      if (res.code === 1) {
        res.data.forEach(item => {
          this.addressList.push(item)
        })
      } else if (res.code === 401) {
        this.$router.push('/account/login')
      }
      this.loading = false;
    },
    async getSellerCart() {
      this.cart.forEach( item =>{
        this.goodsList.push(item)
      })
      // console.log(this.goodsList)
      // console.log('cart',cart)
      // if (!cart) {
      //   this.$message.error('购物车为空')
      // } else {
      //   cart = JSON.parse(cart)
      //   cart.forEach(item => {
      //     this.goodsList.push(item)
      //   })
      // }
      // let cart = sessionStorage.getItem('cart')
      // if (!cart) {
      //   this.$message.error('购物车为空')
      // } else {
      //   cart = JSON.parse(cart)
      //   cart.forEach(item => {
      //     this.goodsList.push(item)
      //   })
      //   this.setCart(cart)
      // }
    },

  }
}

</script>
<style scoped lang="scss">
.place-order {
  .main {
    @include container;
    margin-top: 20px;
    padding: 30px;
    background: #fff;
    .top {
      overflow: hidden;
      height: 60px;
      border-bottom: 1px solid #ddd;
      h3 {
        float: left;
        font-size: 18px;
        font-weight: bold;
        color: #333;
      }
      .el-button {
        float: right;
      }
    }
  }
}

</style>
