<template>
  <div id="app">
    <Calculator />
  </div>
</template>

<script>
import Calculator from "./components/Calculator.vue";

export default {
  name: "App",
  components: {
    Calculator
  }
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

html, body {
  height: 100%;
  margin: 0;
}

* {
  font-family: 'Roboto';
  box-sizing: border-box;
  outline: none;
}

#app {
  height: 100%;
  padding: 20px;
}
</style>
