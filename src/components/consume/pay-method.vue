<template>
  <div class="pay-method">
    <h2>{{$t('payMent.payInfo.payMonney')}}
      <span>{{orderInfo.actual_price}}P</span>
    </h2>
    <p class="surplus">
      <img src="../../assets/icon/time@2x.png" />{{$t('payMent.payInfo.payTime')}}
      <span>{{left_time}}</span>
    </p>
    <div class="credit-card">
      <p>{{$t('payMent.payInfo.payType')}}</p>
      <p class="exchange-rate">{{$t('payMent.payInfo.exchangeRate')}} {{exchangeRate}}</p>
      <div class="icon-list">
        <img src="../../assets/icon/pic_WeChat_Pay_small.png" />
        <img src="../../assets/icon/pic_alipay_small.png">
      </div>
      <ul class="card-list">
        <li v-for="(item, index) in paymentMdList" :key="index" :class="{active: activeIndex===index}" @click="choosePay(item,index)">
          <span>
            <img :src="item.logo" alt="">
            <span>{{item.paymentName}}</span>
          </span>
          <span class="renminbi">￥{{item.orderMoney}}</span>
        </li>
      </ul>
      <!-- <ul class="card-list">
        <li :class="{active : activeIndex === 1}" @click="choosePay(1)">
          <span><img src="../../assets/icon/pic_WeChat_Pay_big.png"/></span>
          <span class="renminbi">￥</span>
        </li>
        <li :class="{active : activeIndex === 2}" @click="choosePay(2)">
          <span><img src="../../assets/icon/pic_alipay_big.png"/></span>
          <span class="renminbi">￥</span>
        </li>
      </ul> -->
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters, mapState } from 'vuex'

  export default {
    name: "pay-method",
    props: ['orderInfo'],
    components: {},
    data() {
      return {
        activeIndex: '',
        paymentMdList: [],
        exchangeRate: '',
        pay_type: null,
        payId: null,
        createTime: null,
        left_time: '00:00',
        cancelLoading: false,
        orderMoney: ''
      }
    },
    computed: {
      orderId() {
        return this.$route.params.id
      }
    },
    async mounted() {
      await this.getPayment()
      await this.computedLastPayTime()
      sessionStorage.setItem('paymentId', null)
      sessionStorage.setItem('pay_type', null)
    },
    methods: {
      ...mapActions('order', ['ajaxPaymentList', 'ajaxCancelOrder', 'ajaxOrderDetail']),
      choosePay(item, index) {
        this.activeIndex = index
        this.payId = item.id
        this.pay_type = item.pay_type
        sessionStorage.setItem('paymentId', this.payId)
        sessionStorage.setItem('pay_type', this.pay_type)
      },
      async getPayment() {
        let { orderId } = this
        let res = await this.ajaxOrderDetail({ orderId })
        if (res.code === 1) {
          this.orderMoney = res.data.actual_price
        }
        if (this.orderMoney) {
          let res = await this.ajaxPaymentList({ orderId, orderMoney: this.orderMoney, payPermission: 2 })
          if (res.code === 1) {
            console.log('选择支付', res)
            this.exchangeRate = res.data.exchangeRate
            this.createTime = res.data.orderTime
            res.data.paymentList.forEach(item => {
              this.paymentMdList.push(item)
              sessionStorage.setItem('orderMoney', item.orderMoney)
            })
            // let payId
            // res.data.paymentMdList.forEach(item=>{
            //   payId = item.id
            // })
            // sessionStorage.setItem('payId', JSON.stringify(sellerInfo))
          }
        }
      },
      // async cancelOrder() {
      //   self.cancelLoading = true;
      //   let res = self.ajaxCancelOrder({orderId})
      //   if (res.code===1) {
      //     self.$message.error(self.$t('payMent.payInfo.overtime'))
      //     this.$router.push('/place')
      //   }
      //   self.cancelLoading = false;
      // },
      computedLastPayTime() {
        let self = this, lastTime
        let { orderId } = self;
        let createTime = parseInt((self.createTime) / 1000);
        let endTime = createTime + 900;
        let clientTime = parseInt((new Date()) / 1000);
        if (endTime < clientTime) {
          // let res = self.ajaxCancelOrder({orderId})
          self.$message.error(self.$t('payMent.payInfo.overtime'))
          this.$router.push('/place')
          return
        }
        lastTime = endTime - clientTime;

        self.left_time = self.getTime(lastTime)
        let timer = setInterval(() => {
          if (lastTime <= 1) {
            clearInterval(timer)
            self.cancelLoading = true;
            let res = self.ajaxCancelOrder({ orderId })
            console.log(res)
            // if (res.code===1) {
            self.$message.error(self.$t('payMent.payInfo.overtime'))
            this.$router.push('/place')
            // }
          }
          lastTime--
          self.left_time = self.getTime(lastTime)
        }, 1000)

      },
      getTime(val) {
        if (!val) val = 0
        val = parseInt(val);
        var arr = [],
          hh;
        var ss = val % 60;
        var mm = parseInt(val / 60);
        if (mm > 60) {
          hh = parseInt(mm / 60);
          mm = mm % 60;
          arr.push(hh);
          arr.push(mm);
        } else {
          arr.push(mm);
        }
        arr.push(ss);
        for (var i = 0; i < arr.length; i++) {
          arr[i] = arr[i] < 10 ? '0' + arr[i] : arr[i];
        }
        return arr.join(':')
      },
    }
  }
</script>

<style lang="scss">
  .pay-method {
    width: 700px;
    float: left;
    h2 {
      font-size: 18px;
      color: #333333; // border-bottom: 1px solid #DDDDDD;
      padding-bottom: 10px;
      span {
        color: #FF644D !important;
      }
    }
    .surplus {
      color: #858585;
      height: 17px;
      line-height: 17px;
      img {
        margin-right: 5px;
        margin-bottom: -2px;
      }
    }
    .el-alert {
      margin-top: 20px;
      padding-top: 15px;
      padding-bottom: 15px;
      i.el-icon-close {
        display: none;
      }
    }
    @mixin card {
      // background: #FAFAFA;
      border: 1px solid #EBEBEB;
      padding: 0 15px;
      margin-top: 20px;
      border-radius: 4px; // padding: 30px 20px;
      position: relative;
      &.active {
        background: #fff;
      }
      .el-radio {
        .el-radio__label {
          font-size: 16px;
          color: #666;
        }
      }
      p {
        width: 336px; // margin-left: 15px;
        line-height: 22px;
        &:first-child {
          margin-top: 15px;
          color: #333333;
          font-size: 15px;
        }
      }
      .exchange-rate {
        margin-bottom: 15px;
        color: #999999;
        font-size: 12px;
      }
    }
    @mixin icon-layout {
      position: absolute;
      top: 30px;
      right: 20px;
      transform: translateY(-30%);
    }
    .balance {
      @include card;
      img.icon {
        @include icon-layout;
      }
    }
    .credit-card {
      @include card;
      .icon-list {
        @include icon-layout;
        overflow: hidden;
        img {
          float: left;
          &:first-child {
            // margin-top: #{(24 - 16) / 2}px;
            margin-right: 10px;
          }
        }
      }
      ul.card-list {
        // padding-top: 20px;
        margin-bottom: 20px;
        border-top: 1px solid #EBEBEB;
        overflow: hidden;
        li {
          float: left;
          width: 160px;
          height: 60px;
          border: 1px solid #EBEBEB; // border-radius: 8px;
          position: relative;
          box-sizing: border-box;
          cursor: pointer;
          margin-right: 29px;
          margin-top: 20px;
          // @include list-distance(29px);
          span {
            &:first-child {
              width: 75%;
              @include layout-center;
              margin-top: -5px;
            }
            img {
              width: 1.2rem;
              margin-bottom: -4px;
            }
            span {
              font-size: 16px;
              margin-left: 6px;
            }
          }
          span.renminbi {
            color: #999999;
            font-size: 14px;
            font-weight: normal;
            @include layout-center;
            margin-top: 12px
          }
        }
        .active {
          border-color: #ff644d;
          background: url('../../assets/icon/choose@2x.png') no-repeat right bottom;
          background-size: 1.5rem;
        }
      }
    }

  }
</style>