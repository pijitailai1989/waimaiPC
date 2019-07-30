<template>
  <div>
    <!--头部-->
    <common-header/>
    <div class="my__collection__container clearfix">
      <div class="u-pc-sidebar">
        <!--侧边栏-->
        <side-bar pageId="8"></side-bar>
      </div>
      <div class="collection__wrapper u-pc-content">
        <div class="top__header">
          <h2>{{$t('sideBar.subNav.collection')}}</h2>
        </div>
        <common-loading v-if="loading" />
        <common-no-data :message="$t('order.detail.noCollect')" v-if="collectionList.length === 0 && !loading" />
        <div class="collection__list">
          <el-row>
            <el-col :span="8" v-for="(item, index) in collectionList" :key="index" :item="item">
              <div class="collection__list__wrapper">
                <router-link :to="item.link"><img :src="item.sellerLogoPath" class="shopImg"></router-link>
                <router-link :to="item.link">
                  <div class="shop__name">{{item.sellerName}}</div>
                </router-link>
                <div class="shop__rate">
                  <!-- <el-rate :colors="rateColor" class="u-inner-block" disabled-void-color="#C6D1DE" v-model="item.score" disabled></el-rate> -->
                  <div class="rate_contain">
                    <span class="rate_gray">
                      <img src="../../assets/icon/icon_star_gray.png" alt="">
                    </span>
                    <span class="rate_red" :style="{width:set_star(item.score) + '%'}">
                      <img src="../../assets/icon/icon_star_red.png" alt="">
                    </span>
                  </div>
                  <span class="raty__num">{{item.score}} 分</span>
                </div>
                <p class="num__list">{{$t('collection.price')}}: {{item.limitDeliveryCost}}P | {{$t('collection.sale')}}: {{item.monthSel || 0}}{{$t('place.single')}}</p>
                <div class="top__del" @click="item.deleteShow=true">
                  <i class="iconfont icon-shanchuicon1"></i>
                </div>
                <div class="delete__btn__wrapper" v-if="item.deleteShow">
                  <div class="u-middle">
                    <p>{{$t('collection.cancel')}}</p>
                    <el-button round size="mini" @click="item.deleteShow=false">{{$t('common.cancel')}}</el-button>
                    <el-button type="primary" round size="mini" @click="deleteCollection(item.id)" :loading="changeLoading">{{$t('common.delete')}}</el-button>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          <div class="u-pagination" v-if="parseInt(totalPage)>10">
            <el-pagination layout="prev, pager, next" :total="totalPage" :current-page="currentPage" @current-change="changePage"></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <common-footer/>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import SideBar from "../../components/user/side-bar";
export default {
  data() {
    return {
      rateColor: ['#FF644C', '#FF644C', '#FF644C'],
      collectionList: [],
      showCount: 10,
      currentPage: 1,
      totalPage: 0,
      pos: [],
      loading: true,
      changeLoading: false
    }
  },
  components: { SideBar },
  computed: {

  },
  async mounted() {
    this.initData()
    window.scroll(0, 0)
  },
  methods: {
    ...mapActions('user', ['ajaxCollectList', 'ajaxCollect']),
    async initData() {
      let self = this;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          let pos = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          self.pos = pos;
          self.getCollectionList();
        }, function() {
          console.log('定位服务失败！')
          let pos = {
            lat: 22.649289,
            lon: 114.049252
          };
          self.pos = pos;
          self.getCollectionList()
        });
      } else {
        self.$message.error(self.$t('home.wrong'));
      }
    },
    async getCollectionList() {
      let self = this;
      let { showCount, currentPage } = self;
      self.collectionList = [];
      self.loading = true;
      let res = await self.ajaxCollectList({ showCount, currentPage, lat: self.pos.lat, lon: self.pos.lon });
      if (self.$checkData(res)) {
        console.log('收藏列表', res)
        self.totalPage = res.data.totalPages * 10;
        res.data.sellerList.forEach(item => {
          item.deleteShow = false;
          item.score = parseInt(item.score);
          item.link = '/seller/' + item.id;
          self.collectionList.push(item)
        })
      }
      self.loading = false;
    },
    async deleteCollection(id) {
      let self = this;
      if (self.changeLoading) {
        return false;
      }
      self.changeLoading = true;
      let res = await self.ajaxCollect({ sellerIds: id });
      self.changeLoading = false;
      if (self.$checkData(res)) {
        self.getCollectionList();
        self.$message.success(res.message);
      }
    },
    changePage(page) {
      this.currentPage = page
      this.getCollectionList()
      window.scrollTo(0, 0)
    },
    set_star(rate) {
      // 一个星星width: 15% 空格距离是 6.5%
      let count = (rate * 15).toFixed(2);
      console.log("rate", rate);
      let space = rate.toString()[0] * 5.7;
      // this.goods_star = Number(count) + space
      return Number(count) + space;
      // this.post_star = Number(count) + space
    },
  }
}

</script>
<style scope lang="scss">
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
.my__collection__container {
  @include container;
  margin-top: 20px;
  .collection__wrapper {
    .collection__list {
      padding: 10px;
      .el-col {
        padding: 10px;
      }
      .collection__list__wrapper {
        border: 1px solid $bd-gray;
        &:hover {
          .top__del {
            display: block;
          }
        }
        img.shopImg {
          width: 100%;
          height: 150px;
          cursor: pointer;
        }
        .shop__name {
          margin: 10px 0 10px 0;
          color: $imp-color;
          text-align: center;
          font-weight: 600;
        }
        .shop__rate {
          text-align: center;
          margin-bottom: 10px;
          .raty__num {
            color: #888;
            font-size: 12px;
            position: relative;
            top: 2px;
          }
        }
        .num__list {
          text-align: center;
          font-size: 12px;
          color: #666;
          margin-bottom: 20px;
        }
        .delete__btn__wrapper {
          text-align: center;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          overflow: hidden;
          background: rgba(51, 51, 51, 0.70);
          p {
            margin-bottom: 15px;
            color: #fff;
          }
        }
        .top__del {
          display: none;
          position: absolute;
          top: 0px;
          right: 0px;
          background: #FF644C;
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          cursor: pointer;
          background: rgba(51, 51, 51, 0.50);
          &:hover {
            background: $color-primary;
          }
          i {
            color: #fff;
            font-size: 14px;
          }
        }
      }
    }
  }
}

</style>
