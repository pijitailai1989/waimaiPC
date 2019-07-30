<template>
  <div>
    <!--头部-->
    <common-header/>
    <div class="order__detail__container u-detail-box ">
      <div class="clearfix c-detail-header">
        <h2 class="title">{{$t('order.detail.orderDetail')}}</h2>
        <a href="javascript:;" class="back" @click="goBack">{{$t('common.back')}}
          <i class="iconfont icon-enter"></i>
        </a>
      </div>
      <div class="order__detail__wrapper">
        <common-loading v-if="loading" />
        <common-no-data type="order" :message="$t('common.noOrder')" v-if="noOrder" />
        <el-row v-if="!loading && !noOrder">
          <el-col :span="13">
            <div class="info__list u-small-box">
              <div class="list__item">
                <div class="title">
                  <h2>{{$t('order.detail.orderInfo')}}</h2>
                </div>
                <el-row>
                  <el-col :span="24">
                    <el-form label-width="115px" class="c-form" label-position="left">
                      <el-form-item :label="$t('order.detail.label.status')">
                        <!-- 订单状态展示-TODO -->
                        <span v-if="order_status==1">{{$t('order.status.isComment')}}</span>
                        <span v-if="order_status==2">{{$t('order.status.refunding')}}</span>
                        <span v-if="order_status==3">{{$t('order.status.hasCancle')}}</span>
                        <span v-if="order_status==4">{{$t('order.status.refComplete')}}</span>
                        <span v-if="order_status==5">{{$t('order.status.disComplete')}}</span>
                        <span v-if="order_status==6">{{$t('order.status.hasPay')}}</span>
                        <span v-if="order_status==7">{{$t('order.status.refRefuse')}}</span>
                        <span v-if="order_status==8">{{$t('order.status.distribution')}}</span>
                        <span v-if="order_status==9">{{$t('order.status.sub')}}</span>
                        <span v-if="order_status==11">{{$t('order.status.distribution')}}</span>
                      </el-form-item>
                      <el-form-item :label="$t('order.detail.label.num')">
                        {{orderInfo.id}}
                      </el-form-item>
                      <el-form-item :label="$t('order.detail.label.orderTime')">
                        {{ $formatDateTime (orderInfo.create_time)}}
                      </el-form-item>
                      <el-form-item :label="$t('order.detail.label.type')" v-if="ifPay">
                        {{$t('order.payType.online')}}
                      </el-form-item>
                      <el-form-item :label="$t('order.detail.label.payTime')" v-if="ifPay">
                        {{$formatDateTime(orderInfo.paymentTime)}}
                      </el-form-item>

                      <!-- 退款状态-TODO -->
                      <!-- <el-form-item :label="$t('order.detail.label.refundStatus')" v-if="refundStatus ==2">
                        {{$t('order.detail.step.agreeRefundTexts')}}
                      </el-form-item> -->
                      <el-form-item :label="$t('order.detail.label.refundStatus')" v-if="order_status==2">
                        {{$t('order.detail.step.refunding')}}
                      </el-form-item>
                      <el-form-item :label="$t('order.detail.label.refundStatus')" v-if="order_status==4">
                        {{$t('order.detail.step.refundingComplete')}}
                      </el-form-item>

                    </el-form>
                    <div class="todo--btn" v-if="order_status==1 || order_status==2 || order_status==4 || order_status==6 || order_status==7 || order_status==8 || order_status==9">
                      <!-- 订单状态按钮-TODO -->
                      <template v-if="order_status==9">
                        <el-button round size="mini" @click="toPay()">{{$t('order.list.toPay')}}</el-button>
                      </template>
                      <!-- <template v-if="order_status==8">
                        <el-button round size="mini" @click="toDeliveyDetail()">{{$t('order.list.toDeliveyDetail')}}</el-button>
                      </template> -->
                      <!-- <template v-if="order_status==7">
                        <el-button round size="mini" @click="toDeliveyDetail()">{{$t('order.list.toDeliveyDetail')}}</el-button>
                      </template> -->
                      <template v-if="order_status==4">
                        <el-button round size="mini" @click="toRefundDetail()">{{$t('order.list.toRefundDetail')}}</el-button>
                      </template>
                      <template v-if="order_status==6 || order_status==9">
                        <el-button round size="mini" @click="doCancel()">{{$t('order.list.toCancel')}}</el-button>
                      </template>
                      <template v-if="order_status==8">
                        <el-button round size="mini" @click="toRefund()">{{$t('order.list.toRefund')}}</el-button>
                      </template>
                      <template v-if="order_status==2">
                        <el-button round size="mini" @click="toRefundDetail()">{{$t('order.list.toRefundDetail')}}</el-button>
                      </template>
                      <template v-if="order_status==1">
                        <el-button round size="mini" @click="toEvaluate()">{{$t('order.list.toEvaluate')}}</el-button>
                      </template>

                      <!-- <template v-if="refundStatus===0">
                        <el-button round type="primary" size="mini" @click="toPay" v-if="statusCode===0 && cancelTime!==1">{{$t('order.list.toPay')}}</el-button>
                        <el-button round size="mini" :loading="cancelLoading" @click="doCancel" v-if="(statusCode===0 || statusCode===1) && cancelTime!==1">{{$t('order.list.toCancel')}}</el-button>
                        <el-button round size="mini" @click="toRefund" v-if="statusCode===2 || statusCode===3 || statusCode===4 || statusCode===5">{{$t('order.list.toRefund')}}</el-button>
                        <el-button round size="mini" @click="toEvaluate" v-if="statusCode===6">{{$t('order.list.toEvaluate')}}</el-button>
                        <el-button round size="mini" @click="toEvaluateDetail" v-if="statusCode===8">{{$t('order.list.toEvaluateDetail')}}</el-button>
                      </template>
                      <template v-if="refundStatus!==0 && (statusCode!==7)">
                        <el-button round size="mini" @click="toRefundDetail">{{$t('order.list.toRefundDetail')}}</el-button>
                      </template>
                      <template v-if="refundStatus===4 && getSellerOrderTime!='null'">
                        <el-button round size="mini" @click="toRefundDetail">{{$t('order.list.toRefundDetail')}}</el-button>
                      </template> -->

                    </div>
                  </el-col>
                </el-row>
              </div>
              <div class="list__item">
                <div class="title">
                  <h2>{{$t('order.detail.deliInfo')}}</h2>
                </div>
                <el-row>
                  <el-col :span="24">
                    <el-form label-width="125px" class="c-form" label-position="left">
                      <el-form-item :label="$t('order.detail.label.add')">
                        {{orderInfo.address}} {{orderInfo.house_number}}
                      </el-form-item>
                      <el-form-item :label="$t('order.detail.label.user')">
                        {{orderInfo.name}}
                      </el-form-item>
                      <el-form-item :label="$t('order.detail.label.userName')">
                        {{orderInfo.phone}}
                      </el-form-item>
                      <el-form-item :label="$t('order.detail.label.remark')">
                        {{orderInfo.remark}}
                      </el-form-item>
                    </el-form>
                  </el-col>
                </el-row>
              </div>
              <div class="list__item">
                <div class="title">
                  <h2>{{$t('order.detail.orderCon')}}</h2>
                </div>
                <el-row class="u-mg-bt-20">
                  <el-col :span="10">
                    <router-link :to="link">
                      <img :src="orderInfo.seller_photo">
                    </router-link>
                    <router-link :to="link">
                      <div class="shop__name c-dis-table">
                        <p class="v-middle">{{orderInfo.seller_name}}</p>
                      </div>
                    </router-link>
                  </el-col>
                  <el-col :span="14" class="shop__tel c-dis-table">
                    <p class="v-middle">{{$t('order.detail.label.shopTel')}}: {{orderInfo.sellerPhone}}</p>
                  </el-col>
                </el-row>
                <hr>
                <div class="goods__list__wrapper">
                  <div class="goods__list__header">
                    <el-row>
                      <el-col :span="12">
                        {{$t('order.detail.listHeader.food')}}
                      </el-col>
                      <el-col :span="4">
                        {{$t('order.detail.listHeader.num')}}
                      </el-col>
                      <el-col :span="4">
                        {{$t('order.detail.listHeader.price')}}
                      </el-col>
                      <el-col :span="4">
                        {{$t('order.detail.listHeader.amount')}}
                      </el-col>
                    </el-row>
                  </div>
                  <div class="goods__list__con">
                    <el-row v-for="(item, index) in goodsList" :key="index" :item="item">
                      <el-col :span="12">
                        {{item.goodsName}}
                        <p>
                          <span v-if="item.goodsSpecifications">{{item.goodsSpecifications}}</span>
                          <span v-if="item.goodsSpecifications && item.goodsAttributeLabel">/</span>
                          <span v-if="item.goodsAttributeLabel">{{item.goodsAttributeLabel}}</span>
                        </p>
                      </el-col>
                      <el-col :span="4">
                        {{item.num}}
                      </el-col>
                      <el-col :span="4">
                        {{item.presentPrice}}P
                      </el-col>
                      <el-col :span="4">
                        {{(item.presentPrice * item.num).toFixed(2)}}P
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="12">
                        {{$t('payMent.lunch_box_fee')}}
                      </el-col>
                      <el-col :span="4">
                      </el-col>
                      <el-col :span="4">
                      </el-col>
                      <el-col :span="4">
                        {{orderInfo.total_lunchbox_price}}P
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        {{$t('payMent.freight')}}
                      </el-col>
                      <el-col :span="4">
                      </el-col>
                      <el-col :span="4">
                      </el-col>
                      <el-col :span="4">
                        {{orderInfo.logistics}}P
                      </el-col>
                    </el-row>
                  </div>
                  <hr>
                  <div class="pay__detail">
                    <!-- <p>{{$t('payMent.freight')}}:
                      <span>{{orderInfo.logistics}}P</span>
                    </p> -->
                    <h3>{{$t('order.detail.pay')}}:</h3>
                    <span class="money">{{orderInfo.actual_price}}P</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="11">
            <div class="info__step" v-if="has_tree">
              <div class="step__container green">
                <div class="step__wrapper">
                  <div class="icon__wrapper">
                    <i class="iconfont icon-peisongxiangqing_dingdanicon"></i>
                  </div>
                  <div class="step__con clearfix">
                    <div class="arrow">
                      <em></em>
                      <span></span>
                    </div>
                    <div class="status u-middle" v-if="orderInfo.order_status===7">
                      <span>{{$t('order.status.hasCancle')}}</span>
                      <!-- <p>{{$formatDateTime (orderInfo.create_time)}}</p> -->
                    </div>
                    <div class="status u-middle" v-else>
                      <span>{{$t('order.detail.step.sub')}}</span>
                      <p>{{$formatDateTime (orderInfo.create_time)}}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="step__container" :class="{green:ifTakeOrder,gray:!ifTakeOrder}">
                <div class="step__wrapper">
                  <div class="icon__wrapper">
                    <i class="iconfont icon-peisongxiangqing_shangjiaicon_xuanzhong1"></i>
                  </div>
                  <div class="step__con clearfix">
                    <div class="arrow">
                      <em></em>
                      <span></span>
                    </div>
                    <div class="status u-middle">
                      <span>{{$t('order.detail.step.take')}}</span>
                      <p v-if="ifTakeOrder">{{orderInfo.accessTime}}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="step__container" :class="{green:ifDeliverySuccess,gray:!ifDeliverySuccess}">
                <div class="step__wrapper">
                  <div class="icon__wrapper">
                    <i class="iconfont icon-waimaiyiwancheng"></i>
                  </div>
                  <div class="step__con clearfix">
                    <div class="arrow">
                      <em></em>
                      <span></span>
                    </div>
                    <div class="status u-middle">
                      <span>{{$t('order.detail.step.complete')}}</span>
                      <p v-if="ifDeliverySuccess">{{orderInfo.deliverySuccessTime}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog :title="$t('order.list.toRefund')" :visible.sync="dialogVisible" width="40%" class="detail-dialog">
      <div class="tableTop">{{$t('order.detail.label.num')}}: {{orderInfo.id}}</div>
      <div class="tableLeft">{{$t('order.listHeader.sellerName')}}: {{orderInfo.seller_name}}</div>
      <div class="tableLeft">{{$t('order.detail.label.refundAmount')}}:
        <span class="money"> {{orderInfo.actual_price}}P</span>
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
        <div @click="showStatus = true">
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
    <!-- 取消订单弹框 -->
    <el-dialog :title="$t('common.notic')" :visible.sync="cancelDialogVisible" width="30%">
      <span v-if="orderInfo.order_status===0">{{$t('dialog.cancel')}}</span>
      <span v-else>{{$t('dialog.cancelElse')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialogVisible = false">{{$t('dialog.noCancel')}}</el-button>
        <el-button type="primary" @click="submitCancel">{{$t('order.list.toCancel')}}</el-button>
      </span>
    </el-dialog>
    <common-footer v-show="isLoading" />
  </div>
</template>
<script>
  import { mapActions, mapMutations } from "vuex";
  export default {
    data() {
      return {
        orderInfo: {
          orderTime: null,
          accessTime: null,
          deliverySuccessTime: null,
          activityStatus: null,
          payType: null
        },
        goodsList: [],
        ifTakeOrder: false,
        ifDeliverySuccess: false,
        ifPay: false,
        cancelLoading: false,
        loading: true,
        isLoading: false,
        noOrder: false,
        dialogVisible: false,
        cancelDialogVisible: false,
        showStatus: false,
        radioThe: "",
        radio: this.$t("dialog.refund.moreFood"),
        has_tree: false,
        timer: "",
        order_status: '',
        cancel_status: 1

      };
    },
    computed: {
      cancelTime() {
        let createTime = parseInt(this.orderInfo.create_time / 1000);
        let endTime = createTime + 900;
        let clientTime = parseInt(new Date() / 1000);
        if (endTime < clientTime) {
          this.timer = 1;
        }
        return this.timer;
      },
      link() {
        return "/seller/" + this.orderInfo.seller_id;
      },
      orderId() {
        return this.$route.params.id;
      },
      getSellerOrderTime() {
        return this.$route.params.getSellerOrderTime;
      },
      statusCode() {
        return this.orderInfo.order_status;
      },
      refundStatus() {
        return this.orderInfo.rerund_status;
      },
      payType() {
        let payType = null;
        switch (this.orderInfo.payType) {
          case 0:
            payType = this.$t("order.payType.online");
            break;
          case 1:
            payType = this.$t("order.payType.offline");
            break;
        }
        return payType;
      },
      isComment() {
        return this.orderInfo.isComment;
      }
    },
    async mounted() {
      setTimeout(() => {
        this.isLoading = true;
      }, 300);
      this.loading = true;
      await this.initData();
      console.log("orderInfo:::", this.orderInfo.order_status);
      // 判断是否有流程图
      if (
        this.orderInfo.order_status == 2 ||
        this.orderInfo.order_status == 3 ||
        this.orderInfo.order_status == 4 ||
        this.orderInfo.order_status == 5
      ) {
        this.has_tree = true;
      } else {
        this.has_tree = false;
      }
      if (this.orderInfo.order_status >= 2 && this.orderInfo.order_status != 7) {
        this.ifTakeOrder = true;
      }
      if (
        this.orderInfo.order_status === 6 ||
        this.orderInfo.order_status === 8
      ) {
        this.ifDeliverySuccess = true;
      }
      if (this.orderInfo.paymentTime != null) {
        this.ifPay = true;
      }
      this.loading = false;
      console.log("sellerOrderTimeNum", this.getSellerOrderTime);
    },
    methods: {
      ...mapActions("order", [
        "ajaxOrderDetail",
        "ajaxCancelOrder",
        "ajaxApplyRefund"
      ]),
      ...mapMutations("order", ["clearCart"]),

      order_status_calc() {
        // 订单状态
        let order_status = this.orderInfo.order_status;
        // 退款状态
        let rerund_status = this.orderInfo.rerund_status;
        // 订单取消/退款
        let getSellerOrderTime = this.orderInfo.getSellerOrderTime;

        if (rerund_status == 0 && order_status == 6) {
          // 待评价
          this.order_status = 1;
        } else if (rerund_status == 1 || rerund_status == 3) {
          // 退款中
          this.order_status = 2;
        } else if (
          rerund_status == 0 &&
          order_status == 7 &&
          getSellerOrderTime == null
        ) {
          // 订单已取消
          this.order_status = 3;
          this.cancel_status = 1;
        } else if (
          rerund_status == 4 &&
          order_status == 7 &&
          getSellerOrderTime == null
        ) {
          // 订单已取消
          this.order_status = 3;
          this.cancel_status = 2;
        } else if (rerund_status == 4 && order_status == 7 && getSellerOrderTime != null) {
          // 退款成功
          this.order_status = 4;
        } else if (rerund_status == 0 && order_status == 8) {
          // 订单已完成
          this.order_status = 5;
        } else if (
          rerund_status == 0 &&
          (order_status == 1)
        ) {
          // 等待商家接单
          this.order_status = 6;
        } else if (rerund_status == 2 && order_status == 2) {
          // 订单已拒绝退款
          this.order_status = 11;
        } else if (rerund_status == 2 && order_status == 5) {
          // 订单已拒绝退款
          this.order_status = 11;
        } else if (rerund_status == 2 && order_status == 7) {
          // 订单已拒绝退款
          this.order_status = 7;
        } else if (
          rerund_status == 0 && order_status == 2
        ) {
          // 制作配送中
          this.order_status = 8;
        } else if (
          rerund_status == 0 && order_status == 4
        ) {
          // 制作配送中
          this.order_status = 8;
        } else if (
          (rerund_status == 0 && order_status == 5) ||
          order_status == 3
        ) {
          // 制作配送中
          this.order_status = 8;
        } else if (rerund_status == 0 && order_status == 0) {
          // 待支付
          this.order_status = 9;
        }

        // let status = null;
        // return status;
        // if (this.refundStatus === 0) {
        //   switch (this.orderInfo.order_status) {
        //     // case 0:
        //     //   status = this.$t('order.status.sub')  //订单提交
        //     //   break
        //     case 1:
        //       status = this.$t("order.status.hasPay"); // 已支付
        //       break;
        //     case 2:
        //     case 3:
        //     case 4:
        //     case 5:
        //       status = this.$t("order.status.distribution");
        //       break;
        //     // case 2:
        //     //   status = this.$t('order.status.shopTakeOrder') // 待配送员接单（平台配送才有此状态）
        //     //   break
        //     // case 3:
        //     //   status = this.$t('order.status.deliTakeOrder') //  配送员接单（平台配送才有此状态）
        //     //   break
        //     // case 4:
        //     //   status = this.$t('order.status.deliUnTakeOrder') // 4:配送员未接单(平台配送才有此状态)
        //     //   break
        //     // case 5:
        //     //   status = this.$t('order.status.distribution') // 5 配送中(已取货在配送中)
        //     //   break
        //     case 6:
        //       status = this.$t("order.status.isComment"); // 订单完成 待评价
        //       break;
        //     case 7:
        //       status = this.$t("order.status.hasCancle"); // 订单取消
        //       break;
        //     case 8:
        //       status = this.$t("order.status.commented"); // 评价完成（也算已完成）
        //       break;
        //   }
        //   if (this.orderInfo.order_status === 0 && this.cancelTime !== 1) {
        //     status = this.$t("order.status.sub"); //订单提交
        //   } else if (this.orderInfo.order_status === 0 && this.cancelTime == 1) {
        //     status = this.$t("order.status.hasCancle"); //订单取消
        //   }
        // } else if (this.refundStatus === 4) {
        //   if (this.getSellerOrderTime == "null") {
        //     status = this.$t("order.status.hasCancle");
        //   } else {
        //     // status = this.$t("order.status.refComplete");
        //     status = this.$t("order.status.hasCancle");
        //   }
        // } else {
        //   // switch (this.orderInfo.isRefund) {
        //   switch (this.orderInfo.rerund_status) {
        //     case 1:
        //       status = this.$t("order.status.refunding");
        //       break;
        //     case 2:
        //       status = this.$t("order.status.distribution");
        //       break;
        //     case 3:
        //       status = this.$t("order.status.platExam");
        //       break;
        //     case 4:
        //       status = this.$t("order.status.refComplete");
        //       break;
        //   }
        // }
        // // alert(this.orderInfo.rerund_status)
        // return status;

      },

      async initData() {
        let self = this;
        let orderId = self.orderId;
        let res = await self.ajaxOrderDetail({ orderId: orderId });
        console.log("订单详情", res);
        if (self.$checkData(res)) {
          if (res.code === 9004) {
            self.noOrder = true;
            return false;
          }
          self.orderInfo = res.data;
          this.order_status_calc();
          res.data.Goods.forEach(item => {
            self.goodsList.push(item);
          });
        }
      },
      // 支付订单
      toPay() {
        this.$router.push("/order/pay/" + this.orderId);
      },
      // 取消订单
      async doCancel() {
        this.cancelDialogVisible = true;
      },
      // 提交取消
      async submitCancel() {
        let self = this;
        self.cancelDialogVisible = false;
        let { orderId } = self;
        if (self.cancelLoading) {
          return false;
        }
        self.cancelLoading = true;
        let res = await self.ajaxCancelOrder({ orderId });
        console.log("取消订单", res);
        if (res.code === 1) {
          self.$message.success(this.$t("order.status.hasCancle"));
          self.cancelLoading = false;
          self.clearCart();
          setTimeout(() => {
            self.$router.go(0);
          }, 1500);
          // self.$message({
          //   message: this.$t('order.status.orderCancel'),
          //   type: 'success',
          //   onClose: function() {
          //     self.cancelLoading = false;
          //     self.$router.go(0)
          //   }
          // });
        } else if (res.code === 9999) {
          self.$message.error(res.message);
          setTimeout(() => {
            self.$router.go(0);
          }, 1500);
        }

      },
      //查看退款详情
      toRefundDetail() {
        let url = "/user/order/refund-detail/" + this.orderId;
        this.$router.push(url);
      },
      //查看评价详情
      toEvaluateDetail() {
        let url = "/user/order/evaluate-detail/" + this.orderId;
        this.$router.push(url);
      },
      //去评价
      toEvaluate() {
        let url = "/user/order/evaluate-order/" + this.orderId;
        this.$router.push(url);
      },
      //查看配送详情
      toDeliveyDetail() {
        if (this.orderInfo.deliveryId == null) {
          this.$alert(
            this.$t("order.list.alert.shopDeli") +
            ": " +
            this.orderInfo.sellerPhone,
            this.$t("common.notic"),
            {
              confirmButtonText: this.$t("common.ok"),
              callback: action => { }
            }
          );
        } else {
          let url = "/user/order/delivery-detail/" + this.orderId;
          this.$router.push(url);
        }
      },
      //申请退款
      toRefund() {
        this.dialogVisible = true;
        // this.$alert(this.$t('order.list.alert.refund'), this.$t('common.notic'), {
        //   confirmButtonText: this.$t('order.list.alert.shopTelShow'),
        //   callback: action => {
        //     if (action === 'confirm') {
        //       this.$alert(this.orderInfo.sellerPhone, this.$t('order.list.alert.shopTel'), {
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
      // 确定提交
      async confirm() {
        let remark = "";
        if (this.radioThe) {
          remark = this.radioThe;
        } else {
          remark = this.radio;
        }
        this.cancelLoading = true;
        let res = await this.ajaxApplyRefund({ remark, orderId: this.orderId });
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
      },

      goBack() {
        this.$router.go(-1);
      }
    }
  };
</script>
<style scope lang="scss">
  .order__detail__container {
    @include container;
    margin-top: 20px;
    background: #fff;
    .order__detail__wrapper {
      button {
        margin-left: 0 !important;
        display: block;
      }
      .el-button+.el-button {
        margin-top: 5px;
      }
      .info__list {
        border: 1px solid $bd-gray;
        margin-right: 40px;
        min-height: 990px;
        .list__item {
          margin-bottom: 60px;
          .el-form-item {
            margin-bottom: 0;
          }
          .title {
            padding-bottom: 20px;
            margin-bottom: 20px;
            border-bottom: 1px solid $bd-gray;
            h2 {
              font-size: 16px;
            }
          }
          img {
            width: 50px;
            height: 50px;
            float: left;
            margin-right: 20px;
          }
          .shop__name {
            font-size: 16px;
            color: $imp-color;
            height: 50px;
            overflow: hidden;
          }
          .shop__tel {
            color: #999;
            height: 50px;
            padding-left: 20px;
            word-break: break-all;
          }
          .goods__list__wrapper {
            margin-top: 40px;
            text-align: center;
            .goods__list__header,
            .goods__list__con {
              .el-col {
                &:first-child {
                  text-align: left;
                }
              }
            }
            .goods__list__con {
              p {
                color: #999999;
              }
              margin-top: 20px;
              color: $imp-color;
              .el-col {
                margin-bottom: 20px;
              }
            }
            .pay__detail {
              margin-top: 27px;
              text-align: right;
              p {
                margin-bottom: 10px;
                margin-right: 10px;
              }
              h3 {
                font-size: 16px;
                display: inline-block;
              }
              .money {
                color: $color-primary;
                font-size: 24px;
                margin-left: 10px;
              }
              .oldmoney {
                text-decoration: line-through;
                margin-left: 5px;
              }
            }
          }
          .todo--btn {
            position: absolute;
            top: 5px;
            right: 0;
          }
        }
      }
      .info__step {
        margin-left: 40px;
        .step__container {
          border-left: 1px solid $bd-gray;
          height: 339px;
          .step__wrapper {
            top: 50%;
            transform: translateY(-50%);
          }
          &.green {
            .icon__wrapper {
              border: 1px solid $green;
              .iconfont {
                color: $green;
              }
            }
            .step__con {
              .status {
                span {
                  color: $green;
                }
              }
            }
          }
          &.black {
            .icon__wrapper {
              border: 1px solid $imp-color;
              .iconfont {
                color: $imp-color;
              }
            }
            .step__con {
              .status {
                span {
                  color: $imp-color;
                }
              }
            }
          }
          &.gray {
            .icon__wrapper {
              border: 1px solid $bd-gray;
              .iconfont {
                color: $bd-gray;
              }
            }
            .step__con {
              background: #f5f5f5;
              .status {
                span {
                  color: $bd-gray;
                }
                p {
                  color: $bd-gray;
                }
              }
              .arrow {
                span {
                  border-color: #f5f5f5 transparent transparent;
                }
              }
            }
          }
          .icon__wrapper {
            position: absolute;
            left: -16px;
            background: #fff;
            border-radius: 100%;
            width: 32px;
            height: 32px;
            text-align: center;
            line-height: 32px;
            top: 29px;
          }
          .step__con {
            border: 1px solid $bd-gray;
            border-radius: 4px;
            background: #fff;
            height: 90px;
            padding: 0 30px;
            margin-left: 40px;
            .arrow {
              position: absolute;
              bottom: 52px;
              left: 0;
              transform: rotate(90deg);
              -ms-transform: rotate(90deg);
              /* IE 9 */
              -moz-transform: rotate(90deg);
              /* Firefox */
              -webkit-transform: rotate(90deg);
              /* Safari 和 Chrome */
              -o-transform: rotate(90deg);
              /* Opera */
              em {
                border-color: $bd-gray transparent transparent;
              }
              span {
                border-color: #fff transparent transparent;
                top: -1px;
              }
            }
            .arrow * {
              display: block;
              border-width: 8px;
              position: absolute;
              border-style: solid dashed dashed dashed;
              font-size: 0;
              line-height: 0;
            }
            .status {
              span {
                display: block;
                margin-bottom: 10px;
              }
              p {
                position: relative;
                font-size: 12px;
                color: #666;
                margin-bottom: 10px;
              }
            }
            .time {
              float: right;
              span {
                font-size: 12px;
              }
            }
          }
        }
      }
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
    .radios {
      div {
        // display: inline-block;
        // margin-left: 1.8rem;
      }
    }
    .other {
      margin-bottom: 2rem;
    }
    .tableRadio {
      margin-top: 10px;
      .star-red {
        color: #ff644c;
      }
      div {
        // height: 30px;
        line-height: 30px;
      }
    }
    .money {
      color: #ff644c;
    }
  }
</style>