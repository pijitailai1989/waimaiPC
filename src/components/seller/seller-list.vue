<template>
  <div class="seller-list">
    <!--排序方式-->
    <div class="sort-type">
      <ul>
        <li class="sortType_btn" v-for="(item, index) in sortList" :key="index" :class="{active : chooseSort === item.sortType}" @click="changeSort(item)">{{item.sortTypeName}}</li>
      </ul>
      <span class="right">{{$t('place.heigherFaster')}}</span>
    </div>
    <!-- 定位失败 -->
    <div class="location_fail" v-if="no_location">
      <div>
        <img src="../../assets/img/null-shop.png" />
      </div>
      <div>
        {{this.$t('home.location_fail')}}
      </div>
    </div>
    <!--商家列表-->
    <el-row class="list" v-if="!no_location">
      <el-col :span="6" class="seller" v-for="(item, index) in sellerLists" :key="index">
        <div class="seller-content" :class="(index + 1) % 4 === 0 ? 'left': 'right'" @click="toSeller(item)">
          <div class="header">
            <!-- <img v-lazy="item.sellerLogoPath" style="object-fit: cover"> -->
            <img :src="item.sellerLogoPath" style="object-fit: cover">
            <div class="price-data">
              <!-- <span>{{$t('place.dispatching')}}:{{item.logistics || 0}}P</span> -->
              <span>{{$t('place.charging')}}:{{item.limitDeliveryCost}}P</span>
            </div>
          </div>
          <div class="seller-name">{{item.sellerName}}</div>
          <div class="seller-score">

            <div class="rate_contain">
              <span class="rate_gray">
                <img src="../../assets/icon/icon_star_gray.png" alt="">
              </span>
              <span class="rate_red" :style="{width:set_star(item.orderScore) + '%'}">
                <img src="../../assets/icon/icon_star_red.png" alt="">
              </span>
            </div>
            <!-- <el-rate v-model="item.orderScore" disabled disabled-void-color="#C6D1DE" show-score :colors="['#FF644C', '#FF644C', '#FF644C']"
              text-color="#666" /> -->
          </div>
          <div class="seller-info">
            <span>{{$t('place.distance')}}{{item.km}}km</span>
            <span>{{$t('place.sales')}}{{item.monthSel || 0}}{{$t('place.single')}}</span>
          </div>
        </div>
        <div class="hidden-card" :class="(index + 1) % 4 === 0 ? 'left': 'right'">
          <div class="card-content">
            <div class="top">
              <div class="name">{{item.sellerName}}</div>
              <div class="card-data">
                <!-- <span>{{$t('place.dispatching')}}: {{item.logistics || 0}}P</span> -->
                <span>{{$t('place.charging')}}: {{item.limitDeliveryCost || 0}}P</span>
              </div>
            </div>
            <!-- 新增 优惠 -->
            <div class="coupon" v-for="subitem in item.activityList" :key="subitem.id">
              <div v-if="subitem.control_type === 3">{{$t('place.discount')}} {{subitem.pay_discount / 100}}{{$t('place.dis')}} {{$t('place.more')}}{{subitem.maximum_discount}}</div>
              <div v-if="subitem.control_type === 2">{{$t('place.fullSub')}} {{$t('place.full')}}{{subitem.limitcontent}}-{{subitem.discount_amount}}</div>
              <!-- <div>商家满减 满50-15</div> -->
              <!-- <div>招牌炒饭 9.9p</div> -->
            </div>
            <div class="announce">
              <div class="title">{{$t('place.announcement')}}</div>
              <p>{{item.notice || $t('place.noAnnouncement')}}</p>
            </div>
          </div>
        </div>
      </el-col>
      <common-no-data type="shop" :message="$t('place.noFind')" v-if="!loading && sellerLists.length === 0" />
      <common-loading v-if="loading" />
      <el-col :span="24" class="bottom-line" v-if="!loading && loadAll && sellerLists.length > 0">{{$t('place.downLine')}}</el-col>
    </el-row>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  export default {
    name: "seller-list",
    props: ['sellerLists', 'loading', 'loadAll'],
    data() {
      return {
        sortType: null,
        sortList: [{ sortType: '5', sortTypeName: this.$t('place.defaultSort') }, { sortType: '1', sortTypeName: this.$t('place.highestSales') }, { sortType: '0', sortTypeName: this.$t('place.shortestDistance') }, { sortType: '2', sortTypeName: this.$t('place.highestScore') }],
        chooseSort: '5',
        lon: 114.046971,
        lat: 22.650556,
        no_location: false
      }
    },
    computed: {
      ...mapState('seller', ['sellerInfo']),
    },
    mounted() {
    },
    methods: {
      ...mapActions('seller', ['ajaxSellerSort']),
      changeSort(item, index) {
        this.chooseSort = item.sortType
        this.$emit('changeSort', item)
      },
      toSeller(item) {
        window.scrollTo(0, 0)
        this.$router.push(`/seller/${item.id}`)
      },
      set_star(rate) {
        // 一个星星width: 15% 空格距离是 6.5%
        let count = (rate * 15).toFixed(2);
        let space = rate.toString()[0] * 6.5;
        // this.goods_star = Number(count) + space
        return Number(count) + space;
        // this.post_star = Number(count) + space
      }
    },
    async created() {
      // console.log('sellerLists:::' + JSON.stringify(this.sellerLists.orderScore));
      for (var i = 0; i < this.sellerLists.length; i++) {
        console.log(this.sellerLists[i].orderScore);
      }
      let { pageSize, currentPage, lat, lon, sortType } = this
      // let {lat, lon, areaId} = this.location
      let res = await this.ajaxSellerSort({ lat, lon })
      console.log('sellerSort', res)
      if (res.code === 1) {
        // res.data.waimai_sort.forEach(item => {
        //   this.sortType.push({name:item.lookup_item_name,type:item.lookup_item_code})
        // });
      } else {
        this.$message.error(res.message)
      }
      console.log('sortType', this.sortType)


      let current_location = localStorage.getItem('current_location');
      console.log(current_location);
      if (current_location == null) {
        this.no_location = true;
      } else {
        this.no_location = false;
      }
    }
  }
</script>

<style scoped lang="scss">
  .seller-list {

    .location_fail {
      width: 100%;
      height: 60vh;
      div {
        width: 100%;
        text-align: center;
      }
      div:first-child {
        height: 30vh;
        img {
          height: 100%;
        }
      }
      div:last-child {
        font-size: 18px;
      }
    }
    @include container;
    margin-top: 20px;
    .sort-type {
      background: #FAFAFA;
      border: 1px solid #DDDDDD;
      box-sizing: border-box;
      overflow: hidden;
      height: 60px;
      line-height: 60px;
      color: #999999;
      ul {
        float: left;
        overflow: hidden;
        margin-left: 10px;
        li {
          float: left;
          margin: 0 30px;
          position: relative;
          height: 58px;
          box-sizing: border-box;
          cursor: pointer;
          // span {
          //   display: inline-block;
          //   height: 58px;
          //   box-sizing: border-box;
          // }
          &:not(:first-child):before {
            content: '';
            width: 1px;
            height: 10px;
            background: #DDDDDD;
            position: absolute;
            left: -30px;
            top: 25px;
          }
          &:hover,
          &.active {
            color: $color-primary;
            border-bottom: 2px solid $color-primary;
            span {
              border-bottom: 2px solid $color-primary;
            }
          }
        }
      }
      span.right {
        float: right;
        margin-right: 20px;
      }
    }
    .list {
      min-height: 500px;
      background: #fff;
      box-sizing: border-box;
      border: 1px solid #DDDDDD;
      border-top: none;
      overflow: hidden;
      padding: 20px 30px 80px;
      position: relative;
      .seller {
        height: 275px; // height: 325px;
        margin-top: 10px;
        border: 1px solid #fff;
        .seller-content {
          border: 1px solid #fff;
          padding: 15px 15px;
          cursor: pointer;
          &.right {
            border-right: none;
          }
          &.left {
            border-left: none;
          }
        }
        .seller-content:hover {
          border-color: #DDDDDD;
          box-shadow: 1px 0 8px 2px #e4e4e436;
          +.hidden-card {
            display: block;
            box-shadow: 1px 0 8px 2px #e4e4e436;
          }
        }
        .header {
          height: 154px;
          overflow: hidden;
          position: relative;
          img {
            width: 100%;
            height: 154px;
          }
          .price-data {
            width: 100%;
            height: 30px;
            line-height: 30px;
            background: rgba(0, 0, 0, .4);
            color: #fff;
            position: absolute;
            bottom: 0;
            text-align: center;
            font-size: 12px;
            span:first-child {
              position: relative;
              padding-right: 10px; // &:after {
              //   content: '';
              //   width: 4px;
              //   height: 4px;
              //   background: #fff;
              //   border-radius: 50%;
              //   position: absolute;
              //   top: 6px;
              //   right: 0;
              //   margin-right: -3px;
              // }
            }
            span:last-child {
              padding-left: 7px;
            }
          }
        }
        .seller-name {
          margin-top: 10px;
          font-size: 15px;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .seller-score {
          margin-top: 10px;
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
        }
        .seller-info {
          margin-top: 10px;
          color: #666;
          font-size: 12px;
          span:first-child {
            padding-right: 10px;
            /*border-right: 1px solid #666666;*/
            position: relative;
            &:after {
              content: '';
              position: absolute;
              right: 0;
              top: 2px;
              height: 12px;
              width: 1px;
              background-color: #666;
            }
          }
          span:last-child {
            padding-left: 10px;
          }
        }
        .hidden-card {
          display: none;
          width: 100%;
          height: 273px;
          position: absolute;
          top: 0;
          z-index: 1;
          background: #fff;
          border: 1px solid #ddd;
          box-sizing: border-box;
          &.right {
            right: 0;
            transform: translateX(100%);
            .card-content:before {
              left: 0;
              transform: translateX(-50%) rotate(-45deg);
              border-left: 1px solid #ddd;
            }
          }
          &.left {
            left: 0;
            transform: translateX(-100%);
            .card-content:before {
              right: 0;
              transform: translateX(50%) rotate(45deg);
              border-right: 1px solid #ddd;
            }
          }
          .card-content {
            position: relative; // width: 100px;
            height: 100%;
            padding: 20px;
            &:before {
              content: '';
              width: 15px;
              height: 15px;
              z-index: 2;
              background: #fff;
              position: absolute;
              top: 30px;
              border-top: 1px solid #ddd;
            }
          }
          .top {
            padding-bottom: 20px;
            border-bottom: 1px dashed #ddd;
            .name {
              color: #333333;
              font-size: 16px;
              font-weight: bold;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .card-data {
              margin-top: 10px;
              font-size: 12px;
              color: #666666; // span:first-child {
              //   position: relative;
              //   padding-right: 10px;
              //   &:after {
              //     content: '';
              //     width: 4px;
              //     height: 4px;
              //     background: #666666;
              //     border-radius: 50%;
              //     position: absolute;
              //     top: 6px;
              //     right: 0;
              //     margin-right: -3px;
              //   }
              // }
              // span:last-child {
              //   padding-left: 7px;
              // }
            }
          }
          .announce {
            padding: 20px 0;
            .title {
              color: #333333;
              font-weight: bold;
            }
            p {
              margin-top: 10px;
              font-size: 12px;
              color: #666666;
              display: -webkit-box;
              /* autoprefixer: off*/
              -webkit-box-orient: vertical;
              /* autoprefixer: on*/
              -webkit-line-clamp: 6;
              overflow: hidden;
            }
          }
        }
      }
    }
  }
</style>