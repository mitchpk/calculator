<template>
    <div id="calculator">
      <input v-model="query" type="text" @keyup.enter="run" placeholder="0" />
      <button @click="add('sin')">sin</button>
      <button @click="add('cos')">cos</button>
      <button @click="add('tan')">tan</button>
      <button @click="add('log')">log</button>
      <button @click="add('ln')">ln</button>
      <button @click="add('e')">e</button>
      <button @click="add('π')">π</button>
      <button @click="add('^')">^</button>
      <button @click="query = query.substr(0, position - 1) + query.substr(position)">DEL</button>
      <button @click="query = ''">AC</button>
      <button @click="add('7')">7</button>
      <button @click="add('8')">8</button>
      <button @click="add('9')">9</button>
      <button @click="add('(')">(</button>
      <button @click="add(')')">)</button>
      <button @click="add('4')">4</button>
      <button @click="add('5')">5</button>
      <button @click="add('6')">6</button>
      <button @click="add('×')">×</button>
      <button @click="add('÷')">÷</button>
      <button @click="add('1')">1</button>
      <button @click="add('2')">2</button>
      <button @click="add('3')">3</button>
      <button @click="add('+')">+</button>
      <button @click="add('−')">−</button>
      <button @click="add('0')">0</button>
      <button @click="add('.')">.</button>
      <button @click="run" style="grid-column: span 3;">=</button>
      <p v-if="error">{{error}}</p>
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
      error: "",
      position: 0
    };
  },
  methods: {
    add(c) {
      this.query += c;
      this.position++;
    },
    run() {
      try {
        let tokens = calc.tokenise(this.query);
        let tree = calc.parse(tokens);
        let result = calc.evaluate(tree);
        this.query = parseFloat(result.toFixed(10)).toString();
        this.error = "";
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#calculator {
  height: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;

  button {
    font-size: 24px;
    border-radius: 20px;
    border: 1px solid #777;
    background: white;
  }

  button:active {
    background: #eee;
  }

  input {
    grid-column: span 5;
    height: 65px;
    text-align: right;
    font-size: 56px;
    padding-right: 10px;
    font-weight: 300;
    background: none;
    border: none;
    color: #222;
    outline: none;
  }

  p {
    grid-column: span 5;
  }
}
</style>
