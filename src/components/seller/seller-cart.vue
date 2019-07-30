<template>
  <div class="seller-cart" :style="{bottom: '60px', left: elemLeft}">
    <div class="top">
      <div class="header">{{$t('seller.cart.prompt')}}</div>
      <span class="title">{{$t('seller.cart.cart')}}</span>
      <span class="clear" @click="clearCarts">
        <i class="iconfont icon-shanchuicon1"></i>{{$t('seller.cart.clear')}}</span>
    </div>
    <div class="list-head" v-if="cart.length > 0">
      <span>{{$t('order.detail.listHeader.food')}}</span>
      <span>{{$t('order.detail.listHeader.count')}}</span>
      <span>{{$t('order.detail.listHeader.price')}}</span>
    </div>
    <ul class="goods-list">
      <li v-for="(item, index) in cart" :key="index">
        <span class="name">{{item.data.goodsName}}
          <p>
            {{item.data.goodsSpecs}}
            <span v-if="item.data.goodsAttributeLabel && item.data.goodsSpecs">/</span>
            {{item.data.goodsAttributeLabel}}
          </p>
        </span>
        <div class="change-num">
          <div class="minus" @click="removeFromCart(item.data)"></div>
          <span>{{item.num}}</span>
          <div class="plus" @click="addToCart(item.data)"></div>
        </div>
        <span class="price">{{showPrice(item.price)}}P</span>
      </li>
      <li v-if="lunchBox !== 0">
        <div class="hefei">
          <span>{{$t('payMent.lunch_box_fee')}}</span>
          <span>{{lunchBox}}P</span>
        </div>
        <!-- <div class="price">{{sellerInfo.logistics || 0}}P</div> -->
      </li>
      <li v-if="sellerInfo.logistics">
        <div class="hefei">
          <span>{{$t('payMent.freight_tip')}}</span>
          <span>{{sellerInfo.logistics}}P</span>
        </div>
        <!-- <div class="price">{{sellerInfo.logistics || 0}}P</div> -->
      </li>
    </ul>
    <div class="bottom">
      <div class="info">
        <i class="iconfont icon-icon_shopping"></i>
        <!-- <span v-if="cart.length>0">{{$t('seller.cart.common')}} {{presentTotal + lunchBox}} P</span> -->
        <span v-if="cart.length>0">{{$t('seller.cart.common')}} {{newPrice}} P</span>
        <span v-else>{{$t('seller.cart.emptyCart')}}</span>
      </div>
      <div class="button" @click="toPlace" v-if="presentTotal + lunchBox >= (sellerInfo.limitDeliveryCost) && presentTotal!=0 || (!sellerInfo.limitDeliveryCost && cart.length>0)">
        <span>{{$t('seller.cart.placeOrder')}}</span>
      </div>
      <div class="button-under" v-else>
        <span>{{sellerInfo.limitDeliveryCost || 0}}P {{$t('seller.cart.charging')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";

export default {
  name: "seller-cart",
  data() {
    return {
      bottom: 0,
      elemLeft: "52.5%",
      newPrice: 0
    };
  },
  computed: {
    ...mapGetters("order", ["getCart"]),
    ...mapState("order", ["cart"]),
    ...mapState("seller", ["sellerInfo"]),
    ...mapState("seller", ["getLogistics"]),
    ...mapGetters("order", ["presentTotal"]),
    ...mapGetters("order", ["lunchBox"]),
    sellerId() {
      return this.$route.params.id;
    },
    cart_info() {
      // return store.state.
    }
  },
  watch: {
    presentTotal: function(newVal) {
      this.newPrice = parseFloat((newVal + this.lunchBox).toFixed(2));
    }
  },
  mounted() {
    if (document.getElementsByClassName("announce")[0].offsetLeft) {
      this.elemLeft =
        document.getElementsByClassName("announce")[0].offsetLeft +
        document.getElementsByClassName("main")[0].offsetLeft +
        "px";
    }
    window.addEventListener("scroll", this.scrollHandler);
    window.addEventListener("resize", () => {
      this.elemLeft =
        document.getElementsByClassName("announce")[0].offsetLeft +
        document.getElementsByClassName("main")[0].offsetLeft +
        "px";
    });
    let lastSellerId = sessionStorage.getItem("sellerId");
    if (this.sellerId != lastSellerId) {
      this.clearCarts();
      this.clearCart();
    }
    // this.getCart
    this.newPrice = parseFloat((this.presentTotal + this.lunchBox).toFixed(2));
  },
  methods: {
    ...mapMutations("order", ["addToCart", "removeFromCart", "clearCart"]),
    ...mapActions("user", ["ajaxUserInfo"]),
    showPrice(price) {
      return parseFloat(parseFloat(price).toFixed(2));
    },
    async toPlace() {
      let { cart, sellerInfo } = this;
      sessionStorage.setItem("cart", JSON.stringify(cart));
      sessionStorage.setItem("sellerId", this.sellerId);
      sessionStorage.setItem("sellerInfo", JSON.stringify(sellerInfo));
      window.scrollTo(0, 0);
      let res = await this.ajaxUserInfo();
      console.log(res);
      if (res) {
        if (res.code == 1) {
          this.$router.push(`/order/place`);
        }
      } else {
        this.$router.push({
          path: "/account/login",
          query: {
            Id: this.sellerId,
            name: this.$route.name
          }
        });
      }
    },
    clearCarts() {
      this.cart.splice(0, this.cart.length);
      this.clearCart();
      sessionStorage.removeItem("cart");
      // console.log('clear-cart',this.cart)
    },
    scrollHandler() {
      let clientHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      let scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      let distance = scrollHeight - clientHeight - scrollTop;
      if (distance < 375) {
        this.bottom = 375 - distance;
      } else {
        this.bottom = 0;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.seller-cart {
  position: fixed;
  left: 52.5%;
  // transform: translateX(210px);
  z-index: 10;
  width: 380px;
  box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.02);
  overflow: hidden;
  .top {
    background: #fafafa;
    /* height: 90px; */
    line-height: 30px;
    padding: 0 20px;
    border-bottom: 1px solid #ddd;
    overflow: hidden;
    .header {
      background-color: #fff0ed;
      color: #ff3633;
      text-align: center;
      padding-left: 10px;
    }
    .title {
      float: left;
    }
    .clear {
      float: right;
      cursor: pointer;
      i {
        margin-right: 5px;
      }
      &:hover {
        color: $color-primary;
      }
    }
  }
  .list-head {
    width: 380px;
    height: 50px;
    line-height: 50px;
    background: #fff;
    border-bottom: 1px solid #ddd;
    padding: 0 20px;
    overflow: hidden;
    color: #999;
    span {
      display: inline-block;
      width: 70px;
      float: left;
      text-align: center;
      &:first-child {
        width: 180px;
        text-align: left;
      }
      &:last-child {
        margin-left: 20px;
      }
    }
  }
  ul.goods-list {
    background: #fff;
    width: 380px;
    max-height: 180px;
    overflow-y: auto;
    li {
      overflow: hidden;
      height: 45px;
      // line-height: 50px;
      padding: 0 20px;
      border-bottom: 1px solid #ddd;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      .name {
        float: left;
        width: 160px;
        margin-right: 20px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        p {
          font-size: 12px;
          color: #999;
        }
      }
      .hefei {
        display: flex;
        justify-content: space-between;
      }
      .hefei > span:nth-child(1) {
        flex: 1;
      }
      .hefei > span:nth-child(2) {
        width: 70px;
        text-align: center;
        color: #ff644c;
      }
      .nameMore {
        float: left;
        width: 265px;
      }
      .change-num {
        float: left;
        width: 70px;
        box-sizing: border-box;
        border-top: 1px solid #e6e6e6;
        border-bottom: 1px solid #e6e6e6;
        height: 22px;
        border-radius: 11px;
        overflow: hidden;
        line-height: 15px;
        // margin-top: 14px;
        text-align: center;
        span {
          display: inline-block;
          color: #333;
          height: 20px;
          line-height: 20px;
          text-align: center;
        }
        div {
          width: 20px;
          height: 20px;
          text-align: center;
          box-sizing: border-box;
          cursor: pointer;
          background: #fff;
          user-select: none;
          border-radius: 50%;
          color: #333;
          border: 1px solid #e6e6e6;
          font-size: 13px;
          font-weight: bold;
        }
        .minus {
          float: left;
          position: relative;
          &:before {
            content: "";
            position: absolute;
            top: 8px;
            left: 5px;
            width: 8px;
            height: 2px;
            background: #666;
            border-radius: 4px;
          }
        }
        .plus {
          float: right;
          position: relative;
          &:before {
            content: "";
            position: absolute;
            top: 8px;
            left: 5px;
            width: 8px;
            height: 2px;
            background: #666;
            border-radius: 4px;
          }
          &:after {
            content: "";
            position: absolute;
            top: 5px;
            left: 8px;
            width: 2px;
            height: 8px;
            background: #666;
            border-radius: 4px;
          }
        }
      }
      .price {
        float: right;
        width: 70px;
        text-align: center;
        margin-left: 20px;
        color: $color-primary;
      }
    }
  }
  .bottom {
    overflow: hidden;
    .info {
      float: left;
      width: 250px;
      height: 60px;
      line-height: 60px;
      background: #665c5c;
      color: #fff;
      padding-left: 20px;
      font-size: 20px;
      i {
        font-size: 24px;
        margin-right: 20px;
      }
    }
    .button {
      float: left;
      width: 130px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      background: $color-primary;
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      user-select: none;
      cursor: pointer;
    }
    .button-under {
      float: left;
      width: 130px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      background: #807373;
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      user-select: none;
    }
  }
}
</style>