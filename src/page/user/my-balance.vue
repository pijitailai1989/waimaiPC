<template>
  <div>
    <!--头部-->
    <common-header/>
    <div class="balance__container clearfix">
      <div class="u-pc-sidebar">
        <!--侧边栏-->
        <side-bar pageId="4"></side-bar>
      </div>
      <div class="balance__wrapper u-pc-content">
        <div class="top__header no-bd">
          <h2>{{$t('sideBar.subNav.balance')}}</h2>
          <common-loading v-if="loading" />
          <div class="balance__detail" v-else>
            <span class="money">{{balance}}P</span>
            <!-- <el-button type="primary" size="small" plain>提现</el-button>
            <el-button type="primary" size="small">充值</el-button> -->
          </div>
        </div>
        <div class="u-panel transaction__wrapper nobt">
          <div class="tran__header">
            <h2>{{$t('accountInfo.transactionRecord')}}</h2>
            <!-- <div class="u-float-r">
              <el-radio-group v-model="transactionType" @change="getBalanceList">
                <el-radio label="0">所有记录</el-radio>
                <el-radio label="1">充值记录</el-radio>
                <el-radio label="2">提现记录</el-radio>
              </el-radio-group>
            </div> -->
          </div>
          <div class="tran__list">
            <el-table :data="tranData" :empty-text="noData">
              <el-table-column prop="createTime" :label="$t('accountInfo.transactionTime')">
              </el-table-column>
              <el-table-column prop="accountType" :label="$t('accountInfo.transactionType')">
              </el-table-column>
              <el-table-column prop="money" :label="$t('accountInfo.transactionMoney')">
              </el-table-column>
              <el-table-column prop="name" :label="$t('accountInfo.transactionMode')">
              </el-table-column>
              <el-table-column :label="$t('order.listHeader.todo')">
                <template slot-scope="scope">
                  <el-button round size="mini" @click="showBalanceDetails(scope.row)">{{$t('order.list.orderDetail')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="u-pagination" v-if="parseInt(totalPage)>10">
              <el-pagination layout="prev, pager, next" :total="totalPage" :current-page="currentPage" @current-change="changePage"></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <common-footer/>
    <el-dialog :title="$t('order.list.detail')" :visible.sync="tranDetailsVisible" class="c-dialog" width="600px">
      <el-form ref="form" label-width="165px" class="c-form" label-position="left">
        <el-form-item :label="item.label" v-for="item in tranDataDetail" :key="item.index">
          <span>{{item.data}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="tranDetailsVisible = false">{{$t('common.back')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
  import SideBar from "../../components/user/side-bar";
  export default {
    data() {
      return {
        noData: this.$t('accountInfo.loading'),
        transactionType: '0',
        balance: '',
        tranData: [],
        tranDataDetail: [],
        showCount: 8,
        currentPage: 1,
        totalPage: 0,
        balanceId: null,
        tranDetailsVisible: false,
        loading: true
      }
    },
    components: { SideBar },
    async mounted() {
      await this.getBalance();
      await this.getBalanceList();
      // console.log(this.$formatDateTime(15249114560000,'ymd'))
      window.scroll(0, 0)
    },
    methods: {
      ...mapActions('user', ['ajaxAccountBalance', 'ajaxBalanceLog']),
      async getBalance() {
        let self = this;
        self.loading = true;
        let res = await this.ajaxAccountBalance();
        if (self.$checkData(res)) {
          console.log('我的余额', res)
          self.balance = res.data.accountBalance;
          self.balanceId = res.data.id
          console.log(self.balanceId)
        }
        self.loading = false;
      },

      async getBalanceList() {
        let self = this;
        // let type = self.transactionType;
        self.tranData = [];
        self.noData = this.$t('accountInfo.loading')
        let { showCount, currentPage, balanceId } = self
        let res = await self.ajaxBalanceLog({ showCount, currentPage, id: balanceId, status: 0 })
        console.log('BalanceLog', res)
        if (self.$checkData(res)) {
          self.totalPage = res.data.totalPage * 10
          self.tranData = res.data.balanceLog
          for (let i = 0; i < this.tranData.length; i++) {
            this.tranData[i].createTime = this.$formatDateTime(this.tranData[i].createTime)
          }
        }
        console.log('self.tranData', self.tranData)
        if (self.tranData.length === 0) {
          self.noData = this.$t('accountInfo.notCount')
        }
      },
      showBalanceDetails(item) {
        console.log(item.money);
        this.tranDataDetail = [{
          label: this.$t('order.listHeader.todo'),
          data: item.accountType
        }, {
          label: this.$t('accountInfo.result'),
          data: item.name
        }, {
          label: this.$t('accountInfo.transactionMoney'),
          data: item.money
        }, {
          label: this.$t('accountInfo.createTime'),
          data: this.$formatDateTime(item.createTime)
        }, {
          label: this.$t('accountInfo.transactionNum'),
          data: item.orderNo
        }];
        this.tranDetailsVisible = true;
      },
      changePage(page) {
        this.currentPage = page
        this.getBalanceList()
        window.scrollTo(0, 0)
      }
    }
  }

</script>
<style scope lang="scss">
  .balance__container {
    @include container;
    margin-top: 20px;
    .balance__wrapper {
      min-height: 0;
      background: none;
      .top__header {
        background: #fff;
        margin-bottom: 20px;
        h2 {
          margin-bottom: 15px;
        }
        .balance__detail {
          .money {
            font-size: 38px;
            color: $imp-color;
            margin-right: 50px;
          }
          button {
            position: relative;
            bottom: 9px;
          }
        }
      }
      .transaction__wrapper {
        min-height: 642px;
        .tran__header {
          padding: 20px;
          h2 {
            font-size: 16px;
            display: inline-block;
          }
        }
        .tran__list {
          padding: 0 20px 20px 20px;
          th,
          td {
            text-align: center;
          }
          thead {
            th {
              background: $bg-gray--light;
              color: rgba(102, 102, 102, 0.50);
            }
            .cell {
              font-weight: 500;
            }
          }
        }
      }
    }
  }

  .tran__detail__wrapper {
    width: 400px;
    margin: 0 auto;
  }
</style>