<template>
	<div id="app">
		<router-view/>
	</div>
</template>

<script>
export default {
  name: 'app',
  created() {
    let clientWidth =
      document.documentElement.clientWidth || document.body.clientWidth
    console.log(clientWidth)
    if (clientWidth <= 780) {
      location.href = 'https://dev.loong.ph/h5/'
    }
    let vCodeId = sessionStorage.getItem('vCodeId')
    if (!vCodeId) {
      this.GenNonDuplicateID()
    }
  },
  methods: {
    GenNonDuplicateID() {
      // 生成不会重复的ID
      let idStr = Date.now().toString(36)
      idStr =
        'h5-' +
        idStr +
        Math.random()
          .toString(36)
          .substr(3)
      sessionStorage.setItem('vCodeId', idStr)
      console.log(idStr)
    }
  },
  watch: {
    $route() {
      if (window._czc) {
        var location = window.location
        var content_url = location.pathname + location.hash
        var referer_url = '/'
        // window._czc.push(["_trackPageview", content_url, referer_url]);

        window._czc.push(['_tarckEvent', '登录', '登录-跳转测试'])
        // console.log(window._czc);
      }
    }
  }
}
</script>

<style>
/* 单行省略 */

.single_hide {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>