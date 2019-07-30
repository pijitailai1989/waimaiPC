<template>
  <div class="seller-info">
    <common-header/>
    <seller-header v-if="!error" />
    <div class="main" v-if="!error">
      <!--链接-->
      <div class="header">
        <router-link :to="item.url" :class="{active : index === 2}" v-for="(item, index) in urlList" :key="index">
          {{item.name}}
        </router-link>
      </div>
      <!--证书-->
      <div class="qualification" v-if="!loading">
        <div class="title">{{$t('seller.content.certificate')}}</div>
        <el-row :gutter="20">
          <el-col :span="8" v-for="(item, index) in qualification" :key="index">
            <img class="blur" :src="item" style="cursor: default;">
            <!-- <img :src="item" @click="showImageSwiper(qualification,index)" style="object-fit: cover"> -->
            <!-- <img v-lazy="item" @click="showImageSwiper(qualification,index)" style="object-fit: cover"> -->
          </el-col>
        </el-row>
      </div>
      <!--环境-->
      <div class="environment" v-if="!loading">
        <div class="title">{{$t('seller.content.environment')}}</div>
        <el-row :gutter="20">
          <el-col :span="8" v-for="(item, index) in environment" :key="index">
            <img :src="item" @click="showImageSwiper(environment,index)" style="object-fit: cover">
            <!-- <img v-lazy="item" @click="showImageSwiper(environment,index)" style="object-fit: cover"> -->
          </el-col>
        </el-row>
      </div>
      <!--加载中-->
      <common-loading v-if="loading" />
    </div>
    <common-no-data v-if="error" :message="$t('seller.noSeller')" style="min-height: 580px; padding-top: 100px;" />
    <common-footer v-show="isLoading" />
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import SellerHeader from "../../components/seller/seller-header"

  export default {
    name: "seller-info",
    components: { SellerHeader },
    data() {
      return {
        error: false,
        loading: false,
        isLoading: false,
        qualification: [],
        environment: []
      }
    },
    computed: {
      sellerId() {
        return this.$route.params.id
      },
      urlList() {
        let arr = []
        let { sellerId } = this
        arr[0] = { url: `/seller/${sellerId}`, name: this.$t('seller.content.allGoods') }
        arr[1] = { url: `/seller/rate/${sellerId}`, name: this.$t('seller.content.sellerReviews') }
        arr[2] = { url: `/seller/info/${sellerId}`, name: this.$t('seller.content.Qualification') }
        return arr
      }
    },
    mounted() {
      this.getSellerQualification()
      setTimeout(() => {
        this.isLoading = true
      }, 300);
    },
    methods: {
      ...mapActions('seller', ['ajaxSellerQualification']),
      async getSellerQualification() {
        this.loading = true
        let { sellerId } = this
        let res = await this.ajaxSellerQualification({ sellerId })
        console.log('商家资质', res)
        if (res.code === 1) {
          this.qualification.push(res.data.industryQualificationPicPath)
          this.qualification.push(res.data.subjectQualificationPicPath)
          if(res.data.businessPermitsPicPath){
          this.qualification.push(res.data.businessPermitsPicPath)
          }
          res.data.sellerPicturePath.split(',').forEach(item => {
            this.environment.push(item)
          })
        } else {
          this.error = true
        }
        this.loading = false
      },
      showImageSwiper(imgList, index) {
        this.$imgView({
          list: imgList,
          index: index
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  .blur {    
    -webkit-filter: blur(2px); /* Chrome, Opera */
       -moz-filter: blur(2px);
        -ms-filter: blur(2px);    
            filter: blur(2px); 
  }
  .seller-info {
    .main {
      @include container;
      margin-top: 20px;
      background: #fff;
      .header {
        height: 50px;
        border-bottom: 1px solid #ededed;
        a {
          display: inline-block;
          height: 48px;
          line-height: 48px;
          padding: 0 20px;
          margin: 0 20px;
          &.active,
          &:hover {
            color: $color-primary;
            border-bottom: 2px solid $color-primary;
          }
        }
      }
      .environment,
      .qualification {
        padding: 30px;
        img {
          margin-top: 20px;
          width: 340px;
          height: 200px;
          box-sizing: border-box;
          padding: 10px;
          background: #FAFAFA;
          border: 1px solid #DDDDDD;
          cursor: zoom-in;
        }
      }
      .qualification {
        border-bottom: 1px dashed #ededed;
      }
      .title {
        font-size: 16px;
        color: #666666;
      }
    }
  }
</style>