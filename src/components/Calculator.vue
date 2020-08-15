<template>
  <div>
    <input v-model="query" type="text" @keyup.enter="run" placeholder="Enter an operation" />
    <p v-if="result">{{result}}</p>
  </div>
</template>

<script>
import Calculator from "../calculator";
const calc = new Calculator();

export default {
  name: "Calculator",
  data() {
    return {
      query: "",
      result: ""
    };
  },
  methods: {
    run() {
      try {
        console.log(calc.parse(this.query));
        this.result = calc.evaluateAsFloat(this.query);
      } catch (error) {
        this.result = error.message;
        throw error;
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
