<template>
  <div>
    <!--头部-->
    <common-header/>
    <div class="my__order__container clearfix">
      <div class="u-pc-sidebar">
        <!--侧边栏-->
        <side-bar :pageId="pageId"></side-bar>
      </div>
      <div class="order__wrapper u-pc-content">
        <h2 class="content__title">{{$t('order.topTitle')}}</h2>
        <common-no-data type="order" :message="$t('order.error')" v-if="orderList.length === 0 && !loading" />
        <common-loading v-if="loading" />
        <div class="list__container" v-if="orderList.length != 0 && !loading">
          <div class="list__header" v-if="pageId !='9' ">
            <el-row>
              <el-col :span="12">{{$t('order.listHeader.orderInfo')}}</el-col>
              <el-col :span="3">{{$t('order.listHeader.num')}}</el-col>
              <el-col :span="3">{{$t('order.listHeader.amount')}}</el-col>
              <el-col :span="3">{{$t('order.listHeader.status')}}</el-col>
              <el-col :span="3">{{$t('order.listHeader.todo')}}</el-col>
            </el-row>
          </div>
          <card-order v-if="pageId !='9' " v-for="(item, index) in orderList" :key="index" :item="item" :type="orderTypeId" @refreshList="initData" />
          <!-- 新增商品评论列表 -->
          <comment-order v-if="pageId =='9' " @commentList="getCommentList"></comment-order>
          <div class="u-pagination" v-if="parseInt(totalPage)>10 && pageId !='9'" >
            <el-pagination layout="prev, pager, next" :total="totalPage" :current-page="currentPage" @current-change="changePage"></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <common-footer/>
  </div>
</template>
<script>
import SideBar from "../../components/user/side-bar";
import CardOrder from '../../components/order/card-order'
import CommentOrder from '../../components/order/comment-order'
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      orderList: [],
      showCount: 8,
      currentPage: 1,
      totalPage: 0,
      loading: true
    }
  },
  components: { SideBar, CardOrder ,CommentOrder},
  computed: {
    orderTypeId() {
      switch (this.$route.params.type) {
        case 'all':
          return 1;
          break;
        case 'evaluate':
          return 2;
          break;
        case 'refund':
          return 3;
          break;
        // case 'comment':
        //   return 9;
        //   break;
        default:
          return 1;
      }
    },
    pageId() {
      switch (this.$route.params.type) {
        case 'all':
          return '1';
          break;
        case 'evaluate':
          return '2';
          break;
        case 'refund':
          return '3';
          break;
        // 新增我的评价  
        case 'comment':
          return '9';
          break;
        default:
          return '1';
      }
    }

  },
  watch: {
    orderTypeId() {
      this.initData()
    }
  },
  async mounted() {
    await this.initData()
    window.scroll(0,0)
  },
  methods: {
    ...mapActions('order', ['ajaxOrderList']),
    async initData() {
      this.loading = true;
      this.orderList = []
      let type = this.orderTypeId;
      let { showCount, currentPage } = this 
      let res = await this.ajaxOrderList({ showCount, currentPage, status: type })
      console.log('ajaxOrderList',res);
      if (res.code===1) {
        if (this.$checkData(res)) {
          if (!res.data.orderCommentList) return this.loading = false
          this.totalPage = res.data.totalPage * 10
          this.orderList = res.data.orderCommentList
          console.log( 'orderlist',this.orderList)
        }
      } else {
        this.$message.error(res.message)
      }
      
      this.loading = false;
    },
    changePage(page) {
      this.currentPage = page
      this.initData()
      window.scrollTo(0, 0)
    },
    getCommentList () {
      // this.orderList = []
    }
  }
}

</script>
<style scope lang="scss">
.my__order__container {
  @include container;
  margin-top: 20px;
  .order__wrapper {
    .list__container {
      padding: 0 20px;
      .list__header {
        height: 50px;
        line-height: 50px;
        text-align: center;
        background: $bg-gray--light;
      }
      .comment-list {
        .el-row {
            line-height: 50px;
            height: 50px;
            .el-col {
              .el-rate {
                line-height: 50px;
                font-size: 16px;
              }
            }
        }
    }
    }
  }
}

</style>
