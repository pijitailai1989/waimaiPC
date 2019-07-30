<template>
  <div class="seller" >
    <common-header/>
    <seller-header v-if="!error"/>
    <div class="main">
      <seller-goods class="goods" @alertparent="alertSa" :goodsLists="goodsLists" :loading="loading" v-if="!error"/>
      <seller-announce class="announce" type="1" v-if="!error"/>
    </div>
    <common-no-data v-if="error" :message="$t('seller.noSeller')" style="min-height: 580px; padding-top: 100px;"/>
    <seller-cart v-show="getBusFlag==1"  v-if="!error"/>
    <seller-alert :goodsData="goodsData" @closeAlert='close_alert' @spaceOk="space_ok" v-if="alert" />
    <!--返回顶部-->
    <common-back-top />
    <div class="shop_status" v-show="getBusFlag!=1&&!statusShow"><span>{{$t('seller.content.resting')}}</span></div>
    <div class="shop_status" style="bottom:60px;" v-show="getBusFlag!=1&&statusShow"><span>{{$t('seller.content.resting')}}</span></div>
    <common-footer/>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import SellerHeader from "../../components/seller/seller-header";
import SellerGoods from "../../components/seller/seller-goods";
import SellerCart from "../../components/seller/seller-cart";
import SellerAlert from "../../components/seller/seller-alert";
import SellerAnnounce from "../../components/seller/seller-announce";

export default {
  name: "seller",
  components: {
    SellerAnnounce,
    SellerCart,
    SellerGoods,
    SellerHeader,
    SellerAlert
  },
  data() {
    return {
      goodsLists: [],
      loading: false,
      error: false,
      alert: false,
      goodsData: null,
      statusShow: false
    };
  },
  computed: {
    ...mapState("seller", ["sellerInfo"]),
    getBusFlag() {
      return this.sellerInfo.busFlag;
    },
    sellerId() {
      return this.$route.params.id;
    }
  },
  watch: {
    vuexx: "change"
  },
  mounted() {
    window.addEventListener("scroll", this.scrollStatus);
    window.scroll(0, 0);
    this.clearCart()
    // let lastSellerId = sessionStorage.getItem('sellerId')
    // if(this.sellerId != lastSellerId) {
    //   this.clearCart()
    // }
    this.getSellerGoods();
    // console.log(this.getSellerInfo,'getSellerInfo')
  },
  methods: {
    ...mapMutations("order", ["clearCart", "setCart"]),
    ...mapActions("seller", ["ajaxSellerGoods"]),
    async getSellerGoods() {
      this.loading = true;
      let { sellerId } = this;
      let stockGoods = ''
      let res = await this.ajaxSellerGoods({ sellerId });
      // console.log('ajaxSellerGoods',res)
      if (res.code === 1) {
        res.data.forEach(item => {
          this.goodsLists.push(item);
          item.goodsList.forEach(el=> {
            el.stockGoods = el.stock
          })
        });
        // console.log('goodlist',this.goodsLists)
        // this.goodsLists = res.data;
      } else {
        this.error = true;
      }
      this.loading = false;
    },
    space_ok(alert) {
      this.alert = alert;
    },
    close_alert(alert) {
      this.alert = alert;
    },
    alertSa(data) {
      // console.log(data, 'val')
      this.alert = true;
      this.goodsData = data;
    },
    scrollStatus() {
      let scrollTop = document.documentElement.scrollTop;
      let clientHeight = document.documentElement.clientHeight;
      let scrollHeight = document.documentElement.scrollHeight;
      if (scrollHeight - scrollTop - clientHeight <= 10) {
        this.statusShow = true;
      } else {
        this.statusShow = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.seller {
  height: 100vh;
  .main {
    @include container;
    overflow: hidden;
  }
  .goods {
    float: left;
  }
  .announce {
    float: right;
  }
}
.shop_status {
  width: 100%;
  height: 60px;
  background: rgba(216, 216, 216, 0.83);
  color: white;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    font-size: 20px;
    // margin-top:40px;
  }
}
</style>