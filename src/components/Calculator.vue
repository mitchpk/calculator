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
        let tokens = calc.tokenise(this.query);
        let tree = calc.parse(tokens);
        let result = calc.evaluate(tree);
        this.result = parseFloat(result.toFixed(10)).toString();
      } catch (error) {
        this.result = error.message;
        throw error;
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
