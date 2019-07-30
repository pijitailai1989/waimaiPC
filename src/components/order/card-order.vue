<template>
  <div class="order__list__wrapper">
    <el-row>
      <el-col :span="12">
        <router-link :to="link">
          <img :src="item.seller_picture" class="orderImg">
        </router-link>
        <div class="info">
          <router-link :to="link">
            <h3 class="name">{{item.seller_name}}</h3>
          </router-link>

          <span class="single_hide order_name_box" v-show="lang=='zh'">
            {{arr_split(item.order_name)}}
          </span>
          <span style="font-size: 13px; color: black;" v-show="lang=='zh'" v-if="item.order_goods_num > 1">等
            <span>{{item.order_goods_num}}</span> 件商品</span>

          <span style="font-size: 13px; color: black;" v-show="lang=='en'" v-if="item.order_goods_num > 1">
            <span>{{item.order_goods_num}}</span> goods,such as&nbsp;</span>
          <span class="single_hide order_name_box" v-show="lang=='en'">
            {{arr_split(item.order_name)}}
          </span>

          <p>{{$t('order.list.orderId')}}：{{item.id}}</p>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="u-middle u-align-c">{{item.order_goods_num}}</div>
      </el-col>
      <el-col :span="3">
        <div class="u-middle u-align-c">{{item.actual_price}}P</div>
      </el-col>
      <el-col :span="3">
        <div class="u-middle u-align-c">
          <span class="order__status">{{statusMsg}}</span>
          <a href="javascript:;" @click="toDetail">{{$t('order.list.orderDetail')}}</a>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="u-middle u-align-c">
          <template v-if="parseInt(type)===1">
            <template v-if="refundStatus===0">
              <el-button round type="danger" size="mini" @click="toPay" v-if="status===0 && cancelTime!==1">{{$t('order.list.toPay')}}</el-button>
              <el-button round size="mini" :loading="cancelLoading" @click="doCancel" v-if="(status===0 || status===1) && cancelTime!==1">{{$t('order.list.toCancel')}}</el-button>
              <el-button round size="mini" @click="toRefund(item)" v-if="status===2 || status===3 || status===4 || status===5">{{$t('order.list.toRefund')}}</el-button>
              <!-- <el-button round size="mini" @click="toDeliveyDetail" v-if="status===3 || status===4">{{$t('order.list.toDeliveyDetail')}}</el-button> -->
              <el-button round size="mini" @click="toEvaluate" v-if="status===6">{{$t('order.list.toEvaluate')}}</el-button>
              <!-- <el-button round size="mini" @click="toEvaluateDetail" v-if="status===5 && isComment==1">{{$t('order.list.toEvaluateDetail')}}</el-button> -->
            </template>
            <template v-if="refundStatus!==0 && (status!==7)">
              <el-button round size="mini" @click="toRefundDetail">{{$t('order.list.toRefundDetail')}}</el-button>
            </template>
            <template v-if="refundStatus===4 && getSellerOrderTime!=null">
              <el-button round size="mini" @click="toRefundDetail">{{$t('order.list.toRefundDetail')}}</el-button>
            </template>
          </template>
          <template v-if="parseInt(type)===2">
            <el-button round size="mini" @click="toEvaluate">{{$t('order.list.toEvaluate')}}</el-button>
          </template>
          <template v-if="parseInt(type)===3">
            <el-button round size="mini" @click="toRefundDetail">{{$t('order.list.toRefundDetail')}}</el-button>
          </template>
        </div>
      </el-col>
    </el-row>
    <!-- 取消订单弹框 -->
    <el-dialog :title="$t('common.notic')" :visible.sync="cancelDialogVisible" width="30%">
      <span v-if="status===0">{{$t('dialog.cancel')}}</span>
      <span v-else>{{$t('dialog.cancelElse')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialogVisible = false">{{$t('dialog.noCancel')}}</el-button>
        <el-button type="primary" @click="submitCancel">{{$t('order.list.toCancel')}}</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="$t('order.list.toRefund')" :visible.sync="dialogVisible" width="40%" class="detail-dialog">
      <div class="tableTop">{{$t('order.detail.label.num')}}: {{item.id}}</div>
      <div class="tableLeft">{{$t('order.listHeader.sellerName')}}: {{item.seller_name}}</div>
      <div class="tableLeft">{{$t('order.detail.label.refundAmount')}}:
        <span class="money"> {{item.actual_price}}P</span>
      </div>
      <div class="tableLeft">{{$t('order.detail.label.refundType')}}: {{$t('order.detail.label.refundTypeText')}}</div>
      <div class="tableRadio">
        <span class="star-red">*</span>{{$t('dialog.refund.refundReason')}}:
        <div class="radios" @click="showStatus = false">
          <el-radio v-model="radio" :label="$t('dialog.refund.moreFood')">{{$t('dialog.refund.moreFood')}}</el-radio>
        </div>
        <div class="radios" @click="showStatus = false">
          <el-radio v-model="radio" :label="$t('dialog.refund.promiseDIs')">{{$t('dialog.refund.promiseDIs')}}</el-radio>
        </div>
        <div class="radios" @click="showStatus = false">
          <el-radio v-model="radio" :label="$t('dialog.refund.change')">{{$t('dialog.refund.change')}}</el-radio>
        </div>
        <div class="radios" @click="showStatus = false">
          <el-radio v-model="radio" :label="$t('dialog.refund.slow')">{{$t('dialog.refund.slow')}}</el-radio>
        </div>
        <div class="radios" @click="showStatus = false">
          <el-radio v-model="radio" :label="$t('dialog.refund.wrong')">{{$t('dialog.refund.wrong')}}</el-radio>
        </div>
        <div @click="otherShow">
          <el-radio v-model="radio" :label="$t('dialog.refund.else')">{{$t('dialog.refund.else')}}</el-radio>
        </div>
        <div class="other" v-if="showStatus">
          <el-input type="textarea" v-model="radioThe" maxlength="200" resize="none"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="confirm">{{$t('order.list.toRefund')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { mapActions, mapMutations } from "vuex";
  export default {
    props: ["item", "type"],
    data() {
      return {
        cancelLoading: false,
        dialogVisible: false,
        cancelDialogVisible: false,
        showStatus: false,
        radio: this.$t("dialog.refund.moreFood"),
        radioThe: "",
        timer: "",
        lang: ""
      };
    },
    computed: {
      // goodsNames() {
      //   let names = '';
      //   for (let i = 0; i < this.item.orderGoodsList.length; i++) {
      //     if (i == this.item.orderGoodsList.length - 1) {
      //       names = names + this.item.orderGoodsList[i].goodsName;
      //     } else {
      //       names = names + this.item.orderGoodsList[i].goodsName + ',';
      //     }
      //   }
      //   return names;
      // },
      cancelTime() {
        let createTime = parseInt(this.item.create_time / 1000);
        let endTime = createTime + 900;
        let clientTime = parseInt(new Date() / 1000);
        if (endTime < clientTime) {
          this.timer = 1;
        }
        return this.timer;
      },
      status() {
        return this.item.order_status;
      },
      refundStatus() {
        return this.item.rerund_status;
      },
      getSellerOrderTime() {
        return this.item.getSellerOrderTime;
      },
      isComment() {
        return this.item.isComment;
      },
      link() {
        return "/seller/" + this.item.seller_id;
      },
      statusMsg() {
        let message = null;
        if (this.refundStatus === 0) {
          switch (this.status) {
            // case 0:
            //   message = this.$t('order.status.sub') //订单提交
            //   break
            case 1:
              message = this.$t("order.status.hasPay"); // 已支付
              break;
            case 2:
            case 3:
            case 4:
            case 5:
              message = this.$t("order.status.distribution");
              break;
            // case 2:
            //   message = this.$t('order.status.shopTakeOrder')
            //   break
            // case 3:
            //   message = this.$t('order.status.deliTakeOrder')
            //   break
            // case 4:
            //   message = this.$t('order.status.distribution')
            //   break
            // case 5:
            //   message = this.$t('order.status.distribution') // 5 配送中(已取货在配送中)
            //   break
            case 6:
              message = this.$t("order.status.isComment"); //订单完成 待评价
              break;
            case 7:
              message = this.$t("order.status.hasCancle"); //订单取消
              break;
            case 8:
              message = this.$t("order.status.commented"); // 评价完成（也算已完成）
              break;
          }
          if (this.status === 0 && this.cancelTime !== 1) {
            message = this.$t("order.status.sub"); //订单提交
          } else if (this.status === 0 && this.cancelTime == 1) {
            message = this.$t("order.status.hasCancle"); //订单取消
          }
        } else if (this.refundStatus === 4) {
          if (this.getSellerOrderTime == null) {
            message = this.$t("order.status.hasCancle");
          } else {
            message = this.$t("order.status.refComplete");
          }
        } else {
          switch (this.refundStatus) {
            case 1:
              message = this.$t("order.status.refunding");
              break;
            case 2:
              message = this.$t("order.status.distribution");
              break;
            case 3:
              message = this.$t("order.status.platExam");
              break;
            // case 4:
            //   message = this.$t('order.status.refComplete')
            //   break
          }
        }
        return message;
      }
    },
    created() {
      this.lang = getCookie("lang");
    },
    methods: {
      ...mapActions("order", ["ajaxCancelOrder", "ajaxApplyRefund", "clearCart"]),
      arr_split(arr) {
        if (!arr) return;
        let result = arr.split(",");
        return result[0];
      },
      // 付款
      toPay() {
        let url = `/order/pay/` + this.item.id;
        this.$router.push(url);
      },
      // 查看详情
      toDetail() {
        let url =
          "/user/order/order-detail/" +
          this.item.id +
          "/" +
          this.item.getSellerOrderTime;
        this.$router.push(url);
      },
      // 查看退款详情
      toRefundDetail() {
        let url = "/user/order/refund-detail/" + this.item.id;
        this.$router.push(url);
      },
      //去评价
      toEvaluate() {
        let url = "/user/order/evaluate-order/" + this.item.id;
        this.$router.push(url);
      },
      //查看评价详情
      toEvaluateDetail() {
        let url = "/user/order/evaluate-detail/" + this.item.id;
        this.$router.push(url);
      },
      //查看配送详情
      toDeliveyDetail() {
        let self = this;
        let url = "/user/order/delivery-detail/" + this.item.id;
        this.$router.push(url);
        // if (this.item.deliveryId == null) {
        //   this.$alert(this.$t('order.list.alert.shopDeli') + ': ' + this.item.sellerPhone, this.$t('common.notic'), {
        //     confirmButtonText: this.$t('common.ok'),
        //     callback: action => {}
        //   });
        // } else {
        //   let url = '/user/order/delivery-detail/' + this.item.id;
        //   this.$router.push(url)
        // }
      },
      // 取消订单
      doCancel() {
        this.cancelDialogVisible = true;
      },
      // 提交
      async submitCancel() {
        let self = this;
        if (self.cancelLoading) {
          return false;
        }
        self.cancelDialogVisible = false;
        self.cancelLoading = true;
        let res = await this.ajaxCancelOrder({ orderId: this.item.id });
        console.log("取消订单", res);
        if (res.code === 1) {
          if (this.$checkData(res)) {
            this.$emit("refreshList");
          }
          self.cancelLoading = false;
          self.$message.success(this.$t("order.status.orderCancel"));
          self.clearCart();
          setTimeout(() => {
            self.$router.go(0);
          }, 1500);
        } else if (res.code === 9999) {
          self.$message.error(res.message);
          setTimeout(() => {
            self.$router.go(0);
          }, 1500);
        }
      },
      //申请退款
      toRefund() {
        this.dialogVisible = true;
        // this.$alert(this.$t('order.list.alert.refund'), this.$t('common.notic'), {
        //   confirmButtonText: this.$t('order.list.alert.shopTelShow'),
        //   callback: action => {
        //     if (action === 'confirm') {
        //       this.$alert(this.item.sellerPhone, this.$t('order.list.alert.shopTel'), {
        //         confirmButtonText: this.$t('common.ok'),
        //         callback: action => {}
        //       });
        //     }
        //   }
        // });
      },
      otherShow() {
        this.showStatus = true;
      },
      // 提交申请
      async confirm() {
        let remark = "";
        if (this.radioThe) {
          remark = this.radioThe;
        } else {
          remark = this.radio;
        }
        this.cancelLoading = true;
        let res = await this.ajaxApplyRefund({ remark, orderId: this.item.id });
        console.log("申请退款", res);
        this.cancelLoading = false;
        if (res.code === 1) {
          this.$message.success(res.message);
          this.dialogVisible = true;
          this.$emit("refreshList");
          this.$router.push("/user/my-order/all");
        } else {
          this.$message.error(res.message);
        }
      }
    }
  };
</script>
<style scope lang="scss">
  .order__list__wrapper {
    padding: 20px 0;
    border-bottom: 1px solid $bd-gray;
    .el-col {
      height: 90px;
    }
    &:last-child {
      border: 0;
    }
    img.orderImg {
      width: 130px;
      height: 90px;
      margin-right: 20px;
      float: left;
    }
    .info {
      overflow: hidden;
      text-align: left;
      .name {
        font-size: 16px;
        margin-bottom: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      p {
        padding: 5px 0;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .order_name_box {
        max-width: 55%;
        float: left;
        display: block;
        margin-right: 5px;
      }
    }
    .u-middle {
      button {
        margin-left: 0 !important;
      }
    }
    .el-button+.el-button {
      margin-top: 5px;
    }
    .order__status {
      margin-bottom: 5px;
      display: block;
    }
  }

  .el-dialog {
    color: #333333;
    .el-dialog__header {
      margin-left: 30px; // margin-right: 50px;
      font-weight: bold; // border-bottom: 1px solid #DDDDDD;
    }
    .tableTop {
      border-top: 1px solid #dddddd;
    }
    .tableTop,
    .tableLeft {
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #dddddd;
    }
    .tableRadio {
      margin-top: 10px;
      .star-red {
        color: #ff644c;
      }
      div {
        height: 30px;
        line-height: 30px;
      }
    }
    .radios {
      div {
        display: inline-block;
        margin-left: 1.8rem;
      }
    }
    .other {
      margin-bottom: 2rem;
    }
    .money {
      color: #ff644c;
    }
  }
</style>