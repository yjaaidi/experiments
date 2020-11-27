<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <Hello />
  </div>
</template>

<script>
import { Vue } from 'vue-property-decorator';
import Hello from '@vue-demo/hello';

export default Vue.extend({
  components: {
    Hello,
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
