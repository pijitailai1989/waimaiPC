<template>
  <div class="goods-list">
    <div class="title">{{$t('payMent.confirmOrder')}}</div>
    <ul class="top">
      <li>{{$t('order.detail.listHeader.food')}}</li>
      <li>{{$t('order.detail.listHeader.num')}}</li>
      <li class="price">{{$t('order.detail.listHeader.price')}}</li>
      <!-- <li>{{$t('order.detail.listHeader.num')}}</li> -->
      <!-- <li>{{$t('order.detail.listHeader.amount')}}</li> -->
    </ul>
    <div class="list">
      <ul v-for="(item, index) in goodsList" :key="index">
        <li>
          <img :src="item.data.goodsPhotoPath">
          <div>
            <span class="list_div" :class="{responsive: item.data.limitNum !== null}">
              <p :class="{has_guige: item.data.goodsSpecs || item.data.goodsAttributeLabel}">{{item.data.goodsName}}</p>
              <p :class="{has_guige: item.data.goodsSpecs || item.data.goodsAttributeLabel}">
                <span v-if="item.data.goodsSpecs">{{item.data.goodsSpecs}}</span>
                <span v-if="item.data.goodsSpecs && item.data.goodsAttributeLabel">/</span>
                <span v-if="item.data.goodsAttributeLabel">{{item.data.goodsAttributeLabel}}</span>
              </p>
            </span>
            <span class="list_div" v-if="item.data.limitNum" :class="{responsive: item.data.limitNum !== null}">
              <!-- 限{{item.data.limitNum}}件优惠 -->
            </span>
          </div>
        </li>
        <li>{{item.num}}</li>
        <li class="price">

          <!-- <span v-if="item.data.presentPrice" :class="{responsive: item.data.limitNum !== null}">
            {{item.data.presentPrice}}P
          </span>
          <span v-else :class="{responsive: item.data.limitNum !== null}">
            {{item.data.originalPrice}}P
          </span> -->

          <!-- <span v-show="item.data.isDiscount==1">
            {{item.data.presentPrice}}P
          </span>
          <span v-show="item.data.isDiscount==1" style="text-decoration:line-through; color: #999999;">
            {{item.data.originalPrice}}P
          </span>
          <span v-show="item.data.isDiscount==0" style="height:100%;">
            {{item.data.originalPrice}}P
          </span> -->
          <!-- Math.round((that.money2 - that.originalPrice) * 100) / 100; -->
          <span v-if="item.data.isDiscount==1">
            {{item.price}}P
          </span>
          <span v-if="item.data.isDiscount==1&&item.price!=Math.round((item.data.originalPrice*item.num) * 100) / 100" style="text-decoration:line-through; color: #999999;">
            {{Math.round((item.data.originalPrice*item.num) * 100) / 100}}P
          </span>
          <span v-if="item.data.isDiscount==0" style="height:100%;">
            {{item.price}}P
          </span>

        </li>
        <!-- <li>{{item.num}}</li> -->
        <!-- <li>{{item.price}}P</li> -->
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "goods-list",
    props: ['goodsList'],
    data() {
      return {}
    },
    computed: {
      // console.log()
    },
  }
</script>

<style scoped lang="scss">
  .goods-list {
    margin-top: 30px;
    .title {
      margin-top: 30px;
    }
    .top {
      margin-top: 30px;
      background: #F5F5F5;
      overflow: hidden;
      height: 50px;
      line-height: 50px;
      border: 1px solid #EBEBEB;
      li {
        float: left;
        width: 10%;
        box-sizing: border-box;
        text-align: center;
        &:first-child {
          width: 80%;
          padding-left: 30px;
          text-align: left;
        }
        &.prices {
          text-align: left;
        }
        &:last-child {
          text-align: right;
          padding-right: 40px;
        }
      }
    }
    .list {
      ul {
        overflow: hidden;
        border-left: 1px solid #EBEBEB;
        border-right: 1px solid #EBEBEB;
        &:nth-child(2n) {
          background: #FAFAFA;
        }
        li {
          float: left;
          height: 80px;
          line-height: 80px;
          width: 10%;
          box-sizing: border-box;
          text-align: center;
          border-bottom: 1px solid #EBEBEB;
          &:last-child{
            display: flex;
            flex-flow:column;
            justify-content: center;
          }
          &:first-child {
            
            padding-left: 30px;
            width:80%;
            overflow: hidden;
            text-align: left;
            img {
              width: 50px;
              height: 50px;
              float: left;
              margin-top: 15px;
            }
            div {
              float: left;
              margin-left: 20px;
              margin-top: 15px;
              .list_div {
                display: block;
                height: 50px;
                line-height: 50px;
                color: #999999;
                &:first-child {
                  color: #333333;
                  font-weight: bold;
                }
                &.responsive {
                  /* height: 25px;
                  line-height: 25px; */
                }
                .has_guige {
                  height: 25px;
                  line-height: 25px;
                  span {
                    color: #999999;
                  }
                }
              }
            }
          }
          &.price {
            // padding-top: 15px;
            text-align: left;
            span {
              display: block;
              width: 100%;
              height: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }
      }
    }
  }
</style>