<template>
  <div class="search">
    <common-header ref="header" @search="initSearch"/>
    <div class="main">
      <div class="top">{{$t('search.result')}}</div>
      <!--列表-->
      <div class="list" v-for="item in resultList" :key="item.id">
        <div class="seller" @click="toSeller(item)">
          <img :src="item.sellerLogoPath" class="logo">
          <div class="name">{{item.sellerName}}</div>
          <!-- <el-rate v-model="item.orderScore" disabled-void-color="#C6D1DE" disabled show-score :colors="['#FF644C', '#FF644C', '#FF644C']"
                   text-color="#FF644C" score-template="{value}"/> -->
          <div class="rate_contain" style="margin-left:10px;">
                <span class="rate_gray">
                  <img src="../assets/icon/icon_star_gray.png" alt="">
                </span>
                <span class="rate_red" :style="{width:set_star(item.orderScore) + '%'}">
                  <img src="../assets/icon/icon_star_red.png" alt="">
                </span>
          </div>
          <p class="info">
            <span>{{$t('place.distance')}}{{item.km}}km</span>|
            <span>{{$t('place.sales')}}{{item.monthSel || 0}}{{$t('place.single')}}</span>
          </p>
        </div>
        <div class="goods-list" v-for="goods in item.goodList" :key="goods.id">
          <div class="name">{{goods.goodsName}}</div>
          <div class="price">{{goods.presentPrice || goods.originalPrice}}P</div>
          <div class="info">
            <span><i class="iconfont icon-icon_Salesvolume"/>{{$t('search.sell')}}{{goods.sellNum || 0}}</span>
            <span><i class="iconfont icon-icon_recommend"/>{{$t('search.recommon')}}{{goods.commentNum || 0}}</span>
          </div>
          <div>
            <el-button v-show="item.busFlag==1" type="primary" plain @click="toSeller(item)">{{$t('search.buy')}}</el-button>
          </div>
        </div>
      </div>
      <!--状态-->
      <common-loading v-if="loading"/>
      <common-no-data type="shop" :message="$t('search.nofind')" v-if="!loading && resultList.length===0"/>
    </div>
    <common-footer/>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'

  export default {
    name: "search",
    components: {},
    data() {
      return {
        resultList: [],
        loading: false,
        lastKeyword: '',
        location: null,
        currentPage:1,
        showCount:20,
      }
    },
    computed: {
      keyword() {
        return this.$refs.header.keyword
      }
    },
    mounted() {
      let location = localStorage.getItem('location')
      if (!location) {
        this.$message.error(this.$t('search.address'))
        this.$router.push('/')
      } else {
        this.location = JSON.parse(location)
        this.initSearch()
      }
    },
    methods: {
      ...mapActions('seller', ['ajaxSearch','ajaxSellerList']),
      async getSearchResult() {
        this.loading = true
        let {lat, lon} = this.location
        let {currentPage,showCount,keyword} = this
        let res = await this.ajaxSellerList({keyWord: keyword, lat, lon,currentPage,showCount })
        console.log('搜索结果', res)
        if (res.code === 1) {
          if(keyword){
              if (res.data.sellerList) {
                res.data.sellerList.forEach(item => {
                  // item.score = parseFloat(item.score)
                  this.resultList.push(item)
                })
              }
          }
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      },
      async initSearch() {
        let {keyword, lastKeyword} = this
        if (keyword === lastKeyword) return
        this.resultList = []
        await this.getSearchResult()
        // console.log(keyword,'keyword')
        this.lastKeyword = keyword
      },
      toSeller(item) {
        this.$router.push(`/seller/${item.id}`)
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
  }
</script>

<style scoped lang="scss">
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
  .search {
    .main {
      @include container;
      min-height: 800px;
      background: #fff;
      margin-top: 20px;
      .top {
        color: #666666;
        padding: 20px;
        border-bottom: 1px solid #DDDDDD;
      }
      .list {
        padding: 20px;
      }
      .seller {
        height: 100px;
        background: #FCFCFC;
        border: 1px solid #EBEBEB;
        cursor: pointer;
        .logo {
          height: 98px;
          width: 180px;
          float: left;
        }
        @mixin distance {
          padding-left: 190px;
          height: 20px;
          line-height: 20px;
        }
        .name {
          @include distance;
          margin-top: 15px;
          font-size: 16px;
          color: #333333;
          font-weight: bold;
        }
        .el-rate {
          @include distance;
          margin-top: 5px;
          i {
            font-size: 16px;
          }
        }
        p.info {
          @include distance;
          margin-top: 5px;
          font-size: 12px;
          color: #666666;
          span:first-child {
            padding-right: 5px;
          }
          span:last-child {
            padding-left: 5px;
          }
        }
      }
      .goods-list {
        border: 1px solid #EBEBEB;
        border-top: none;
        overflow: hidden;
        padding: 0 20px;
        div {
          float: left;
          height: 60px;
          line-height: 60px;
          width: 25%;
          &.name {
            color: #333333;
          }
          &.info {
            color: #666666;
            span {
              font-size: 12px;
              &:first-child {
                margin-right: 30px;
              }
            }
            i {
              margin-right: 10px;
            }
          }
          .el-button {
            float: right;
            margin-top: 10px;
          }
        }
      }
    }
  }
</style>
