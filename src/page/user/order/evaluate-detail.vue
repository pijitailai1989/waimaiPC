<template>
  <div>
    <!--头部-->
    <common-header/>
    <div class="evaluate__detail__container u-detail-box ">
      <div class="clearfix c-detail-header">
        <h2 class="title">{{$t('order.detail.evalDetail')}}</h2>
        <a href="javascript:;" class="back" @click="goBack">{{$t('common.back')}}<i class="iconfont icon-enter"></i></a>
      </div>
      <div class="evaluate__detail__wrapper">
        <common-loading v-if="loading" />
        <common-no-data type="order" :message="$t('common.noOrder')" v-if="noOrder" />
        <div class="detail__wrapper" v-if="!noOrder">
          <div class="shop__info">
            <el-row>
              <el-col :span="24">
                <router-link :to="link"><img :src="commentInfo.seller_logo"></router-link>
                <div class="info__detail">
                  <div class="u-middle">
                    <router-link :to="link">
                      <h2>{{commentInfo.seller_name}}</h2></router-link>
                    <div class="clearfix">
                      <div class="u-float-l u-pd-r-20 clearfix">
                        <i class="iconfont icon-location"></i>
                        <el-tooltip placement="top">
                          <div slot="content">{{commentInfo.location}}</div>
                          <span>{{commentInfo.location}}</span>
                        </el-tooltip>
                      </div>
                      <div class="u-float-r evaluate__time">
                        <p>{{$t('order.detail.evalTime')}}:<span><template v-if="commentInfo.time!=null">{{$formatDateTime(commentInfo.time)}}</template></span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="evaluate__list">
            <el-form label-width="150px" class="c-form" label-position="left">
              <!-- <el-form-item :label="$t('order.detail.label.sellerRaty')">
                <el-rate show-text class="u-inner-block" disabled :colors="rateColor" v-model="commentInfo.orderScore"></el-rate>
              </el-form-item> -->
              <el-form-item :label="$t('order.detail.label.sellerRaty')">
                <el-rate show-score class="u-inner-block" disabled disabled-void-color="#C6D1DE" :colors="rateColor" v-model="commentInfo.order_score"></el-rate>
              </el-form-item>
              <el-form-item :label="$t('order.detail.label.deliRaty')">
                <el-rate show-score class="u-inner-block" disabled disabled-void-color="#C6D1DE" :colors="rateColor" v-model="commentInfo.delivery_score"></el-rate>
              </el-form-item>
              <el-form-item :label="$t('order.detail.evalDetail')" class="evaluate__textarea">
                <el-input type="textarea" cols="3" v-model="commentInfo.user_desc" readonly resize="none"></el-input>
              </el-form-item>
              <el-form-item :label="$t('order.detail.recomendGoods')">
                {{goodsName}}
              </el-form-item>
              <el-form-item :label="$t('order.detail.evalImgShow')" v-if="imgList.length!=0">
                <div class="img__container">
                  <div class="img__btn btn__prev">
                    <i class="iconfont icon-return"></i>
                  </div>
                  <div class="img__btn btn__next">
                    <i class="iconfont icon-enter"></i>
                  </div>
                  <div class="img__wrapper swiper-container" id="evaluate__swiper">
                    <div class="swiper-wrapper ">
                      <div class="swiper-slide" v-for="(item, index) in imgList" :key="index" :item="item">
                        <img :src="item" @click="showImageSwiper(imgList,index)" :onerror="defaultImg">
                      </div>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <common-footer v-show="isLoading"/>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import $ from "jquery";
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
export default {
  data() {
    return {
      rateColor: ["#FF644C", "#FF644C", "#FF644C"],
      imgList: [],
      commentInfo: {},
      loading: true,
      noOrder: false,
      isLoading: false,
      currentPage: "1",
      showCount: "8",
      link: "",
      goodsName: "",
      defaultImg: `this.src="${require("../../../assets/img/lazy_default.jpg")}"`
    };
  },
  computed: {
    // link() {
    //   return '/seller/' + this.commentList.sellerId;
    // },
    orderId() {
      return this.$route.params.id;
    }
  },
  async mounted() {
    setTimeout(() => {
      this.isLoading = true;
    }, 300);
    this.loading = true;
    await this.getComment();
    await this.initData();
    this.loading = false;
    if (!this.noOrder) {
      $(".detail__wrapper").show();
      if (this.imgList.length != 0) {
        this.initSwiper();
      }
    }
  },
  methods: {
    ...mapActions("order", ["ajaxEvaluateDetail", "ajaxOrderDetail"]),
    async initData() {
      let self = this;
      // this.link = `/seller/${sellerId}`
      let orderId = self.orderId;
      let res = await self.ajaxEvaluateDetail({ orderId: orderId });
      console.log("评论详情", res);
      if (self.$checkData(res)) {
        if (res.code === 9004) {
          self.noOrder = true;
          return false;
        }
        self.commentInfo = res.data;
        self.goodsName = self.commentInfo.goodsName.replace(/,/g, ", ");
        if (self.commentInfo.picture) {
          self.imgList = self.commentInfo.picture.split(",");
          console.log("2225885", self.imgList);
        } else {
          self.imgList = [];
        }
        // if (self.$checkData(orderRes)) {
        //   self.commentInfo = res.data.comment;
        //   // console.log('commentInfo',self.commentInfo)
        //   self.orderInfo = orderRes.data.orderAndSeller;
        //   if (self.commentInfo.picture != null) {
        //     self.imgList = self.commentInfo.picture.split(",");
        //   } else {
        //     self.imgList = [];
        //   }

        // }
      }
    },
    async getComment() {
      let { currentPage, showCount } = this;
      let res = await this.ajaxOrderDetail({ orderId: this.orderId });
      if (res.code === 1) {
        console.log(res);
        this.link = `/seller/${res.data.seller_id}`;
      }
    },
    initSwiper() {
      let evalSwiper = new Swiper("#evaluate__swiper", {
        slidesPerView: 5,
        spaceBetween: 10,
        navigation: {
          nextEl: ".btn__next",
          prevEl: ".btn__prev"
        }
      });
    },
    showImageSwiper(imgList, index) {
      this.$imgView({
        list: imgList,
        index: index
      });
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style scope lang="scss">
.evaluate__detail__container {
  @include container;
  margin-top: 20px;
  background: #fff;
  .evaluate__detail__wrapper {
    padding: 40px 100px;
    border: 1px solid $bd-gray;
    .detail__wrapper {
      display: none;
    }
    .shop__info {
      padding-bottom: 40px;
      margin-bottom: 40px;
      border-bottom: 1px solid $bd-gray;
      .info__detail {
        height: 90px;
        overflow: hidden;
        padding-right: 20px;
        .u-float-l {
          width: 60%;
          i {
            position: relative;
            top: -1px;
            float: left;
            margin-right: 10px;
            font-size: 20px;
          }
          span {
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: default;
            overflow: hidden;
            color: $imp-color;
            width: 90%;
            float: left;
          }
        }
        .u-float-r {
          width: 40%;
        }
        .evaluate__time {
          p {
            text-align: right;
          }
          span {
            color: $imp-color;
            margin-left: 10px;
          }
        }
      }
      .el-col {
        height: 90px;
      }
      img {
        width: 130px;
        height: 90px;
        float: left;
        margin-right: 30px;
      }
      h2 {
        font-size: 18px;
        margin-bottom: 25px;
      }
      .location {
        i {
          font-size: 20px;
          float: left;
          margin-right: 10px;
        }
        span {
          overflow: hidden;
          color: $imp-color;
        }
      }
    }
    .evaluate__list {
      .el-form-item__content {
        padding-left: 20px;
        .el-rate {
          top: -3px;
        }
        textarea {
          border: 1px solid #dcdfe6;
          height: 150px;
          background: $bg-gray--light;
          padding: 20px;
        }
        .img__container {
          .img__btn {
            position: absolute;
            width: 33px;
            height: 60px;
            background: #f5f5f5;
            border-radius: 4px;
            cursor: pointer;
            top: 50%;
            transform: translateY(-50%);
            text-align: center;
            line-height: 60px;
            &.btn__next {
              right: 0;
            }
            i {
              font-size: 28px;
            }
            &.swiper-button-disabled {
              i {
                color: #ccc;
              }
            }
          }
          .img__wrapper {
            width: 590px;
            .swiper-slide {
              height: 90px;
              img {
                width: 100%;
                height: 100%;
                cursor: zoom-in;
              }
            }
          }
        }
      }
    }
  }
}
</style>
