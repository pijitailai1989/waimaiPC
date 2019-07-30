<template>

  <div class="alertDiv">
    <ul>
      <li>
        <i>
          <img :src="goodsData.goodsPhotoPath" />
        </i>
        <div class="box">
          <p class="name">{{goodsData.goodsName}}</p>
          <span class="name" v-if="numSpecs!=null&&numAttr!=null">{{$t('seller.content.selected')}}：{{specsData.goodsSpecs}} / {{attrData.goodsAttributeLabel}}</span>
          <span class="name" v-else-if="numSpecs!=null&&numAttr==null">{{$t('seller.content.selected')}}：{{specsData.goodsSpecs}}</span>
          <span class="name" v-else-if="numSpecs==null&&numAttr!=null">{{$t('seller.content.selected')}}：{{attrData.goodsAttributeLabel}}</span>
          <span class="name" v-else></span>

          <div v-if="goodsData.isSpecs == 1" class="a">
            <div class="flex">
               <span v-if="limitNum" style="color:#FF2926;font-size:12px;">{{$t('seller.content.onlyBay')}}{{limitNum}}{{$t('seller.content.count')}}</span>
            </div>
            <div class="flex row" style="display:flex;flex-flow:row;">
               <!-- 没有优惠且没有点击规格数量大于1 -->
               <p v-if="!limitNum && numSpecs == null && goodsData.goodsSpecsList.length > 1">
                 {{goodsData.presentPrice || goodsData.originalPrice}}P{{$t('seller.content.since')}}
               </p>
               <!-- 没有优惠且没有点击规格 且规格数量等于1 -->
               <p v-if="!limitNum && numSpecs == null && goodsData.goodsSpecsList.length == 1">
                 {{goodsData.presentPrice || goodsData.originalPrice}}P
               </p>
               <!-- 没有优惠且点击规格 -->
               <p v-if="!limitNum && numSpecs !== null">{{specsData.originalPrice}}P</p>
               <!-- 有优惠 -->
               <p v-if="limitNum">{{specsData.presentPrice}}P</p>
               <span v-if="limitNum" style="text-decoration: line-through;">{{specsData.originalPrice}}P</span>
               <span style="text-decoration: line-through;" v-if="!limitNum && numSpecs == null && goodsData.goodsSpecsList.length == 1 && goodsData.presentPrice">
                 {{goodsData.originalPrice || 0}}P
               </span>
            </div>
            
          </div>
          <div v-if="goodsData.isSpecs == 0" class="b">
            <div class="flex">
               <p v-if="goodsData.isDiscount && goodsData.limitNum" style="color:#FF2926;font-size:12px;">{{$t('seller.content.onlyBay')}}{{goodsData.limitNum}}{{$t('seller.content.count')}}</p>
            </div>
            <div class="flex row" style="display:flex;flex-flow:row;">
                <!-- 无优惠 -->
                <span v-if="!goodsData.isDiscount" style="color:#FF2926;font-weight: bold;">{{goodsData.originalPrice}}P</span>
                <!-- 有优惠 -->
                <span v-if="goodsData.isDiscount" style="color:#FF2926;font-weight: bold;">{{goodsData.presentPrice}}P</span>
                <span v-if="goodsData.isDiscount" style="text-decoration: line-through;">{{goodsData.originalPrice}}P</span>
            </div>
           
            
          </div>
        </div>
        <span class="wai">
          <i @click="close_alert(false)">
            <img src="../../assets/icon/Close.png" />
          </i>
        </span>
      </li>
      <li class="specs" v-if="goodsData.goodsSpecsList">
        <p>{{$t('seller.content.specification')}}</p>
        <span>
          <span v-for="(item,index) in goodsData.goodsSpecsList" :key="index" :class="[numSpecs==index?'active':'']" @click="select_specs(index,item)">
            {{item.goodsSpecs}}
          </span>
        </span>
      </li>
      <li class="specs" v-for="(item,index) in goodsData.goodsAttributeList" :key="index">
        <p>{{item.goodsAttribute}}</p>
        <span>
          <span :class="[numAttr==index?'active':'']" @click="select_attr(index,el)" v-for="(el,index) in item.goodsLabelList" :key="index">
            {{el.goodsAttributeLabel}}
          </span>
        </span>
      </li>
      <li>
        <span @click="space_ok(goodsData)">{{$t('seller.content.choosed')}}</span>
      </li>
    </ul>
  </div>

</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

export default {
  name: "seller-alert",
  props: ["type", "orderCommentNum", "goodsData"],
  data() {
    return {
      scoreList: [],
      numSpecs: null,
      numAttr: null,
      specsData: null,
      attrData: null,
      limitNum: null,
      presentPrice: 0,
      originalPrice: 0,
      isDiscount: 0
    };
  },
  computed: {
    ...mapState("seller", ["sellerInfo"]),
    sellerId() {
      return this.$route.params.id;
    }
  },
  mounted() {
    console.log("商铺信息:::", this.sellerInfo);
    this.getSellerPoints();
  },
  methods: {
    ...mapMutations("order", ["addToCart", "removeFromCart"]),
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
    space_ok(goodsData) {
      if (goodsData.goodsSpecsList && !this.specsData) {
        if (getCookie("lang") == "zh") {
          this.$message.warning(`请选择规格`);
        } else if (getCookie("lang") == "en") {
          this.$message.warning(`Please select the specifications.`);
        }
        return;
      }
      if (goodsData.goodsAttributeList && !this.attrData) {
        if (getCookie("lang") == "zh") {
          this.$message.warning(`请选择属性`);
        } else if (getCookie("lang") == "en") {
          this.$message.warning(`Please select attributes.`);
        }
        return;
      }
      // 当选中属性时
      if (this.attrData)
        goodsData = Object.assign({}, goodsData, this.attrData);
      // 当选中规格时
      if (this.specsData)
        goodsData = Object.assign({}, goodsData, this.specsData);
      // console.log(goodsData)
      // console.log("-----------------", goodsData);
      this.addToCart(goodsData);
      this.$emit("spaceOk", false);
    },
    close_alert(alert) {
      this.$emit("closeAlert", alert);
    },
    select_specs(index, data) {
      // console.log(data.id);

      this.limitNum = null;
      let startDate = "",
        endDate = "",
        startTime = "",
        endTime = "",
        startTimeA = "",
        endTimeA = "",
        nowTime = "";

      this.newTime = new Date().getTime();
      nowTime = new Date().getHours() + "" + new Date().getMinutes();

      if (data.endDate && data.startDate && data.isDiscount) {
        startDate = this.$formatDateTime(data.startDate, "ymd");
        endDate = this.$formatDateTime(data.endDate, "ymd");
      }

      if (data.startTime && data.endTime) {
        startTime = parseInt(data.startTime.replace(":", ""));
        endTime = parseInt(data.endTime.replace(":", ""));
      }
      if (data.startTimeA && data.endTimeA) {
        startTimeA = parseInt(data.startTimeA.replace(":", ""));
        endTimeA = parseInt(data.endTimeA.replace(":", ""));
      }

      if (data.isDiscount == 1) {
        if (data.isAllDay == 1) {
          if (data.startDate < this.newTime && this.newTime < data.endDate) {
            this.limitNum = data.limitNum;
            this.isDiscount = 1;
          }
        } else {
          if (data.startDate < this.newTime && this.newTime < data.endDate) {
            if (startTime < nowTime && nowTime < endTime) {
              this.limitNum = data.limitNum;
              this.isDiscount = 1;
            }
            if (startTimeA < nowTime && nowTime < endTimeA) {
              this.limitNum = data.limitNum;
              this.isDiscount = 1;
            }
          }
        }
      }
      // 优惠价
      this.presentPrice = data.presentPrice;
      console.log("===============");
      // console.log("==========", data.originalPrice);
      // 原价
      this.originalPrice = data.originalPrice;
      // 规格选择效果
      this.numSpecs = index;
      // 当前选中规格信息
      this.specsData = data;
      this.specsData.limitNum = this.limitNum !== null ? this.limitNum : null;
      this.specsData.isDiscount = this.isDiscount;
      this.specsData = JSON.parse(
        JSON.stringify(this.specsData).replace(/id/g, "specsId")
      );
      // console.log("规格---------", this.specsData);
      // console.log(this.originalPrice, this.presentPrice, this.specsData);
    },
    select_attr(index, data) {
      this.numAttr = index;
      if (data.isSpecs == 0) {
        this.limitNum = data.limitNum;
      }
      // 当前选中属性信息
      this.attrData = data;
      this.attrData = JSON.parse(
        JSON.stringify(this.attrData).replace(/id/g, "labelId")
      );
    }
  }
};
</script>

<style lang="scss">
.alertDiv {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  ul {
    width: 340px;
    border-radius: 10px;
    background: white;
    padding: 10px;
    li.specs {
      flex-flow: column;
      cursor: default;
      p {
        color: #969696;
        margin: 5px 0;
      }
      span {
        width: 100%;
        display: flex;
        flex-flow: row wrap;
        span {
          width: 100px;
          padding: 5px 0;
          color: #3e3e3e;
          font-size: 14px;
          border: 1px solid #eeeeee;
          display: flex;
          justify-content: center;
          border-radius: 3px;
          margin-right: 15px;
          margin-bottom: 5px;
          &:nth-child(3n) {
            margin-right: 0; // background: red;
          }
        }
        span.active {
          background: #fee3df;
          color: #fe3d3a;
          border: 1px solid #fe3d3a;
        }
      }
    }
    li {
      width: 100;
      display: flex;

      &:nth-child(1) {
        width: 100%;
        flex-flow: row;
        margin-bottom: 20px;
        i {
          width: 100px;
          height: 85px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        div.box {
          // background: red;
          flex: 1;
          display: flex;
          flex-flow: column;
          margin-left:6px;
          // padding: 0 6px;
          p.name {
            width: 100%;
            height: 25%;
          }
          p.goodsName {
            color: #333;
            font-weight: bold;
          }
          span.name {
            width: 100%;
            height: 25%;
            color: #999;
          }
          div.a {
            width: 100%;
            height: 45%;
            display: flex;
            flex-flow: column;
            div{height:50%;}
            p{
              margin-right:5px;
              color:#FF2926;
              font-size:16px;
              font-weight: bold;
            }
            span{
              color:#949494;
              font-size:15px;
            }
          }
          div.b {
            width: 100%;
            height: 45%;
            display: flex;
            flex-flow: column;
            div{height:50%;}
            
            span{
              margin-right:5px;
              // color:#FF2926;
              font-size:16px;
              font-weight: bold;
              &:last-child{
                color:#949494;
                font-size:15px;
                font-weight: 100;
              }
            }
            
            
          }
        }
        span.wai {
          width: 15px;
          display: flex;
          i {
            width: 15px;
            height: 15px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      &:last-child {
        width: 100%;
        margin-top: 10px;
        span {
          width: 100%;
          font-size: 16px;
          color: white;
          padding: 10px;
          background: #ff644c;
          border-radius: 5px;
          text-align: center;
        }
      }
    }
  }
}
</style>