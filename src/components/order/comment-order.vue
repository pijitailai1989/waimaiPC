<template>
    <div>
        <common-no-data type="order" :message="$t('order.error')" v-if="commentList.length === 0 && !loading && !commetLoading" />
        <common-loading v-if="loading && !commetLoading" />
        <div class="list__header" v-if="commentList.length != 0 && !loading">
            <el-row>
              <el-col :span="4">{{$t('order.listHeader.sellerName')}}</el-col>
              <el-col :span="3">{{$t('order.listHeader.sellerRate')}}</el-col>
              <el-col :span="5">{{$t('order.listHeader.commentContent')}}</el-col>
              <el-col :span="4">{{$t('order.listHeader.commentGoods')}}</el-col>
              <el-col :span="3">{{$t('order.listHeader.commentTime')}}</el-col>
              <el-col :span="5">{{$t('order.listHeader.todo')}}</el-col>
            </el-row>
        </div>
        <div class="comment-list" style="text-align:center">
            <el-row v-for="item in commentList" :key="item.id">
              <el-col :span="4">{{ item.sellerName }} </el-col>
              <el-col :span="3">
                  <el-rate v-model="item.orderScore" disabled disabled-void-color="#C6D1DE" :colors="rateColor" ></el-rate>  
              </el-col>
              <el-col :span="5"> &nbsp;{{ item.userDesc }}</el-col>
              <el-col :span="4"> &nbsp;{{item.recommendGoodsName}} </el-col>
              <el-col :span="3"> {{$formatDateTime(item.createTime,'ymd') }}</el-col>
              <el-col :span="3">
                <router-link :to="'/user/order/evaluate-detail/'+item.orderId">{{$t('order.list.toEvaluateDetail')}}</router-link>
              </el-col>
              <el-col :span="2"><span @click="deleteEval" class="evalDel">{{$t('common.delete')}}</span></el-col>
            </el-row>
        </div>
        <div class="u-pagination" v-if="parseInt(total)>10 ">
            <el-pagination layout="prev, pager, next" :total="total" :current-page="parseInt(currentPage)" @current-change="changePage"></el-pagination>
        </div>
        <el-dialog :title="$t('common.notic')" :visible.sync="centerDialogVisible" width="25%" center class="deleteComment">
            <span>{{$t('payMent.deleteCom')}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">{{$t('common.cancel')}}</el-button>
                <el-button type="primary" @click="confirmed">{{$t('common.ok')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    import commonNoData from '../common/common-no-data'

    export default {
        data() {
            return {
                rateColor: ['#FF644C', '#FF644C', '#FF644C'],                
                currentPage: '1',
                showCount: '8',
                total: 0,
                commentList: [],
                commentId:'',
                loading: false,
                centerDialogVisible: false,
                commetLoading: true
            }
        },
        mounted () {
            this.getComment()
        },
        methods: {
            ...mapActions('order', ['ajaxComment', 'ajaxDelComment']),
            // 获取商品评论列表
            async getComment () {
                let {currentPage,showCount} = this;
                let res = await this.ajaxComment({currentPage,showCount});
                console.log('评论列表',res)
                if (this.$checkData(res)) {
                    this.commetLoading = false
                    this.commentList = res.data.userCommentList;
                    this.commentList.forEach(elem=> {
                        this.commentId = elem.commentId
                    })
                    // console.log('this.commentId', this.commentId)
                }
                this.total =  res.data.totalPage * 10
                if (this.commentList.length==0) {
                    this.$emit('commentList')
                }
                console.log('商品评论列表',this.commentList);
            },
            deleteEval() {
                this.centerDialogVisible = true
            },
            async confirmed () {
                let {commentId} = this
                let res = await this.ajaxDelComment({commentId})
                console.log(res)
                if (res.code===1) {
                    this.centerDialogVisible = false
                    this.$message.success(res.message)
                    this.getComment()
                }else {
                    this.$message.error(res.message);
                }
            },
            changePage (page) {
                this.currentPage = page;
                this.getComment();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .comment-list {
        .el-row {
            .el-col {
                @include text-over;
                .el-rate {
                    height: 50px;
                }
                .evalDel {
                    color: #FF3633;
                    cursor: pointer;
                }
            }
        }
    }
     
    
</style>


