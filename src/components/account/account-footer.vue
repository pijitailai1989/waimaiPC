<template>
  <div class="account-footer">
    <div class="bottom">
      <p>© 2018 DEPROMO TECHNOLOGY INC.</p>
      <!-- <ul>
        <li @click="hint_fn">{{$t('footer.help')}}</li>
        <li @click="hint_fn">{{$t('footer.feedback')}}</li>
        <li @click="hint_fn">{{$t('footer.privacy')}}</li>
        <li @click="hint_fn">{{$t('footer.clause')}}</li>
      </ul> -->
    </div>
  </div>
</template>

<script>
  export default {
    name: "account-footer",
    props: [],
    components: {},
    data() {
      return {}
    },
    methods: {
      hint_fn() {
        this.$message.error(this.$t('home.function'));
      }
    }
  }
</script>

<style scoped lang="scss">
  .account-footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    margin-bottom: -1px;
    background: #FAFAFA;
    border-top: 1px solid #DDDDDD;
    .bottom {
      @include container;
      line-height: 94px;
      color: #999999;
      font-size: 14px;
      overflow: hidden;
      p {
        text-align: center
        // float: left
      }
      ul {
        float: right;
        li {
          float: left;
          padding: 0 20px;
          position: relative;
          cursor: pointer;
          &:not(:first-child):before {
            content: '';
            height: 14px;
            width: 1px;
            background: #999999;
            position: absolute;
            left: 0;
            top: 40px;
          }
        }
      }
    }
  }
</style>