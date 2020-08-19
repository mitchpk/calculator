<template>
  <div id="calculator">
    <div id="screen">
      <div ref="screen">
        <span v-if="position == 0" class="blinking" ref="cursor">|</span>
        <span v-for="(item, index) in query" :key="index">{{item}}<span v-if="position == index + 1" class="blinking" ref="cursor">|</span>
        </span>
        <span style="width: 200px; display: inline-block;"></span>
      </div>
      <p>{{error}}</p>
    </div>
    <button @click="add('arcsin ')">arcsin</button>
    <button @click="add('arccos ')">arccos</button>
    <button @click="add('arctan ')">arctan</button>
    <button @click="timetravel('back')">back</button>
    <button @click="timetravel('forward')">forward</button>
    <button @click="add('sin ')">sin</button>
    <button @click="add('cos ')">cos</button>
    <button @click="add('tan ')">tan</button>
    <button @click="add('log ')">log</button>
    <button @click="add('ln ')">ln</button>
    <button @click="add('e')">e</button>
    <button @click="add('π')">π</button>
    <button @click="add('^')">^</button>
    <button @click="add('(')">(</button>
    <button @click="add(')')">)</button>
    <button @click="add('7')">7</button>
    <button @click="add('8')">8</button>
    <button @click="add('9')">9</button>
    <button @click="del">DEL</button>
    <button @click="clear">C</button>
    <button @click="add('4')">4</button>
    <button @click="add('5')">5</button>
    <button @click="add('6')">6</button>
    <button @click="add(' × ')">×</button>
    <button @click="add(' ÷ ')">÷</button>
    <button @click="add('1')">1</button>
    <button @click="add('2')">2</button>
    <button @click="add('3')">3</button>
    <button @click="add(' + ')">+</button>
    <button @click="add(' − ')">−</button>
    <button @click="move('left')">&lt;</button>
    <button @click="add('0')">0</button>
    <button @click="move('right')">&gt;</button>
    <button @click="add('.')">.</button>
    <button @click="run">=</button>
  </div>
</template>

<script>
import Calculator from "../calculator";
const calc = new Calculator();

export default {
  name: "Calculator",
  data() {
    return {
      query: [],
      error: "",
      position: 0,
      history: [],
      historyPosition: 0
    };
  },
  methods: {
    add(c) {
      this.query.splice(this.position, 0, c);
      this.position++;
      this.$nextTick(() => {
        this.$refs.screen.scrollLeft = this.$refs.cursor[0].offsetLeft;
      })
    },
    run() {
      try {
        let tokens = calc.tokenise(this.query.join(""));
        let tree = calc.parse(tokens);
        let result = Array.from(parseFloat(calc.evaluate(tree).toFixed(10)).toString().replace("-", "−"));
        this.position = result.length;
        this.history.push(this.query);
        this.history.push(result.slice(0));
        this.historyPosition = this.history.length - 1;
        this.query = result;
        this.error = "";
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },
    clear() {
      this.query = [];
      this.error = "";
      this.position = 0;
      this.historyPosition = this.history.length;
    },
    del() {
      if (this.position > 0) {
        this.query.splice(this.position - 1, 1);
        this.position--;
      }
    },
    move(dir) {
      if(dir == "right")
        this.position++;
      else this.position--;

      if(this.position < 0) this.position = 0;
      if(this.position > this.query.length) this.position = this.query.length;
    },
    timetravel(dir) {
      let pos;

      if (dir == "back") 
        pos = this.historyPosition - 1;
      else 
        pos = this.historyPosition + 1;

      if(pos < 0) pos = 0;
      if(pos > this.history.length - 1) pos = this.history.length - 1;

      let result = this.history[pos]
      this.historyPosition = pos;

      if(result !== undefined) {
        this.query = result.slice(0);
        this.position = this.query.length;
      } 
    }
  }
};
</script>

<style lang="scss" scoped>
@keyframes blink {
  from, to {
    color: transparent;
  }
  50% {
    color: black;
  }
}

#calculator {
  height: 100%;
  max-width: 600px;
  max-height: 800px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 100px 70px 70px 70px auto;
  gap: 10px;

  #screen {
    grid-column: span 5;

    div {
      font-size: 56px;
      font-weight: 300;
      color: #222;
      overflow: hidden;
      white-space: nowrap;

      .blinking {
        font-weight: 100;
        animation: 1s blink step-end infinite;
        width: 0;
        display: inline-block;
      }
    }
  }

  button {
    border: 1px solid #ddd;
    font-size: 30px;
    font-weight: 500;
    border-radius: 20px;
    background: #ecedef;
    color: #444;
    cursor: pointer;
  }

  button:hover {
    background: #ddd;
  }

  button:active {
    background: #ccc;
    color: black;
  }

  p {
    margin: 0;
    color: #777;
  }
}
</style>
