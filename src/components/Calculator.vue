<template>
  <div>
    <input
      v-model="query"
      type="text"
      @keyup.enter="run"
      placeholder="Enter an operation"
    />
  </div>
</template>

<script>
export default {
  name: "Calculator",
  data() {
    return {
      query: ""
    };
  },
  methods: {
    run() {
      this.query = this.query.split(" ").join("");
    }
  }
};
</script>

<style lang="scss" scoped></style>
