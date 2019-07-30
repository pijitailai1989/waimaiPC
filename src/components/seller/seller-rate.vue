<template>
  <div class="seller-rate">
    <!--链接-->
    <div class="header">
      <router-link :to="item.url" :class="{active : index === 1}" v-for="(item, index) in urlList" :key="index">
        {{item.name}}
      </router-link>
    </div>
    <!--评论列表-->
    <div class="list">
      <div class="evaluate" v-for="(item, index) in rateList" :key="index" :class="{last: index + 1 === rateList.length}">
        <!--用户头像-->
        <div class="avatar">
          <!-- <img v-lazy="item.profilePhotoPath || defaultAvatar" style="object-fit: cover"> -->
          <img :src="item.profilePhotoPath || defaultAvatar" style="object-fit: cover">
        </div>
        <div class="contents">
          <div class="top">
            <!--用户名称-->
            <div class="name">{{item.userName}}</div>
            <!--评分-->
            <el-rate v-model="item.orderScore" disabled-void-color="#C6D1DE" disabled :colors="['#FF644C', '#FF644C', '#FF644C']" show-score text-color="#666" :score-template="$t('place.score') + item.orderScore"></el-rate>
            <!--日期-->
            <div class="date">{{$formatDateTime(item.createTime,'ymd')}}</div>
          </div>
          <!--评论内容-->
          <p>{{item.userDesc}}</p>
          <!--评论照片-->
          <div class="photos">
            <el-row>
              <el-col :span="8" v-for="(photo, index) in item.photos" :key="index">
                <!-- <img v-lazy="photo" @click="showImageSwiper(item.photos, index)" style="object-fit: cover"> -->
                <img :src="photo" @click="showImageSwiper(item.photos, index)" style="object-fit: cover" :onerror="logoImg">
              </el-col>
            </el-row>
          </div>
          <p v-if="item.recommendGoodsName"><img src="../../assets/icon/recommend@2x.png" />{{$t('order.listHeader.commentGoods')}}: {{item.recommendGoodsName}}</p>
          <div class="replay" v-if="item.isReply!=0"><span class="red_replay">{{$t('order.listHeader.reply')}}: </span><span>{{item.reply}}</span></div>
        </div>
      </div>
      <common-no-data :message="$t('seller.header.noEval')" v-if="!loading && rateList.length === 0" />
      <common-loading v-if="loading" />
      <el-col :span="24" class="bottom-line" v-if="!loading && loadAll && rateList.length > 0">{{$t('place.downLine')}}</el-col>
    </div>
  </div>
</template>
<script>
import defaultAvatar from "../../assets/img/avatar-male.svg"
export default {
  name: "seller-rate",
  props: ['rateList', 'loading', 'loadAll'],
  components: {},
  data() {
    return {
      defaultAvatar,
      logoImg: 'this.src="' + require("../../assets/img/lazy_default.jpg") + '"',
    }
  },
  computed: {
    sellerId() {
      return this.$route.params.id
    },
    urlList() {
      let arr = []
      let { sellerId } = this
      arr[0] = { url: `/seller/${sellerId}`, name: this.$t('seller.content.allGoods') }
      arr[1] = { url: `/seller/rate/${sellerId}`, name: this.$t('seller.content.sellerReviews') }
      arr[2] = { url: `/seller/info/${sellerId}`, name: this.$t('seller.content.Qualification') }
      return arr
    }
  },
  mounted() {},
  methods: {
    showImageSwiper(imgList, index) {
      this.$imgView({
        list: imgList,
        index: index
      });
    },
  }
}

</script>
<style scoped lang="scss">
.seller-rate {
  /*min-height: 500px;*/
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
  .list {
    .bottom-line {
        position: relative;
    }
    .evaluate {
      overflow: hidden;
      padding: 30px 20px;
      border-bottom: 1px dashed #ededed;
      &.last {
        border-bottom: none;
      }
      .avatar {
        float: left;
        width: 60px;
        img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
        }
      }
      .contents {
        float: left;
        width: 680px;
        padding-left: 20px;
        .top {
          overflow: hidden;
          .name {
            float: left;
            font-weight: bold;
          }
          .el-rate {
            float: left;
            margin-left: 10px;
          }
          .date {
            float: right;
            font-size: 12px;
            color: #999999;
          }
        }
        p {
          margin-top: 5px;
          font-size: 12px;
          color: #999999;
        }
        .photos {
          .el-col {
            height: 0;
            padding-bottom: 120px;
            overflow: hidden;
            padding-top: 15px;
            img {
              width: 210px;
              height: 120px;
              cursor: zoom-in;
            }
          }
        }
        .replay {
          margin-top: 10px;
          .red_replay {
            color: #FF644C;
          }
        }
        p {
          margin-top: 5px;
          img {
            width: 20px;
            margin-right: 5px;
            margin-bottom: -3px;
          }
        }
      }
    }
  }
}

</style>
