<template>
  <div class="common-header">
    <el-row class="container">
      <el-col :span="6" class="logo">
        <router-link :to="href_url">
          <img :src="logo" alt="logo">
        </router-link>
      </el-col>
      <el-col :span="7" class="search">
        <!-- 搜索 -->
        <div @keyup.enter="search" v-if="!hide_search">
          <el-input :placeholder="$t('header.search')" suffix-icon="el-icon-search" v-model="keyword"></el-input>
        </div>
      </el-col>
      <el-col :span="10" class="list">
        <div class="list-content">
          <!-- 首页按钮 -->
          <router-link to="/place" v-if="!hide_search">{{$t('header.homePage')}}</router-link>
          <!--未登录-->
          <div v-if="!isLogin">
            <router-link to="/account/login">{{$t('header.login')}}</router-link>
            <router-link to="/account/register">{{$t('header.register')}}</router-link>
          </div>
          <!--已登录-->
          <div class="user" v-if="isLogin && !hide_search">
            <el-dropdown>
              <div class="el-dropdown-link">
                <img :src="userInfo.memberObj.profilePhoto || defaultAvatar" class="avatar"> {{userInfo.userName}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </div>
              <el-dropdown-menu slot="dropdown">
                <router-link to="/user/my-account">
                  <el-dropdown-item>
                    {{$t('header.pesional')}}
                  </el-dropdown-item>
                </router-link>
                <router-link to="/user/my-order/all">
                  <el-dropdown-item>
                    {{$t('sideBar.nav.myOrder')}}
                  </el-dropdown-item>
                </router-link>
                <router-link to="/user/my-address">
                  <el-dropdown-item>
                    {{$t('header.address')}}
                  </el-dropdown-item>
                </router-link>
                <div class="logout" @click="logout">
                  <el-dropdown-item>
                    {{$t('header.logout')}}
                  </el-dropdown-item>
                </div>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="user_login" v-if="isLogin && hide_search">
            <el-dropdown>
              <div class="el-dropdown-link">
                <img :src="userInfo.memberObj.profilePhoto || defaultAvatar" class="avatar"> {{userInfo.userName}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </div>
              <el-dropdown-menu slot="dropdown">
                <router-link to="/user/my-account">
                  <el-dropdown-item>
                    {{$t('header.pesional')}}
                  </el-dropdown-item>
                </router-link>
                <router-link to="/user/my-order/all">
                  <el-dropdown-item>
                    {{$t('sideBar.nav.myOrder')}}
                  </el-dropdown-item>
                </router-link>
                <router-link to="/user/my-address">
                  <el-dropdown-item>
                    {{$t('header.address')}}
                  </el-dropdown-item>
                </router-link>
                <div class="logout" @click="logout">
                  <el-dropdown-item>
                    {{$t('header.logout')}}
                  </el-dropdown-item>
                </div>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <!-- 国际化 -->
          <el-select v-model="value" placeholder="中文" size="small" @change="changeLang($event)">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-col>
      <!-- <el-col :span="3">
        <div class="location">
          <img src="../../assets/icon/icon_locate.png">
          <div class="name" :title="chooseCity?chooseCity:cityName">{{chooseCity ? chooseCity:cityName}}</div> -->
          <!-- <div class="name" v-if="no_location">{{$t('home.location')}}</div> -->
          <!-- <router-link to="/">{{$t('header.switchAdd')}}</router-link>
        </div>
      </el-col> -->
    </el-row>
  </div>
</template>
<script>
  import { mapActions, mapMutations, mapState } from 'vuex'
  import { setCookie, getCookie } from '../../utils.js'
  import logo from '../../assets/img/pic_logo_nav.png'
  import defaultAvatar from '../../assets/img/avatar-male.svg'

  export default {
    name: "common-header",
    props: ['chooseCity'],
    data() {
      return {
        logo,
        defaultAvatar,
        isLogin: false,
        cityName: `${this.$t('home.positioning')}...`,
        keyword: null,
        // userInfo: {},
        // memberInfo: {}
        lang: null,
        options: [{
          value: 'zh',
          label: '中文'
        }, {
          value: 'en',
          label: 'English'
        }],
        value: '',
        no_location: '',
        hide_search: false,
        href_url: ''
      }
    },
    computed: {
      ...mapState('user', ['userInfo']),
    },
    created() {
      
    },
    async mounted() {
      let lang = getCookie('lang')
      this.value = lang
      // 定位信息
      let current_location = localStorage.getItem('current_location');
      console.log(current_location);
      if (!current_location) {
        this.no_location = true;
        this.href_url = '/'
      } else {
        this.no_location = false;
        this.href_url = '/place'
      }
      console.log(this.$route.name);
      if (this.$route.name == 'home') {
        this.hide_search = true;
      } else {
        this.hide_search = false;
      }
      // 是否登录
      if (this.userInfo) {
        this.isLogin = true
      } else {
        this.isLogin = false
      }
      await this.headText()
    },
    methods: {
      ...mapActions('user', ['ajaxLogout']),
      ...mapMutations('user', ['setUser']),
      // async getUserInfo() {
      //   let res = await this.ajaxUserInfo()
      //   console.log('nihai',res)
      //   // this.userInfo = res.data.userObj
      //   this.isLogin = res.code === 1;
      // },
      headText() {
        let location = JSON.parse(localStorage.getItem('location'))
        if (location) {
          this.cityName = location.cityName
        }
        console.log('头部', this.chooseCity)
        if (this.$route.path === '/search') {
          let keyword = sessionStorage.getItem('keyword')
          if (keyword) {
            this.keyword = keyword
          }
        }
        // if (this.userInfo) {
        //   this.isLogin = true
        //   // if (this.isLogin) this.getUserInfo()
        // } else {
        //   this.isLogin = false
        // }
      },
      changeLang(event) {
        console.log('haotaoyan', event)
        // this.value = Event
        this.value = event
        setCookie('lang', event, 365)
        this.$router.go(0);
      },
      async logout() {
        let res = await this.ajaxLogout()
        if (res.code === 1) {
          this.setUser(null)
          this.$router.push('/account/login')
        } else {
          this.$message.error(res.message);
        }
      },
      search() {
        // if (!this.keyword) return
        sessionStorage.setItem('keyword', this.keyword)
        if (this.$route.path !== '/search') {
          this.$router.push('/search')
        } else {
          this.$emit('search')
        }
      }
    }
  }

</script>
<style scoped lang="scss">
  .common-header {
    background: #fff;
    .container {
      // @include container;
      min-width: 1109px;
      max-width: 1250px;
      margin: 0 auto;
      height: 100px;
      box-sizing: border-box;
      overflow: hidden;
    }
    .logo {
      padding: 20px 0;
    }
    .search {
      padding: 30px 0;
    }
    .list {
      overflow: hidden;
      .list-content {
        float: right; // padding: 30px 0;
      }
      div {
        display: inline-block;
        /*padding-left: 20px;*/
        &.user {
          position: relative;
          .avatar {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            float: left;
            margin-top: -5px;
            margin-right: 10px;
          }
        }
        &.user_login {
          position: relative;
          padding: 39px 0;
          .avatar {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            float: left;
            margin-top: -5px;
            margin-right: 10px;
          }
        }
      }
      a {
        display: inline-block;
        height: 100px;
        line-height: 100px;
        margin: 0 20px;
        font-size: 14px;
        box-sizing: border-box;
        &.active {
          border-bottom: 2px solid $text-black;
        }
        &:first-child {
          padding-right: 15px;
        }
      }
      .el-dropdown {
        padding: 0 20px;
        cursor: pointer;
      }
    }
    .location {
      float: right;
      background: #332E2E;
      color: #fff;
      width: 130px;
      height: 100px;
      box-sizing: border-box;
      position: relative;
      img {
        position: absolute;
        top: 20px;
        left: 57px;
      }
      .name {
        position: absolute;
        top: 44px;
        left: 0;
        width: 100%;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 15px;
      }
      a {
        position: absolute;
        top: 69px;
        left: 0;
        width: 100%;
        text-align: center;
        font-size: 10px;
        &:hover {
          color: #c3c3c3;
        }
      }
    }
  }
</style>