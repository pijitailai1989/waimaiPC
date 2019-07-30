<template>
  <div class="pay-order">
    <common-header/>
    <div class="main">
      <!--支付方式-->
      <pay-method :orderInfo="orderInfo"/>
      <!--支付-->
      <pay-info :orderInfo="orderInfo"/>
    </div>
    <common-footer/>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import PayMethod from "../../components/consume/pay-method"
  import PayInfo from "../../components/consume/pay-info"

  export default {
    name: "pay-order",
    components: {PayInfo, PayMethod},
    data() {
      return {
        // goodsList: [],
        orderInfo: []
      }
    },
    computed: {
      // ...mapState('order', ['cart']),
      // ...mapGetters('order', ['totalNum', 'originalTotal', 'presentTotal','qualityOriginalTotal']),
      // ...mapState('seller', ['sellerInfo']),
      // ...mapState('order', ['address']),
      // actualPrice() {
      //   let result = 0
      //   let {presentTotal} = this
      //   let logistics = this.address.logistics
      //   console.log(this.address)
      //   if (!presentTotal.add) return 0
      //   result = presentTotal.add(logistics)
      //   return result
      // },
      orderId() {
        return this.$route.params.id
      },
    },
    mounted() {
      // let sellerInfo = sessionStorage.getItem('sellerInfo')
      // if (sellerInfo) {
      //   this.sellerInfo = JSON.parse(sellerInfo)
      //   this.getSellerCart()
      // }
      // this.getPayment()
      this.getOrderDetail()
      window.scroll(0,0)
    },
    methods: {
      // ...mapMutations('order',['clearCart']),
      ...mapActions('order',['ajaxOrderDetail']),
      // async getSellerCart() {
      //   this.cart.forEach( item =>{
      //     this.goodsList.push(item)
      //   })
      // },
      // 获取订单详情
      async getOrderDetail() {
        let {orderId} = this
        let res = await this.ajaxOrderDetail({orderId})
        console.log('订单详情', res)
        if (res.code === 1) {
          this.orderInfo = res.data
          // res.data.goods.forEach(item => {
          //   this.goodsList.push(item)
          // })
        } else if (res.code === 401) {
          this.$router.push('/account/login')
        } else {
          this.$message.error(res.message)
        }
      },
    }
  }
</script>

<style lang="scss">
  .pay-order {
    .main {
      @include container;
      background: #fff;
      margin-top: 20px;
      padding: 30px;
      min-height: 700px;
      overflow: hidden;
    }
  }
</style>
