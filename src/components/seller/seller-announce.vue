<template>
  <div class="seller-announce">
    <div class="announce" v-if="parseInt(type) === 1">
      <div class="title">{{$t('seller.content.announcement')}}</div>
      <p>{{sellerInfo.notice || $t('seller.content.noAnnouncement')}}</p>
    </div>
    <div class="delivery" v-if="parseInt(type) === 1">
      <div class="title">{{$t('seller.content.distribution')}}</div>
      <ul>
        <li class="">{{$t('seller.header.charging1')}}: <span class="delivery_color">{{sellerInfo.limitDeliveryCost||0}}P</span></li>
        <li>{{$t('seller.content.distributionMode')}}: <span v-if="parseInt(sellerInfo.deliveryScheme)===1">{{$t('seller.content.loongDelivery')}}</span><span v-else>{{$t('seller.content.merchantDelivery')}}</span></li>
      </ul>
    </div>
    <div class="points" v-if="parseInt(type) === 2">
      <div class="title">{{$t('seller.content.score')}}</div>
      <div class="points-content">
        <div class="top">
          <div class="score">{{sellerInfo.orderScore || 0}}</div>
          <div class="count" style="display:flex;flex-flow:column;">
            <!-- <el-rate v-model="sellerInfo.orderScore" disabled-void-color="#C6D1DE" disabled :colors="['#FF644C', '#FF644C', '#FF644C']"></el-rate> -->
            <div class="rate_contain">
                <span class="rate_gray">
                  <img src="../../assets/icon/icon_star_gray.png" alt="">
                </span>
                <span class="rate_red" :style="{width:set_star(sellerInfo.orderScore) + '%'}">
                  <img src="../../assets/icon/icon_star_red.png" alt="">
                </span>
            </div>
            <span>{{$t('seller.header.inTotal')}} {{scoreList.orderCommentNum}} {{$t('seller.header.evaluate')}}</span>
          </div>
        </div>
        <!-- <ul>
          <li v-for="(item, index) in scoreList" :key="index">
            <div class="point">{{item.points}} 评分</div>
            <el-progress :percentage="item.percent" class="progress"></el-progress>
          </li>
        </ul> -->
      </div>
      <div class="points-content">
        <div class="title2">{{$t('seller.content.dispatchingScore')}}</div>
        <div class="orderCounnt">{{scoreList.deliveryScoreAvg}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "seller-announce",
  props: ["type", "orderCommentNum"],
  data() {
    return {
      scoreList: []
    };
  },
  computed: {
    ...mapState("seller", ["sellerInfo"]),
    sellerId() {
      return this.$route.params.id;
    }
  },
  mounted() {
    console.log("sellerNotoice", this.sellerInfo);
    this.getSellerPoints();
  },
  methods: {
    ...mapActions("seller", ["ajaxSellerPoints"]),
    async getSellerPoints() {
      let { sellerId } = this;
      let res = await this.ajaxSellerPoints({ sellerId });
      if (res.code === 1) {
        // res.data.forEach(item => {
        //   this.scoreList.push(item)
        // })
        this.scoreList = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    set_star(rate) {
      // 一个星星width: 15% 空格距离是 6.5%
      let count = (rate * 15).toFixed(2);
      console.log("rate", rate);
      let space = rate.toString()[0] * 6.5;
      // this.goods_star = Number(count) + space
      return Number(count) + space;
      // this.post_star = Number(count) + space
    },
  }
};
</script>

<style lang="scss">
.rate_contain {
            vertical-align: middle;
            display: inline-block;
            position: relative;
            width: 6rem;
            .rate_gray {
              display: inline-block;
              width: 100%;
              img {
                width: 6rem;
              }
            }
            .rate_red {
              position: absolute;
              top: 0;
              left: 0;
              display: inline-block;
              overflow: hidden;
              img {
                width: 6rem;
              }
            }
          }
.seller-announce {
  .title {
    color: #666666;
    border-bottom: 1px solid #ededed;
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    font-weight: bold;
  }
  @mixin panel {
    width: 380px;
    margin-top: 20px;
    background: #fff;
  }
  .announce {
    @include panel;
    p {
      padding: 10px;
      font-size: 12px;
      color: #666;
      max-height: 70px;
      overflow-y: auto;
    }
  }
  .delivery {
    @include panel;
    ul {
      padding: 10px;
      font-size: 12px;
      color: #666;
      max-height: 50px;
      overflow-y: auto;
      li {
        height: 22px;
        line-height: 22px;
      }
      .delivery_color {
        font-size: 16px;
        color: #ff644d;
      }
    }
  }
  .points {
    @include panel;
    .points-content {
      padding: 10px 20px 20px;
      border-bottom: 1px solid #ededed;
      .top {
        overflow: hidden;
        .score {
          float: left;
          font-size: 48px;
          color: $color-primary;
          font-weight: bold;
        }
        .count {
          float: left;
          margin-left: 20px;
          margin-top: 15px;
          span {
            color: #999999;
          }
        }
      }
      .title2 {
        color: #666666;
        height: 50px;
        line-height: 50px;
        font-weight: bold;
        display: inline-block;
      }
      .orderCounnt {
        display: inline-block;
        margin-left: 20px;
        color: #ff644d;
        font-weight: bold;
      }
      ul {
        li {
          overflow: hidden;
          margin-top: 10px;
        }
        .point {
          float: left;
          width: 15%;
        }
        .el-progress {
          float: left;
          width: 85%;
          /*.el-progress-bar__outer {*/
          /*height: 10px !important;*/
          /*}*/
        }
      }
    }
  }
}
</style>
