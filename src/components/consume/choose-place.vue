<template>
  <div class="choose-place">
    <div class="left">
      <div class="row">
        <div class="title">{{$t('payMent.payMethod')}}</div>
        <div class="form">
          <el-button plain:autofocus="true" disabled>{{$t('payMent.payOnline')}}</el-button>
        </div>
      </div>
      <!-- <div class="row">
        <div class="title">选择优惠券</div>
        <div class="form">
          <el-select v-model="coupon" placeholder="只能选择一种优惠" @change="chooseCoupon">
            <el-option v-for="(item, index) in couponList" :key="index" :label="item.title"
                       :value="item.activity_id"></el-option>
          </el-select>
        </div>
      </div>
      <div class="row">
        <div class="title">选择支付优惠</div>
        <div class="form">
          <el-select v-model="reduction" placeholder="只能选择一种优惠" @change="chooseReduction">
            <el-option v-for="(item, index) in reductionList" :key="index" :label="item.title"
                       :value="item.id"></el-option>
          </el-select>
        </div>
      </div> -->
      <div class="row">
        <div class="title">{{$t('payMent.writeRemark')}}</div>
        <div class="form form-textarea">
          <el-input type="textarea" :rows="6" :placeholder="$t('payMent.placehouder')" v-model="remark" resize="none" maxlength="150"></el-input>
        </div>
      </div>
    </div>
    <div class="right">
      <ul>
        <li>
          <div class="title">{{$t('payMent.foodCount')}}</div>
          <div class="price">{{totalNum}}{{$t('seller.content.count')}}</div>
        </li>
        <li>
          <div class="title">{{$t('payMent.foodPrice')}}</div>
          <div class="price">{{presentTotal}}P</div>
        </li>
        <li v-show="lunchBox != 0">
          <div class="title">{{$t('payMent.lunch_box_fee')}}</div>
          <div class="price">{{lunchBox||0}}P</div>
        </li>
        <li v-show="address.logistics">
          <div class="title">{{$t('payMent.freight')}}</div>
          <div class="price">{{address.logistics||0}}P</div>
        </li>
        <li>
          <div>{{$t('seller.cart.prompt')}}</div>
        </li>
        <li>
          <div class="title">{{$t('payMent.total')}}</div>
          <div class="price">{{actualPrice}}P</div>
        </li>
      </ul>
      <div class="place-button">
        <el-button type="primary" :loading="placeLoading" @click="placeOrder">{{$t('payMent.goPay')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
  import { getCookie } from "../../utils.js";

  export default {
    name: "choose-place",
    props: ["goodsList"],
    data() {
      return {
        // couponList: [{title: '不使用优惠券'}],
        // reductionList: [{title: '不使用满减优惠'}],
        // coupon: null,
        // reduction: null,
        remark: "",
        status: 1,
        // sellerInfo: {
        //   id: null,
        //   logistics: null
        // },
        placeLoading: false
      };
    },
    computed: {
      ...mapState("order", ["address"]),
      ...mapGetters("order", [
        "totalNum",
        "originalTotal",
        "presentTotal",
        "lunchBox"
      ]),

      actualPrice() {
        let result = 0,
          logistics;
        let { presentTotal, lunchBox } = this;
        // let {presentTotal, couponMoney, reductionMoney} = this
        if (this.address.status === 1) {
          logistics = 0;
        } else if (this.address.id == null) {
          logistics = 0;
        } else {
          logistics = this.address.logistics;
        }
        console.log(this.address);
        if (!presentTotal.add) return 0;
        result = (presentTotal.add(logistics) + lunchBox).toFixed(2);
        result = parseFloat(result);
        return result;
      }
      // 当前购物车 正品 商品总原价
      // cartQualityOriginalTotal () {
      //   let {qualityOriginalTotal} = this
      //   let id = this.sellerInfo.id
      //   return qualityOriginalTotal(id)
      // },
    },
    mounted() {
      // this.getPayOrderDiscount()
      // this.getPayOrderReducelist()
      // console.log(this.address)
    },
    methods: {
      ...mapMutations("order", ["clearCart"]),
      // ...mapActions('user', ['ajaxCouponList']),
      // ...mapActions('user', ['ajaxCouponList', 'ajaxFullReduction','ajaxDiscount']),
      ...mapActions("order", ["ajaxPlaceOrder"]),

      isEmojiCharacter(substring) {
        for (var i = 0; i < substring.length; i++) {
          var hs = substring.charCodeAt(i);
          if (0xd800 <= hs && hs <= 0xdbff) {
            if (substring.length > 1) {
              var ls = substring.charCodeAt(i + 1);
              var uc = (hs - 0xd800) * 0x400 + (ls - 0xdc00) + 0x10000;
              if (0x1d000 <= uc && uc <= 0x1f77f) {
                return true;
              }
            }
          } else if (substring.length > 1) {
            var ls = substring.charCodeAt(i + 1);
            if (ls == 0x20e3) {
              return true;
            }
          } else {
            if (0x2100 <= hs && hs <= 0x27ff) {
              return true;
            } else if (0x2b05 <= hs && hs <= 0x2b07) {
              return true;
            } else if (0x2934 <= hs && hs <= 0x2935) {
              return true;
            } else if (0x3297 <= hs && hs <= 0x3299) {
              return true;
            } else if (
              hs == 0xa9 ||
              hs == 0xae ||
              hs == 0x303d ||
              hs == 0x3030 ||
              hs == 0x2b55 ||
              hs == 0x2b1c ||
              hs == 0x2b1b ||
              hs == 0x2b50
            ) {
              return true;
            }
          }
        }
      },

      // 下单
      async placeOrder() {
        // let {goodsList, sellerInfo, address, remark, presentTotal, actualPrice, coupon, couponMoney, reduction, reductionMoney} = this
        let {
          goodsList,
          address,
          remark,
          presentTotal,
          actualPrice,
          lunchBox,
          originalTotal
        } = this;

        if (this.isEmojiCharacter(remark)) {
          this.$message.error(this.$t("payMent.note_emoticons"));
          return;
        }
        if (!address.id) {
          this.$message.error(this.$t("payMent.lookAdd"));
          return;
        }
        if (address.status === 1) {
          this.$message.error(this.$t("payMent.goAway"));
          return;
        }
        let arr = [],
          sellerId;
        goodsList.forEach(item => {
          arr.push({
            goodsId: item.data.id,
            num: item.num,
            goodsAttribute: item.data.specsId == 0 ? "" : item.data.specsId,
            goodsAttributeLabel: item.data.labelId == 0 ? "" : item.data.labelId
          });
          sellerId = item.data.sellerId;
        });
        arr.reverse();
        let discountMoney = 0;
        this.placeLoading = true;
        let res = await this.ajaxPlaceOrder({
          GoodsList: JSON.stringify({ GoodsList: arr }),
          sellerId,
          logistics: address.logistics,
          AdderId: address.id,
          remark: this.remark,
          // totalPrice: originalTotal.add(address.logistics) + lunchBox,
          totalPrice: actualPrice,
          actualPrice,
          discountMoney: 0,
          device: 3,
          totalLunchboxPrice: lunchBox
        });
        console.log("下订单", res.message);
        // this.placeLoading = false;
        if (res.code === 1) {
          window.scrollTo(0, 0);
          this.$router.push(`/order/pay/${res.data}`);
          this.clearCart();
        } else if (res.code === 401) {
          this.$router.push("/account/login");
        } else if (
          res.message == "Insufficient inventory" ||
          res.message == "商品库存不足"
        ) {
          this.$message.error(this.$t("payMent.insufficient_inventory"));
        } else if (
          res.message == "Not during business hours, can't go down" ||
          res.message == "不在营业时间内，不能下单"
        ) {
          this.$message.error(this.$t("payMent.not_during_business_hours"));
        } else if (res.code == 9999) {
          this.$message.error(res.message);
        } else if (getCookie("order") == null) {
          this.$message.error(this.$t("payMent.add_address"));
        } else {
          // alert("成功");
          let { goodsList, address, remark, presentTotal, actualPrice } = this;
          if (!address.id) {
            this.$message.error(this.$t("payMent.lookAdd"));
            return;
          }
          let arr = [],
            sellerId;
          goodsList.forEach(item => {
            arr.push({ goodsId: item.data.id, num: item.num });
            sellerId = item.data.sellerId;
          });
          let discountMoney = 0;
          this.placeLoading = true;
          let res = await this.ajaxPlaceOrder({
            GoodsList: JSON.stringify({ GoodsList: arr }),
            sellerId,
            logistics: address.logistics,
            AdderId: address.id,
            remark: this.remark,
            totalPrice: presentTotal.add(address.logistics),
            actualPrice,
            discountMoney: 0,
            device: 3
          });
          console.log("下订单", res.message);
          this.placeLoading = false;
          if (res.code === 1) {
            window.scrollTo(0, 0);
            this.$router.push(`/order/pay/${res.data}`);
            // this.clearCart()
          } else if (res.code === 401) {
            this.$router.push("/account/login");
          } else if (
            res.message == "Insufficient inventory" ||
            res.message == "商品库存不足"
          ) {
            this.$message.error(this.$t("payMent.insufficient_inventory"));
          } else if (getCookie("order") == null) {
            this.$message.error(this.$t("payMent.add_address"));
          } else {
            this.$message.error(res.message);
          }
        }

      }
    }
  };
</script>

<style scoped lang="scss">
  .choose-place {
    overflow: hidden;
    padding-top: 30px;
    border: 1px solid #ebebeb;
    border-top: none;
    .left {
      width: 70%;
      float: left;
      padding-left: 30px;
      padding-right: 100px;
      .row {
        height: 40px;
        overflow: hidden;
        margin-bottom: 20px;
        .title {
          float: left;
          line-height: 40px;
          margin-right: 30px;
          width: 100px;
        }
        .form {
          float: left;
          width: 500px;
        }
        &:last-child {
          height: 160px;
        }
      }
      .el-select {
        width: 100%;
      }
      .form-textarea {
        margin-top: 4px;
      }
    }
    .right {
      width: 30%;
      float: right;
      padding-bottom: 30px;
      ul {
        li {
          overflow: hidden;
          margin-bottom: 24px;
          .title {
            float: left;
            width: 33.33%;
            text-align: left;
          }
          .price {
            float: right;
            color: $color-primary;
            /*width: 33.33%;*/
            text-align: right;
            padding-right: 40px;
          }
          &:last-child {
            padding-top: 30px;
            border-top: 1px solid #ebebeb;
            margin-right: 38px;
            .price {
              font-size: 24px;
              padding-right: 0;
            }
          }
        }
      }
      .place-button {
        padding-right: 35px;
        .el-button {
          width: 100%;
        }
      }
    }
  }
</style>