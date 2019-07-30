<template>
  <div class="seller-header clearfix">
    <div class="left" v-if="!loading">
      <div class="seller">
        <div class="clearfix">
          <div class="avatar">
            <span class="shop_status" v-show="sellerInfo.busFlag!=1&&statusShow" v-cloak><span>{{$t('seller.content.resting')}}</span></span>
            <img :src="sellerInfo.sellerLogoPath" height="150" width="260">
            
          </div>
          <div class="info">
            <div class="name">{{sellerInfo.sellerName}}</div>
            <div class="seller-score">
              <!-- <el-rate v-model="sellerInfo.orderScore" disabled disabled-void-color="#C6D1DE" show-score :colors="['#FF644C', '#FF644C', '#FF644C']"
                text-color="#666" /> -->
              <div class="rate_contain">
                <span class="rate_gray">
                  <img src="../../assets/icon/icon_star_gray.png" alt="">
                </span>
                <span class="rate_red" :style="{width:set_star(sellerInfo.orderScore) + '%'}">
                  <img src="../../assets/icon/icon_star_red.png" alt="">
                </span>
            </div>

            </div>
            <ul>
              <!-- <li><i class="iconfont icon-icon_phone"></i>商家电话：{{sellerInfo.phone}}</li> -->
              <li>
                <i class="iconfont icon-time"></i>
                <span v-if="sellerInfo.allDayOpen===2">{{$t('seller.header.openTime')}}: {{sellerInfo.businessStartTime}} - {{sellerInfo.businessEndTime}}</span>
                <span v-else>{{$t('seller.header.openTime')}}: 24{{$t('seller.header.hour')}}</span>
              </li>
              <li class="shop__address__wrapper">
                <div class="lab">
                  <i class="iconfont icon-icon-address"></i>
                </div>
                <p>{{$t('seller.header.sellerAdd')}}: {{sellerInfo.location}}</p>
              </li>
            </ul>
          </div>
        </div>
        <!-- <div class="shop__detail">
          <div class="raty__num">
            <span class="num">{{sellerInfo.orderScore || 0}}</span>
            <div class="score__detail">
              <el-rate v-model="sellerInfo.orderScore"  disabled-void-color="#C6D1DE" disabled :colors="['#FF644C', '#FF644C', '#FF644C']" />
            </div>
            <p class="eval__detail">{{$t('seller.header.inTotal')}} {{scoreList.orderCommentNum}} {{$t('seller.header.evaluate')}}</p>
          </div>
          <div class="raty__detail">
            <ul> -->
        <!-- <li v-for="(item, index) in scoreList" :key="index"> -->
        <!-- <li>
                <div class="point">{{item.points}} 评分</div>
                <el-progress :percentage="item.percent" class="progress"></el-progress>
              </li> -->
        <!-- </ul>
          </div> -->
        <!-- </div> -->
      </div>
    </div>
    <div class="right" v-if="!loading">
      <ul>
        <li>
          <div class="price">{{sellerInfo.limitDeliveryCost||0}}P</div>
          <div class="text">{{$t('seller.header.charging')}}</div>
        </li>
        <li>
          <div class="price">{{sellerInfo.logistics||0}}P</div>
          <div class="text">{{$t('seller.header.dispatching')}}</div>
        </li>
        <li @click="collect" class="col__btn">
          <div class="star">
            <i class="iconfont" v-if="!colLoading" :class="[isCollected==='1' ? 'active' : '', isCollected==='1' ? 'icon-shoucangicon1':'icon-shoucangicon']"
            />
            <i class="iconfont icon-loading icon-rotating" v-else></i>
          </div>
          <div class="text">
            <template v-if="isCollected==='1'">{{$t('seller.header.isCollect')}}</template>
            <template v-else>{{$t('seller.header.collectSeller')}}</template>
          </div>
        </li>
        <li>
          <el-button type="text" :disabled="isUserOrderCount" @click="dialogVisible = true">
            <div>
              <img :src="defaultIconJubao" alt="" width="20">
            </div>
            <div>{{$t('seller.header.reportMerchant')}}</div>
          </el-button>
        </li>
      </ul>
    </div>
    <common-loading v-if="loading" style="margin-top: 40px;" />
    <!-- 新增举报商家弹框 -->
    <!-- <el-dialog :title="$t('seller.header.reportMerchant')" :visible.sync="dialogVisible" width="45%" :before-close="handleClose"> -->
    <el-dialog :title="$t('seller.header.reportMerchant')" :visible.sync="dialogVisible" width="45%">
      <div class="sellname">
        <!-- <span>举报商家：</span>{{sellerInfo.sellerName}} -->
      </div>
      <el-form ref="form" :model="form" label-width="135px" label-position="left">
        <el-form-item :label="$t('accountInfo.userInfo.areaCode')">
          <el-select v-model="form.select" :placeholder="$t('accountInfo.userInfo.areaHolder')" filterable>
            <el-option v-for="(item, index) in CountryJson.data" :key="index" :label="'+'+item.phoneCode+' '+item.countryName" :value="item.countryName"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('seller.header.userTel')">
          <el-input v-model="form.phone" :placeholder="$t('seller.header.mimi')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('seller.header.content')">
          <el-input type="textarea" resize="none" v-model="form.desc" :maxlength="200" :rows="5" :placeholder="$t('seller.header.moreSize')"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- 上传图片容器 -->
        <div class="upload__img__wrapper">
          <!-- <ul class="clearfix">
            <li v-for="(item, index) in addImgList" :key="index" :class="item.id">
              <img :src="'http://p09c65oxn.bkt.clouddn.com/' + item.id + '.' + item.name.split('.')[1]" />
              <div class="loading">
                <i class="iconfont icon-loading icon-rotating"></i>
              </div>
              <span class="close__btn" @click="delAddImg(index)">
                <i class="iconfont icon-jian"></i>
              </span>
            </li>
            <li class="add__img">
              <div id="add__img-file--btn">
                <i class="iconfont icon-camera_full"></i>
              </div>
            </li>
          </ul> -->

          <!-- <el-upload ref="file_list" action="https://img.hzxindakeji.com" list-type="picture-card" :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove" :limit="maxNum" :on-exceed="handleExceed">
            <i class="el-icon-plus"></i>
          </el-upload> -->
          <el-upload ref="file_list" :data="upToken" action="https://up.qiniup.com" multiple :limit="9" list-type="picture-card"
                :on-success="successUpload" :on-error="errorUpload" :on-exceed="removeUpload" :on-remove="handleRemove">
                  <i class="el-icon-plus"></i>
          </el-upload>
          <!-- <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog> -->

        </div>
        <el-button @click="dialogVisible = false">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="reportSeller">{{$t('common.ok')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import defaultIconJubao from "../../../src/assets/img/avatar-jubao.svg";
import CountryJson from "../../assets/json/countryChinese";
import CountryJsons from "../../assets/json/countryEnglish.json";
import { getCookie } from "../../utils.js";
import $ from "jquery";
export default {
  name: "seller-header",
  data() {
    return {
      CountryJson,
      dialogVisible: false,
      isUserOrderCount: false,
      defaultIconJubao,
      loading: false,
      location: null,
      colLoading: false,
      // isCollections: null,
      sellerInfo: {
        orderScore: 0
      },
      scoreList: [],
      // count: 0,
      pageSize: 8,
      currentPage: 1,
      addImgList: [], //上传图片集合
      maxNum: 9, //最大上传个数
      form: {
        desc: "", //投诉描述
        phone: "", //投诉联系电话
        select: `+63 ${this.$t("common.country")}`
      },
      dialogImageUrl: "",
      upToken: {
        token: ""
      },
      hash: "",
      statusShow: false
    };
  },
  computed: {
    // ...mapState('seller', ['sellerInfo']),
    getBusFlag() {
      let { sellerInfo } = this;
       return sellerInfo.busFlag;
    },
    // ...mapState('seller', ['sellerInfo']),
    globalCode() {
      let globalCode = 0;
      let { select, CountryJson } = this;
      let list = CountryJson.data;
      list.forEach(item => {
        if (item.countryName === select) globalCode = item.phoneCode;
      });
      return globalCode || "63";
    },
    sellerId() {
      return this.$route.params.id;
    },
    isCollected() {
      let { sellerInfo } = this;
      return sellerInfo.isCollections;
    }
  },
  watch: {

    // addImgList: function () {
    //   alert(1);
    //   this.$nextTick(function () {
    //     this.goPrice(0);
    //   })
    // }
  },
  async mounted() {
    let location = localStorage.getItem("location");
    if (!location) {
      this.$router.push("/");
    } else {
      this.location = JSON.parse(location);
      this.getSellerInfo();
      // this.collect()
      this.getSellerPoints();
      this.getSellerRate();
    }
    let lang = getCookie("lang");
    if (lang == "zh") {
      this.CountryJson = CountryJson;
    } else {
      this.CountryJson = CountryJsons;
    }

    setTimeout(() => {
      this.isLoading = true;
    }, 300);
    let self = this;
    // await this.initData();
    this.loading = false;
    // if (!this.noOrder) {
    //   $(".order__wrapper").show();
    // }
    let uptoken = await self.ajaxGetQiniuToken();
    this.upToken.token = uptoken;
    // let self = this;
    // let uptoken = await self.ajaxGetQiniuToken();
    // // console.log('uptoken',uptoken)

    // let uploader = Qiniu.uploader({
    //   runtimes: "html5,flash,html4",
    //   browse_button: "add__img-file--btn", // 上传选择的点选按钮，必需
    //   // container: 'img_warp_list',   // 上传区域 DOM ID，默认是 browser_button 的父元素，
    //   uptoken: uptoken, // uptoken是上传凭证，由其他程序生成
    //   get_new_uptoken: false, // 设置上传文件的时候是否每次都重新获取新的uptoken
    //   unique_names: true, // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
    //   domain: "http://p09c65oxn.bkt.clouddn.com", // bucket域名，下载资源时用到，必需
    //   max_retries: 9, // 上传失败最大重试次数
    //   chunk_size: "4mb", // 分块上传时，每块的体积
    //   auto_start: false, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
    //   filters: {
    //     max_file_size: "20mb",
    //     prevent_duplicates: false,
    //     mime_types: [
    //       { title: "Image files", extensions: "jpg,gif,png" } // 限定jpg,gif,png后缀上传
    //     ]
    //   },
    //   init: {
    //     FilesAdded: function (up, files) {
    //       // console.log('files',files)
    //       let lastNum = self.maxNum - self.addImgList.length;
    //       let chooseNum = files.length;
    //       if (chooseNum <= lastNum) {
    //         plupload.each(files, function (file) {
    //           // 文件添加进队列后，处理相关的事情
    //           self.addImgList.push(file);
    //         });
    //         // console.log('addImgList',self.addImgList)
    //         // self.checkIfUpload();
    //         up.start();
    //       } else {
    //         self.$message.error(self.$t("order.detail.alert.uploadImgLim"));
    //       }
    //     },
    //     BeforeUpload: function (up, file) { },
    //     UploadProgress: function (up, file) { },
    //     FileUploaded: function (up, file, info) {
    //       // console.log('info',info)
    //       let domain = up.getOption("domain");
    //       let res = eval("(" + info + ")");
    //       let sourceLink = domain + "/" + res.key;
    //       console.log('sourceLink', domain, sourceLink);
    //       // $("." + file.id + " img").attr("src", sourceLink);
    //       $("." + file.id + " img").show();
    //       $("." + file.id + " .loading").hide();
    //       $("." + file.id + " .close__btn").show();
    //     },
    //     Error: function (up, err, errTip) {
    //       self.$message.error(errTip);
    //     },
    //     UploadComplete: function () { },
    //     Key: function (up, file) {
    //       let key = "";
    //       return key;
    //     }
    //   }
    // });

    // console.log('uploader',uploader)
  },
  methods: {
    ...mapActions("user", ["ajaxCollectStatus", "ajaxCollect"]),
    ...mapActions("seller", [
      "ajaxSellerInfo",
      "ajaxSellerPoints",
      "ajaxSellerRate",
      "ajaxReportSeller"
    ]),
    ...mapActions("order", ["ajaxGetQiniuToken"]),
    ...mapMutations("seller", ["setSeller"]),

    set_star(rate) {
      // 一个星星width: 15% 空格距离是 6.5%
      let count = (rate * 15).toFixed(2);
      console.log("rate", rate);
      let space = rate.toString()[0] * 6.5;
      // this.goods_star = Number(count) + space
      return Number(count) + space;
      // this.post_star = Number(count) + space
    },
    async getSellerInfo() {
      this.loading = true;
      let { sellerId } = this;
      let { lat, lon } = this.location;
      let res = await this.ajaxSellerInfo({ sellerId, lat, lon });
      if (res.code === 1) {
        this.sellerInfo = res.data;
        if(this.sellerInfo.busFlag!=1){
           this.statusShow=true;
        }
        console.log("nihao", this.sellerInfo);
        if (this.sellerInfo.logistics <= 0) {
          this.sellerInfo.logistics = 0;
        }
        this.setSeller(res.data);
        if (res.data.userOrderCount === 0 || !res.data.userOrderCount) {
          this.isUserOrderCount = true;
        }
      } else {
        this.$message.error(res.message);
      }
      this.loading = false;
    },
    async getSellerRate() {
      let { sellerId, pageSize, currentPage } = this;
      let { lat, lon } = this.location;
      let res = await this.ajaxSellerRate({
        sellerId,
        pageSize,
        currentPage,
        lat,
        lon
      });
      // console.log(res)
      if (res.code === 1) {
        // this.count = res.data.map.count
      }
    },
    async getSellerPoints() {
      let { sellerId } = this;
      let res = await this.ajaxSellerPoints({ sellerId });
      // console.log(res)
      if (res.code === 1) {
        this.scoreList = res.data;
      }
    },
    async collect() {
      let { sellerId } = this;
      let res = await this.ajaxCollectStatus({ sellerId });
      if (res.code === 1) {
        console.log("收藏", res);
        let data = this.sellerInfo;
        data.isCollections = "1";
        this.setSeller(data);
        this.$message.success(this.$t("seller.header.success"));
      } else if (res.code === 8001) {
        this.$message.error(res.message);
        setTimeout(
          function() {
            this.$router.push("/user/login");
          }.bind(this),
          300
        );
      } else {
        this.getCollectStatus();
      }
    },
    async getCollectStatus() {
      if (this.colLoading) return;
      let { sellerId } = this;
      this.colLoading = true;
      let res = await this.ajaxCollect({ sellerIds: sellerId });
      if (res.code === 1) {
        if (this.$checkData(res)) {
          let data = this.sellerInfo;
          data.isCollections = "0";
          this.setSeller(data);
          this.$message.success(this.$t("seller.header.successCancel"));
        }
        this.colLoading = false;
      } else {
        this.$message.error(res.message);
      }
    },

    isEmojiCharacter(substring) {
      for (var i = 0; i < substring.length; i++) {
        var hs = substring.charCodeAt(i);
        if (0xd800 <= hs && hs <= 0xdbff) {
          if (substring.length > 1) {
            var ls = substring.charCodeAt(i + 1);
            var uc = (hs - 0xd800) * 0x400 + (ls - 0xdc00) + 0x10000;
            if (0x1d000 <= uc && uc <= 0x1f77f) {
              return true;
            }
          }
        } else if (substring.length > 1) {
          var ls = substring.charCodeAt(i + 1);
          if (ls == 0x20e3) {
            return true;
          }
        } else {
          if (0x2100 <= hs && hs <= 0x27ff) {
            return true;
          } else if (0x2b05 <= hs && hs <= 0x2b07) {
            return true;
          } else if (0x2934 <= hs && hs <= 0x2935) {
            return true;
          } else if (0x3297 <= hs && hs <= 0x3299) {
            return true;
          } else if (
            hs == 0xa9 ||
            hs == 0xae ||
            hs == 0x303d ||
            hs == 0x3030 ||
            hs == 0x2b55 ||
            hs == 0x2b1c ||
            hs == 0x2b1b ||
            hs == 0x2b50
          ) {
            return true;
          }
        }
      }
    },
    // handleExceed(file, fileList){
    //   this.$message.error(this.$t("order.detail.alert.uploadImgLim"))
    // },
    // handleRemove(file, fileList) {
    //   console.log(file, fileList);
    // },
    // handlePictureCardPreview(file) {

    //   console.log("file333333", file);
    //   this.dialogImageUrl = file.url;
    //   this.dialogVisible = true;
    // },
    removeUpload(file, fileList) {
      console.log(file, fileList,'数量');
      
      this.$message.error(this.$t("order.detail.alert.uploadImgLim"));
    },
    handleRemove(file, fileList) {
      if (file.status == "success") {
        // fileList.splice(file, 1)
        
        if (fileList.length <= 8) {
          this.checkIfUpload();
        }
      }
      this.hash = "";
      if(fileList.length==1){
        this.hash = fileList[0].response.hash 
      }else{
        fileList.forEach(el => {
        
        if (el.response) {
          this.hash += el.response.hash + ",";
        }
       });
      }
      if(fileList.length<9){
        document.getElementsByClassName('el-upload--picture-card')[0].style.display='inline-block'
      }
      console.log(this.hash, "111111111",fileList);
    },
    // uploadImg(file) {
    //   console.log(file);
    //   const loading = this.$loading({
    //     lock: true,
    //     text: "拼命加载中......",
    //     spinner: "el-icon-loading",
    //     background: "rgba(0, 0, 0, 0.4)"
    //   });
    //   if (file) {
    //     loading.close();
    //   }
    // },
    errorUpload(err, file, fileList) {
      console.log("111111111", err);
      this.$message.error(this.$t("order.detail.errorImg"));
    },

    successUpload(response, file, fileList) {
      this.hash = "";
      // console.log(fileList, "22222");
      // console.log("response", response, "file", file, "fileList", fileList);
      if(fileList.length==1){
        this.hash = fileList[0].response.hash 
      }else{
        fileList.forEach(el => {
        
        if (el.response) {
          this.hash += el.response.hash + ",";
        }
       });
      }
      console.log(this.hash, "2222");
      if(fileList.length>=9){
        document.getElementsByClassName('el-upload--picture-card')[0].style.display='none'
      }
      this.hash = this.hash.substring(0, this.hash.length - 1);
      fileList.forEach(item => {
        if (item.status == "success") {
          // this.addImgList.push(fileList);
          this.addImgList = fileList;
          // if (this.addImgList.length >= 9) {
          //   document.getElementsByClassName(
          //     "el-upload--picture-card"
          //   )[0].style.display =
          //     "none";
          // }
          // console.log(this.addImgList.length, '333333333333')
          this.checkIfUpload();
          // console.log('%%%%%%',this.addImgList);
        }
      });
    },
    // delAddImg(index) {
    //   console.log(this.addImgList, index);
    //   this.addImgList.splice(index, 1);
    //   console.log(this.addImgList);
    //   this.checkIfUpload();
    // },
    checkIfUpload() {
      let self = this;
      if (self.addImgList.length >= 9) {
        $(".el-upload--picture-card").hide();
      } else {
        $(".el-upload--picture-card").show();
      }
    },
    // 提交举报商家
    async reportSeller() {
      // debugger;
      let reg = /[~#^$@%&*]/gi;
      if (reg.test(this.form.desc)) {
        // alert("特殊字符");
        this.$message.error(this.$t("payMent.special_characters"));
        return
      } else if (this.isEmojiCharacter(this.form.desc)) {
        // alert("表情");
        this.$message.error(this.$t("payMent.emoticons"));
        return
      } else {
        // console.log("files:::", this.$refs.file_list.$children[1].fileList);

        // this.$refs.file_list.$children[1].fileList.forEach(item => {
        //   console.log("raw:::", item.raw);
        //   this.addImgList.push(item);
        // });
        // console.log("addImgList:::", this.addImgList);

        // let picture = "",
        //   addImgList = this.addImgList;
        // for (let i = 0; i < addImgList.length; i++) {
        //   if (i == addImgList.length - 1) {
        //     picture = picture + addImgList[i].target_name;
        //   } else {
        //     picture = picture + addImgList[i].target_name + ",";
        //   }
        // }
        let params = {
          picture:this.hash,
          content: this.form.desc,
          sellerId: this.$route.params.id,
          phonePre: this.globalCode,
          phone: this.form.phone
        };
        if (!params.content || !params.phonePre || !params.phone) {
          this.$message({
            message: this.$t("common.notFull"),
            type: "warning"
          });
          return;
        }
        // console.log(params)
        let res = await this.ajaxReportSeller(params);
        // console.log('ReportSeller',res);
        if (res.code === 1) {
          this.dialogVisible = false;
          this.$message.success(res.message);
          // this.addImgList = "";
          this.addImgList = [];
          this.$refs.file_list.clearFiles();
          this.form.desc = "";
          this.form.phone = "";
        } else {
          this.$message.error(res.message);
        }
      }
    },
    // 关闭模态框
    // handleClose(done) {
    //   this.$confirm(this.$t('common.confirmClose'))
    //     .then(_ => {
    //       done();
    //     })
    //     .catch(_ => { });
    // },
    // 删除图片
    delAddImg(index) {
      console.log(this.addImgList);
      this.addImgList.splice(index, 1);
      console.log(this.addImgList);
      this.checkIfUpload();
    },
    checkIfUpload() {
      let self = this;
      if (self.addImgList.length >= self.maxNum) {
        $(".add__img__wrapper").hide();
      } else {
        $(".add__img__wrapper").show();
      }
    }
  }
};
</script>
<style scoped lang="scss">
.seller-header {
  @include container;
  background: #fff;
  margin-top: 20px;
  position: relative;
  .left {
    width: 660px;
    height: 150px;
    float: left;
    .seller {
      width: 100%;
      height: 150px;
      box-sizing: border-box; // cursor: pointer;
      // &.open,
      // &:hover {
      //   box-shadow: 1px 1px 22px 4px #efefef;
      //   height: 360px;
      //   z-index: 1;
      //   background: #fff;
      //   .shop__detail {
      //     display: block;
      //   }
      //   .info {
      //     .shop__address__wrapper {
      //       p {
      //         text-overflow: unset;
      //         white-space: unset;
      //         overflow: unset;
      //       }
      //     }
      //   }
      // }
      // .shop__detail {
      //   display: none;
      //   margin-top: 20px;
      //   .raty__num {
      //     float: left;
      //     margin-right: 30px;
      //     width: 260px;
      //     text-align: center;
      //     .num {
      //       margin-top: 55px;
      //       font-size: 48px;
      //       color: $color-primary;
      //     }
      //     .score__detail {
      //       margin-top: 3px;
      //     }
      //     .eval__detail {
      //       color: #999999;
      //       margin-top: 10px;
      //     }
      //   }
      //   .raty__detail {
      //     overflow: hidden;
      //     padding-right: 30px;
      //     ul {
      //       li {
      //         overflow: hidden;
      //         margin-top: 10px;
      //       }
      //       .point {
      //         float: left;
      //         width: 15%;
      //       }
      //       .el-progress {
      //         float: left;
      //         width: 85%;
      //         .el-progress-bar__outer {
      //           height: 10px !important;
      //         }
      //       }
      //     }
      //   }
      // }
      .avatar {
        width: 260px;
        height: 150px;
        float: left;
        margin-right: 30px;
        position: relative;
      }
      .shop_status {
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 260px;
        height: 34px;
        background: rgba(0, 0, 0, 0.7);
        z-index: 888;
        color: white;
        font-size: 18px;
      }
      .info {
        overflow: hidden;
        padding: 20px 30px 15px 0;
        height: 150px;
        box-sizing: border-box;
        .shop__address__wrapper {
          .lab {
            float: left;
          }
          p {
            line-height: 18px;
            position: relative;
            top: 2px; // text-overflow: ellipsis;
            // white-space: nowrap;
            // overflow: hidden;
          }
        }
        .name {
          font-size: 16px;
          font-weight: bold;
          color: #333333;
        }
        .seller-score {
          margin: 5px 0;
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
        ul {
          li {
            font-size: 12px;
            color: #666666;
            height: 22px;
            line-height: 22px;
            i {
              margin-right: 10px;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
  .right {
    background: url("../../assets/img/pic_title_bg.png") no-repeat;
    background-position-x: right;
    height: 150px;
    float: right;
    ul {
      height: 100%;
      padding: 43px 10px;
      overflow: hidden;
      box-sizing: border-box;
      li {
        float: left;
        padding: 0 30px;
        position: relative;
        text-align: center;
        height: 100%;
        width: 60px;
        &.col__btn {
          cursor: pointer;
        }
        .price {
          font-size: 24px;
          color: #999999;
        }
        .star {
          padding-top: 5px;
          i {
            font-size: 20px;
            cursor: pointer;
            &:hover,
            &.active {
              color: #f5af22;
            }
          }
        }
        .text {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }
        .el-button {
          padding-top: 15px;
          img {
            margin-bottom: 4px;
            width: 20px;
          }
        }
        &:not(:first-child):before {
          content: "";
          width: 1px;
          height: 35px;
          background: #e6e6e6;
          position: absolute;
          left: 0;
          top: 10px;
        }
      }
    }
  }
  .el-dialog__wrapper {
    .el-dialog {
      .el-dialog__body {
        padding: 0 20px;
        .sellname {
          span {
            margin-right: 20px;
          }
        }
      }
      .el-dialog__footer {
        .upload__img__wrapper {
          padding: -10px 10px 0 10px;
          margin-bottom: 20px;
          border: 1px solid $bd-gray;
          overflow: hidden;
          ul {
            li {
              border: 1px solid $bd-gray;
              position: relative;
              width: 84px;
              height: 84px;
              float: left;
              margin: 10px;
              border-radius: 4px;
              img {
                width: 100%;
                height: 100%;
                display: none;
              }
              .close__btn {
                display: none;
                position: absolute;
                top: -8px;
                right: -10px;
                cursor: pointer;
                background: $color-primary;
                border-radius: 100%;
                width: 20px;
                height: 20px;
                text-align: center;
                line-height: 20px;
                i {
                  font-size: 14px;
                  color: #fff;
                }
              }
              .loading {
                text-align: center;
                top: 50%;
                transform: translateY(-50%);
                i {
                  font-size: 20px;
                }
              }
              &.add__img {
                border: 1px dashed $bd-gray;
                border-radius: 6px;
                background: $bg-gray--light;
                line-height: 86px;
                text-align: center;
                cursor: pointer;
                i {
                  font-size: 25px;
                  color: #ccc;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>