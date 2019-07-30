<template>
  <div class="page-404">
    <div class="panel">
      <img src="../assets/img/404.png" alt="" width="400" height="300">
      <h2>{{$t('notFindPlace.notFind')}}</h2>
      <h3>{{$t('notFindPlace.shall')}}<span>{{time}}{{$t('notFindPlace.second')}}</span>{{$t('notFindPlace.back')}}</h3>
    </div>
  </div>
</template>

<script>
  export default {
    name: "page-404",
    data() {
      return {
        time: 5
      }
    },
    mounted() {
      let timer = setInterval(() => {
        if (this.time <= 0) {
          clearInterval(timer)
          this.$router.push('/place')
        } else {
          this.time -= 1
        }
      }, 1000)
    },
    methods: {}
  }
</script>

<style scoped lang="scss">
  .page-404 {
    .panel {
      width: 400px;
      margin: 30px auto 0;
      color: #666;
      img {
        display: block;
        margin-bottom: 20px;
      }
      h2 {
        margin-bottom: 5px;
      }
      h2,
      h3 {
        text-align: center;
        span {
          color: orangered;
        }
      }
    }
  }

</style>
