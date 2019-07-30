<template>
  <div>
    <!--头部-->
    <common-header/>
    <div class="refund__detail__container u-detail-box ">
      <div class="clearfix c-detail-header">
        <h2 class="title">{{$t('order.detail.refundDetail')}}</h2>
        <a href="javascript:;" class="back" @click="goBack">{{$t('common.back')}}
          <i class="iconfont icon-enter"></i>
        </a>
      </div>
      <div class="refund__detail__wrapper">
        <common-loading v-if="loading" />
        <common-no-data type="order" :message="$t('common.noOrder')" v-if="noOrder" />
        <el-row v-if="!loading && !noOrder">
          <el-col :span="12">
            <div class="info__list u-small-box">
              <div class="list__item">
                <div class="title">
                  <h2>{{$t('order.detail.refundInfo')}}</h2>
                </div>
                <el-row>
                  <el-col :span="24">
                    <el-form label-width="120px" class="c-form" label-position="left">
                      <el-form-item :label="$t('dialog.refund.refusedReason')" v-if="orderInfo.rerund_status===2">
                        <span>{{$t('dialog.refund.reason')}}</span>
                      </el-form-item>
                      <el-form-item :label="$t('order.detail.label.refundReasons')" v-else>
                        <span>{{refund_reason}}</span>
                      </el-form-item>
                      <el-form-item :label="$t('order.detail.label.refundAmount')" v-if="orderInfo.rerund_status!==2">
                        <span class="refund__money">{{orderInfo.actual_price}}P</span>
                      </el-form-item>
                      <el-form-item :label="$t('order.detail.label.refundType')" v-if="orderInfo.rerund_status!==2">
                        {{$t('order.detail.label.refundTypeText')}}
                      </el-form-item>
                    </el-form>
                  </el-col>
                </el-row>
              </div>
              <div class="list__item">
                <div class="title">
                  <h2>{{$t('order.detail.orderCon')}}</h2>
                </div>
                <el-row class="u-mg-bt-40">
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
                <el-row class="u-mg-bt-40">
                  <el-col :span="24">
                    <el-form label-width="110px" class="c-form" label-position="left">
                      <el-form-item :label="$t('order.detail.label.num')">
                        {{refundDetail.orderMap.orderId}}
                      </el-form-item>
                      <el-form-item :label="$t('order.detail.label.amount')">
                        {{refundDetail.orderMap.totalPrice}}P
                      </el-form-item>
                      <!-- <el-form-item :label="$t('order.detail.label.discount')">
                        {{refundDetail.orderMap.discountMoney}}P ({{$t('order.detail.label.discountText')}})
                      </el-form-item> -->
                      <el-form-item :label="$t('order.detail.pay')">
                        <span class="u-primary">{{refundDetail.orderMap.actualPrice}}P</span>
                      </el-form-item>
                    </el-form>
                    <el-button size="mini" round @click="toOrderDetail" class="todo--btn">{{$t('order.list.toOrderDetail')}}</el-button>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info__step">
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
                    <div class="status u-middle">
                      <span>{{$t('order.detail.step.agreeRefund')}}</span>
                      <p v-if="!isRefund">{{$t('order.detail.step.agreeRefundText')}}</p>
                      <p v-if="isRefund">{{$t("order.detail.step.agreeRefundTexts")}}</p>
                      <p>{{$formatDateTime(refundDetail.listStatus[0].createTime)}}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="step__container" :class="{green:isExamine,gray:!isExamine}">
                <div class="step__wrapper">
                  <div class="icon__wrapper">
                    <i class="iconfont icon-gou"></i>
                  </div>
                  <div class="step__con clearfix">
                    <div class="arrow">
                      <em></em>
                      <span></span>
                    </div>
                    <div class="status u-middle">
                      <span>{{$t('order.detail.step.platExam')}}</span>
                      <p>{{$t('order.detail.step.platExamText')}}</p>
                      <p v-if="isExamine">{{refundDetail.refundFinishTime}}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="step__container" :class="{green:ifRefundSuccess,gray:!ifRefundSuccess}">
                <div class="step__wrapper">
                  <div class="icon__wrapper">
                    <i class="iconfont icon-gou"></i>
                  </div>
                  <div class="step__con clearfix">
                    <div class="arrow">
                      <em></em>
                      <span></span>
                    </div>
                    <div class="status u-middle">
                      <span>{{$t('order.detail.step.refundComplete')}}</span>
                      <p>{{$t('order.detail.step.refundAmountText')}}</p>
                      <p v-if="ifRefundSuccess">{{refundDetail.refundFinishTime}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <common-footer v-show="isLoading" />
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
  export default {
    data() {
      return {
        orderInfo: {
          cancelTime: null,
          refundFinishTime: null
        },
        refundDetail: {},
        ifRefundSuccess: false,
        isExamine: false,
        isRefund: false,
        loading: true,
        isLoading: false,
        noOrder: false,
        getSellerOrderTime: null,
        refund_reason: ''
      }
    },
    computed: {
      link() {
        return '/seller/' + this.orderInfo.seller_id;
      },
      orderId() {
        return this.$route.params.id;
      },
    },
    async mounted() {
      setTimeout(() => {
        this.isLoading = true
      }, 300);
      this.loading = true;
      await this.initData()
      this.refundDetail.listStatus.forEach(item => {
        if (item.rerundStatus === 3) {
          this.isExamine = true
        } else if (item.rerundStatus === 4) {
          this.ifRefundSuccess = true;
        } else if (item.rerundStatus === 2) {
          this.isRefund = true
        }
      });

      this.loading = false;
    },
    methods: {
      ...mapActions('order', ['ajaxRefundDetail', 'ajaxOrderDetail']),
      async initData() {
        let self = this;
        let orderId = this.orderId;
        // console.log('orderId',orderId)
        let res = await this.ajaxRefundDetail({ orderId: orderId })
        console.log('退款详情', res)
        this.refund_reason = res.data.listStatus[0].remark;
        let orderRes = await this.ajaxOrderDetail({ orderId: orderId })
        console.log('订单详情', orderRes)
        self.getSellerOrderTime = orderRes.data.getSellerOrderTime
        if (self.$checkData(res)) {
          self.refundDetail = res.data
          if (res.code === 9004) {
            self.noOrder = true;
            return false;
          }
          if (self.$checkData(orderRes)) {
            self.orderInfo = orderRes.data;
          }
        }
      },
      toOrderDetail() {
        this.$router.push('/user/order/order-detail/' + this.orderId + '/' + this.getSellerOrderTime)
      },
      goBack() {
        this.$router.go(-1)
      }
    }
  }

</script>
<style scope lang="scss">
  .refund__detail__container {
    @include container;
    margin-top: 20px;
    background: #fff;
    .refund__detail__wrapper {
      .info__list {
        border: 1px solid $bd-gray;
        margin-right: 40px;
        min-height: 650px;
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
          .refund__money {
            font-size: 20px;
            color: $color-primary;
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
          height: 239px;
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
                border-color: #FFF transparent transparent;
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
</style>