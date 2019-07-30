<template>
  <div class="seller-goods">

    <!--分类-->
    <div class="goods-class">
      <div class="header">
        <router-link :to="item.url" :class="{active : index === 0}" v-for="(item, index) in urlList" :key="index">
          {{item.name}}
        </router-link>
      </div>
      <el-row>
        <el-col :span="4" v-for="(item, index) in goodsLists" :key="index" class="class-list">
          <a :href="'#'+item.id">{{item.name}}</a>
        </el-col>
      </el-row>
      <!--加载中-->
      <common-loading v-if="loading" />
      <common-no-data :message="$t('accountInfo.notCount')" v-if="!loading && goodsLists.length === 0" />
    </div>
    <!--列表-->
    <div class="goods-list">
      <div class="goods-group" v-for="(group, index) in goodsLists" :key="index">
        <div class="title" :id="group.id">{{group.name}}</div>
        <div class="product-list">
          <div class="product" v-for="(item) in group.goodsList" :key="item.id">
            <!--产品头像-->
            <!-- <img v-lazy="item.goodsPhotoPath" class="avatar" @click="showImageSwiper([item.goodsPhotoPath],0)" style="object-fit: cover"> -->
            <div class="white_mask" v-if="item.stockGoods==0"></div>
            <img :src="item.goodsPhotoPath" class="avatar" @click="showImageSwiper([item.goodsPhotoPath],0)" style="object-fit: cover">
            <div class="content">
              <!--名称-->
              <div class="name">{{item.goodsName}}</div>
              <!--销量, 推荐-->
              <div class="data">
                <span class="sale">{{$t('seller.content.goodsSold')}} {{item.sellNum || 0}}</span>&nbsp;&nbsp;&nbsp;
                <span class="recommend">{{$t('seller.content.userRecommended')}} {{item.commentNum || 0}}</span>
              </div>
              <!--价格-->
              <p class="price">
                <span class="price_since">
                  <span>{{$t('seller.content.price')}}</span>
                  <span class="present-Price" v-if="item.isDiscount==1">{{item.presentPrice || 0}}P</span>
                  <span class="present-Price" v-if="item.isDiscount==0">{{item.originalPrice || 0}}P</span>
                  <span v-if="item.isSpecs && item.goodsSpecsList.length > 1" >{{$t('seller.content.since')}}</span>
                </span>
                <span class="origin-price" v-if="item.isDiscount==1&&!item.isSpecs">{{item.originalPrice}}P</span>
              </p>
              <!--数量操作-->
              <div class="change-num" :class="{has_num: getNumInCart(item.id)>0}" v-if="group.stock!=0" v-show="getBusFlag==1">
                <!-- <div ref="minus_btn" v-if="getNumInCart(item.id) == 0" class="minus" @click="removeFromCart(item)"></div> -->
                <span v-if="getNumInCart(item.id) != 0">{{getNumInCart(item.id)}}</span>
                <div v-if="((item.isSpecs==1) || item.goodsAttributeList) && (item.stock != '0')" class="plus" @click="openAlert(item)"></div>
                <div v-if="(item.stockGoods != '0') && (item.isSpecs == 0) && (!item.goodsAttributeList)" class="plus" @click="addToCart(item)"></div>
                <!-- <div v-if="item.isSpecs==0" class="plus" @click="add_to_cart_fn(item)"></div> -->
              </div>
              <div class="fly_box" v-if="item.stockGoods==0">{{$t('seller.hasNone')}}</div>
              <!-- <div class="fly_box" :class="{fly_box_move: getNumInCart(item.id)==1}"></div> -->
              <!--限购-->
              <div class="limit">
              <span v-show="item.isDiscount==1 && item.isSpecs==0">{{$t('seller.content.onlyBay')}} {{item.limitNum ||0}}{{$t('seller.content.count')}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
export default {
  name: "seller-goods",
  props: ["goodsLists", "loading"],
  components: {},
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters("order", ["getNumInCart"]),
    sellerId() {
      return this.$route.params.id;
    },
    ...mapState('seller', ['sellerInfo']),
    getBusFlag(){
      return this.sellerInfo.busFlag
    },
    urlList() {
      let arr = [];
      let { sellerId } = this;
      arr[0] = {
        url: `/seller/${sellerId}`,
        name: this.$t("seller.content.allGoods")
      };
      arr[1] = {
        url: `/seller/rate/${sellerId}`,
        name: this.$t("seller.content.sellerReviews")
      };
      arr[2] = {
        url: `/seller/info/${sellerId}`,
        name: this.$t("seller.content.Qualification")
      };
      return arr;
    }
  },
  mounted() {
  },
  methods: {
    ...mapActions("order", ["add_to_cart"]),
    ...mapMutations("order", ["clearCart", "addToCart", "removeFromCart"]),
    // async add_to_cart_fn(item) {
    //   console.log('item:::', item);
    //   let res = await this.add_to_cart({
    //     goodsCart: [{ "sellerId": item.sellerId, "goodsId": item.id, "goodsNumber": item.sellNum, "specsId": 0, "attributeId": '', "labelId": '' }],
    //     sellerId: item.sellerId,
    //     goodsId: item.id,
    //     goodsNumber: item.sellNum,
    //     originalNumber: '',
    //     specsId: 0,
    //     attributeId: '',
    //     labelId: ''
    //   })
    //   console.log('res:::', res);
    //   if (res.code === 1) {

    //   }
    // },
    showImageSwiper(imgList, index) {
      this.$imgView({
        list: imgList,
        index: index
      });
    },
    openAlert(data) {
      console.log(data);
      this.$emit("alertparent", data);
    }
  }
};
</script>
<style scoped lang="scss">
.seller-goods {
  width: 780px;
  .goods-class {
    margin-top: 20px;
    width: 780px;
    background: #fff;
    .header {
      height: 50px;
      border-bottom: 1px solid #ededed;
      a {
        display: inline-block;
        height: 48px;
        line-height: 48px;
        padding: 0 20px;
        margin: 0 20px;
        &.active,
        &:hover {
          color: $color-primary;
          border-bottom: 2px solid $color-primary;
        }
      }
    }
    .el-row {
      .class-list {
        a {
          display: block;
        }
      }
    }
    .class-list {
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 12px;
      cursor: pointer;
      &:hover {
        color: $color-primary;
      }
    }
  }
  .goods-list {
    width: 780px;
    min-height: 590px;
    .goods-group {
      margin-top: 20px;
      background: #fff;
      /* overflow: hidden; */
      .title {
        color: #666666;
        border-bottom: 1px solid #ededed;
        height: 50px;
        line-height: 50px;
        padding: 0 20px;
        font-weight: bold;
      }
      .fly_box {
        font-size: 12px;
        background: #e6e6e6;
        width: 4rem;
        text-align: center;
        border-radius: 8px;
        color: #999;
        position: absolute;
        top: 98px;
        right: 20px;
      }
      /* .fly_box {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          position: absolute;
          right: 40px;
          bottom: 15px;
          background: red;
          opacity: 0;
        }
        .fly_box_move {
          opacity: 1;
          right: -410px;
          bottom: -30px;
        } */
    }
    .product-list {
      padding-bottom: 20px;
      overflow: hidden;
    }
    .product {
      float: left;
      width: 360px;
      height: 130px;
      margin-top: 20px;
      margin-left: 20px;
      /* overflow: hidden; */
      background: #fcfcfc;
      border: 1px solid #ededed;
      position: relative;
      .white_mask {
        position: absolute;
        width: 360px;
        height: 130px;
        background: rgba(255, 255, 255, .5);
      }
      .avatar {
        width: 130px;
        height: 100%;
        display: block;
        float: left;
        cursor: zoom-in;
      }
      .content {
        float: left;
        position: relative;
        width: 228px;
        height: 130px;
        padding-left: 20px;
        padding-top: 15px;
        box-sizing: border-box;
        border:none;
        .name {
          @include text-over;
          font-weight: bold;
        }
        .data {
          font-size: 12px;
          color: #666666;
          margin-top: 10px;
            .sale {}
            .recommend {}
          }
        .limit {
          font-size: 12px;
          color: #ff644d;
          margin-top: 10px;
          /* overflow: hidden; */
        }
        .price {
          @include text-over;
          width: 140px;
          margin-top: 5px; // position: absolute;
          // top: 95px;
          .price_since {
            span {
              color: #999999;
              font-size: 12px;
            }
            .present-Price {
              font-size: 16px;
              color: #ff644d;
              font-weight: bold;
            }
          }

          .origin-price {
            font-size: 12px;
            color: #999999;
            margin-left: 5px;
            position: relative;
            &:before {
              content: "";
              position: absolute;
              top: 50%;
              left: 0;
              width: 100%;
              height: 1px;
              background: #999999;
            }
          }
        }
        .has_num {
          background: white;
          border-radius: 50%;
        }
        .change-num {
          position: absolute;
          top: 95px;
          right: 20px;
          box-sizing: border-box;
          border-top: 1px solid #e6e6e6;
          border-bottom: 1px solid #e6e6e6;
          height: 22px;
          border-radius: 11px;
          span {
            float: left;
            display: inline-block;
            color: #333;
            height: 20px;
            line-height: 20px;
            padding: 0 6px;
          }
          div {
            float: left;
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
            z-index: 99;
          }
          .minus {
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
      }
    }
  }
}
</style>