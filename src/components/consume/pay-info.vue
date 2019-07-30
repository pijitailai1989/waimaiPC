<template>
  <div class="pay-info">
    <h2>{{$t('payMent.orderSummary')}}</h2>
    <div class="seller-info">
      <!-- <img v-lazy="orderInfo.seller_photo" style="object-fit: cover"> -->
      <img :src="orderInfo.seller_photo" style="object-fit: cover">
      <div class="name">{{orderInfo.sellerName}}</div>
      <div class="phone">
        <i class="iconfont icon-zhanghushezhi-shoujiicon1"></i>
        {{$t('order.list.alert.shopTel')}}: {{orderInfo.sellerPhone}}
      </div>
    </div>
    <div class="address-info">
      <p>
        <span>{{orderInfo.name}}</span>
        <span>{{orderInfo.sex===0?$t('payMent.Msr'):$t('payMent.miss')}} {{orderInfo.phone}}</span>
      </p>
      <div class="address">
        <div class="label">{{$t('order.detail.label.add')}}: </div>
        <p>{{orderInfo.address}} {{orderInfo.house_number}}</p>
      </div>
    </div>
    <div class="goods">
      <ul class="title-list">
        <li>{{$t('order.detail.listHeader.food')}}</li>
        <li>{{$t('order.detail.listHeader.price')}}</li>
        <li>{{$t('order.detail.listHeader.num')}}</li>
        <li>{{$t('order.detail.listHeader.amount')}}</li>
      </ul>
      <ul class="goods-list" v-for="(item, index) in goodsList" :key="index">
        <li>
          <p>
            {{item.goodsName}}
          </p>
          <p>
            <span v-if="item.goodsSpecifications">{{item.goodsSpecifications}}</span>
            <span v-if="item.goodsSpecifications && item.goodsAttributeLabel">/</span>
            <span v-if="item.goodsAttributeLabel">{{item.goodsAttributeLabel}}</span>
          </p>
        </li>
        <li>{{item.presentPrice}}P</li>
        <li>{{item.num}}</li>
        <li>{{item.totalPrice}}P</li>
      </ul>
    </div>
    <ul class="summary">
      <li>
        <div class="title">{{$t('payMent.foodPrice')}}: </div>
        <div class="price">{{fixCount(parseFloat(parseFloat(orderInfo.logistics).sub(parseFloat(orderInfo.actual_price) - parseFloat(orderInfo.total_lunchbox_price))))}}P</div>
      </li>
      <li v-if="orderInfo.total_lunchbox_price!=0">
        <div class="title">{{$t('payMent.lunch_box_fee')}}: </div>
        <div class="price">{{orderInfo.total_lunchbox_price}}P</div>
      </li>
      <li>
        <div class="title">{{$t('payMent.freight')}}: </div>
        <div class="price">{{orderInfo.logistics}}P</div>
      </li>
      <li>
        <div class="title">{{$t('payMent.total')}}: </div>
        <div class="price">{{orderInfo.actual_price}}P</div>
      </li>
    </ul>
    <div class="pay-button">
      <el-button type="primary" :loading="payLoading" @click="payOrder">{{$t('order.list.toPay')}}</el-button>
    </div>
    <!-- 微信支付弹框 -->
    <el-dialog :visible.sync="weChatDialogVisible" width="30%" :before-close="handleClose" center class="wechat-pay">
      <p>{{$t('payMent.weChatPay')}}
        <span class="renbi">￥{{paymentMoney}}</span>
      </p>
      <div class="wechatImg">
        <div>
          <img :src="WeChatImg" />
        </div>
        <div class="pay-notes" v-if="!sweeping">
          <img src="../../assets/img/scanBg@2x.png" alt="" />
        </div>
        <div class="pay-notes" v-else>
          <img src="../../assets/img/sweep@2x.png" alt="" />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="completePay">{{$t('payMent.pay')}}</el-button>
      </span>
    </el-dialog>

    <!-- 支付宝支付弹框 -->
    <el-dialog :visible.sync="alipayDialogVisible" width="30%" :before-close="handleClose" center>
      <p class="alipay">
        <span>{{$t('payMent.alipay')}}</span>
        <span class="notes">{{$t('payMent.close')}}</span>
        <img src="../../assets/icon/warming@2x.png" alt="">
      </p>
      <div></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="completePay">{{$t('payMent.pay')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { mapActions, mapMutations } from "vuex";
  import { getCookie } from "../../utils.js";

  export default {
    name: "pay-info",
    props: ["orderInfo"],
    data() {
      return {
        // orderInfo: {
        //   logo: null,
        //   sellerName: null,
        //   sellerPhone: null,
        //   name: null,
        //   sex: null,
        //   phone: null,
        //   address: null,
        //   houseNumber: null,
        //   totalPrice: null,
        //   discountMoney: null,
        //   logistics: null,
        //   actualPrice: null
        // },
        // goodsList: [],
        payLoading: false,
        weChatDialogVisible: false,
        alipayDialogVisible: false,
        aliplyHtml: [],
        WeChatImg: null,
        paymentMoney: null,
        sweeping: false,
        payStatus: "",
        createTime: "",
        timer: ""
      };
    },
    computed: {
      orderId() {
        return this.$route.params.id;
      },
      goodsList() {
        return this.orderInfo.Goods;
      }
    },
    async mounted() {
      let lang = getCookie("lang");
      if (lang == "en") {
        this.sweeping = true;
      } else {
        this.sweeping = false;
      }
      // await this.getOrderDetail()
      // await this.getOrderStatus()
    },
    methods: {
      ...mapActions("order", [
        "ajaxPayOrder",
        "ajaxOrderDetail",
        "ajaxPaymenWebCat",
        "ajaxAliply"
      ]),
      ...mapMutations("order", ["clearCart"]),
      // 获取订单详情
      // async getOrderDetail() {
      //   let res = await this.ajaxOrderDetail({ orderId: this.orderId })
      //   if (res.code === 1) {
      //     // console.log('orderStatus', res)
      //     let createTime = parseInt(res.data.create_time / 1000) + 900
      //     this.payStatus = res.data.order_status
      //     if (this.payStatus === 1) {
      //       this.$router.push('/user/my-order/all')
      //       this.clearCart()
      //       clearInterval(this.timer)
      //     }
      //     this.createTime = createTime
      //   }
      // },
      // // 获取订单状态
      // async getOrderStatus() {
      //   let timeNow = parseInt((new Date()) / 1000)
      //   let payTime = parseInt(this.createTime - timeNow)
      //   let self = this
      //   if (timeNow > self.createTime) {
      //     console.log('已超过有效支付时间')
      //     clearInterval(self.timer)
      //   } else {
      //     self.timer = setInterval(() => {
      //       self.getOrderDetail()
      //       if (payTime <= 1) {
      //         clearInterval(self.timer)
      //       }
      //       if (self.payStatus === 1) {
      //         // self.$router.push('/user/my-order/all')
      //         clearInterval(self.timer)
      //       }
      //       payTime -= 10
      //     }, 10000)
      //   }
      // },
      fixCount(count) {
        return parseFloat(count.toFixed(2));
      },
      // 支付
      async payOrder() {
        console.log("pay_type:::" + sessionStorage.getItem("pay_type"));
        if (sessionStorage.getItem("pay_type") == "null") {
          this.$message.error(this.$t("payMent.select_payment_method"));
        }
        if (!this.orderInfo.paymentTime) {
          this.payLoading = true;
          let paymentId = sessionStorage.getItem("paymentId");
          let pay_type = sessionStorage.getItem("pay_type");
          let paymentMoney = JSON.parse(sessionStorage.getItem("orderMoney"));
          this.paymentMoney = paymentMoney;
          let { orderId } = this;
          let newWin = {};
          if (!paymentId) {
            this.$message.warning(this.$t("payMent.payInfo.payType"));
            this.payLoading = false;
            return;
          } else if (pay_type == "zfb") {
            console.log(orderId);
            this.alipayDialogVisible = true;
            setTimeout(() => {
              newWin = window.open("blank.html");
              let url = `https://dev.loong.ph/waimai/innerService/zfbPayOrder?paymentId=1&payOrderType=2&orderId=${orderId}&device=3`;
              newWin.location.href = url;
            }, 300);

            // let res = await this.ajaxAliply({
            //   paymentId,
            //   payOrderType: 2,
            //   orderId,
            //   device: 3
            // })
            // if (res.code===1) {
            //   console.log('3333',res)
            //   this.aliplyHtml = res.data
            //   // newWin.document.charset = 'utf-8'
            //   newWin.document.write(this.aliplyHtml)
            // } else {
            //   this.$message.error(res.message)
            // }
          } else if (pay_type == "wx") {
            setTimeout(() => {
              this.weChatDialogVisible = true;
            }, 600);
            let res = await this.ajaxPayOrder({
              paymentId,
              payOrderType: 2,
              orderId,
              device: 3
            });

            if (res.code === 1) {
              console.log("6666", res);
              this.aliplyHtml = res.data;
            }
            if (this.aliplyHtml) {
              let param = this.aliplyHtml;
              let WeChatImg = await this.ajaxPaymenWebCat({ param });
              this.WeChatImg = WeChatImg;
            }
          } else if (pay_type == "paypal") {
            // debugger;
            // let newPage = window.open('blank_pay.html')
            let resPay = await this.ajaxPayOrder({
              paymentId,
              payOrderType: 2,
              orderId,
              device: 3
            });

            if (resPay.code === 1) {
              let aliplyHtml = resPay.data;
              console.log("8888888", this.aliplyHtml);
              window.location.href = aliplyHtml;
            }
            // if (this.aliplyHtml) {
            //   let param = this.aliplyHtml
            //   let WeChatImg = await this.ajaxPaymenWebCat({ param });
            //   this.WeChatImg = WeChatImg
            // }
          } else if (pay_type == "iPay88") {
            setTimeout(() => {
              newWin = window.open("iPay88.html");
              let url = `https://dev.loong.ph/waimai/innerService/iPay88PayOrder?paymentId=6&payOrderType=2&orderId=${orderId}&device=3`;
              newWin.location.href = url;
            }, 300);
          }
          this.payLoading = false;
        } else {
          this.$message.warning(this.$t("payMent.payInfo.payed"));
        }
        //

        // console.log(this.orderId())
        //   let params = {
        //     paymentId: '402881b260a190910160a1a448a61232',//支付方式
        //     OrderId: this.$route.params.id
        //   }
        //   // console.log('payParams',params)
        //   // this.$message.error('支付通道等待开通')
        //   let res = await this.ajaxPayOrder(params)
        //   console.log(res)
        //   if(this.$checkData(res)) {
        //     this.payLoading = false
        //     this.$router.push('/order/pay-success')
        //   }else {
        //     this.$message.error('支付失败！')
        //   }
      },
      handleClose(done) {
        // sessionStorage.removeItem('paymentId')
        // sessionStorage.removeItem('paymentMoney')
        this.$router.go(0);
        done();
      },
      // 完成支付
      completePay() {
        this.weChatDialogVisible = false;
        this.alipayDialogVisible = false;
        window.scrollTo(0, 0);
        this.$router.push("/user/my-order/all");
        sessionStorage.removeItem("paymentId");
        sessionStorage.removeItem("paymentMoney");
        this.clearCart();
      }
    }
  };
</script>

<style scoped lang="scss">
  .pay-info {
    width: 350px;
    float: right;
    h2 {
      font-size: 18px;
      color: #333333;
      border-bottom: 1px solid #dddddd;
      padding-bottom: 30px;
    }
    @mixin block {
      padding: 20px 0;
      border-bottom: 1px dashed #dddddd;
    }
    .seller-info {
      @include block;
      clear: both;
      img {
        float: left;
        width: 70px;
        height: 40px;
      }
      @mixin text {
        height: 20px;
        line-height: 20px;
        margin-left: 80px;
      }
      .name {
        @include text;
        @include text-over;
        font-weight: bold;
        color: #333;
      }
      .phone {
        @include text;
        @include text-over;
        font-size: 12px;
        color: #666;
        i {
          font-size: 12px;
        }
      }
    }
    .address-info {
      @include block;
      p:first-child {
        span:first-child {
          font-weight: bold;
        }
        span:last-child {
          // float: right;
          font-size: 12px;
        }
      }
      .address {
        overflow: hidden;
        margin-top: 15px;
        .label {
          float: left;
          width: 20%;
          font-size: 12px;
        }
        p {
          float: left;
          width: 80%;
          font-size: 12px;
        }
      }
    }
    .goods {
      @include block;
      padding-bottom: 0;
      @mixin list {
        overflow: hidden;
        li {
          float: left;
          width: 15%;
          text-align: center;
          margin-bottom: 20px;
          color: #666666;
          &:first-child {
            width: 55%;
            text-align: left;
            @include text-over;
          }
          &:last-child {
            text-align: right;
          }
        }
      }
      ul.title-list {
        @include list;
      }
      ul.goods-list {
        @include list;
        li:last-child {
          color: $color-primary;
        }
        li {
          p {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    ul.summary {
      @include block;
      padding-bottom: 0;
      border-bottom: none;
      li {
        overflow: hidden;
        margin-bottom: 20px;
        .title {
          float: left;
          text-align: left;
        }
        .price {
          float: right;
          color: $color-primary;
          text-align: right;
        }
        &:last-child {
          padding-top: 30px;
          border-top: 1px solid #ebebeb;
          .price {
            font-size: 24px;
          }
        }
      }
    }
    .pay-button .el-button {
      width: 100%;
      margin-top: 10px;
    }
    .el-dialog {
      p {
        text-align: center;
      }
      .pay-notes {
        width: 200px;
        margin-top: -10px;
        img {
          width: 100%;
        }
      }
      .el-button {
        width: 205px;
        margin-top: -10px;
      }
    }
    .wechatImg {
      width: 100%;
      div {
        width: 250px;
        margin: 0 auto;
        img {
          width: 100%;
        }
      }
    }
    .alipay {
      position: relative;
      width: 275px;
      margin: 0 auto;
      span {
        &:first-child {
          display: block;
          font-weight: bold;
          font-size: 16px;
          width: 200px;
          margin: 0 auto;
          color: #333333;
        }
      }
      .notes {
        color: #a8a8a8;
        width: 210px;
        display: block;
        margin: 0 auto;
      }
      img {
        position: absolute;
        left: 0;
        top: 5%;
      }
    }
  } // @media screen and (max-width: 1730px){
  //   .alipay {
  //     span {
  //       margin-left: 55px;
  //     }
  //   }
  // }
</style>