<template>
  <div id="welcome">
    <h2>欢迎使用索真报告网页化系统1.0版 </h2>

  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: {
        welcome:'欢迎使用索真报告网页化系统1.0版',
        title:'用户的一封信',

      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}


 #welcome{
   height: 100%;
   width: 100%;
   position: relative;
   h2{
     width: 800px;
     font-size: 50px;
     color: #f8505d;
     text-align: center;
     position: absolute;
     left: 50%;
     top: 50%;
     /*background: yellowgreen;*/
     transform: translate(-50% , -50%);
     font-weight: bold;
   }
 }
</style>
