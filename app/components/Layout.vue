<template>
  <div>
    <div class="header">
      <div class="title">Orchestra 0.1</div>
      <div class="clock">{{ now }}</div>
    </div>
    <slot />
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'Layout',
    data () {
      return {
        now: moment().format('HH:mm')
      }
    },
    mounted() {
      this.interval = setInterval(this.time, 1000)
    },
    beforeDestroy() {
      clearInterval(this.interval)
    },
    methods: {
      time() {
        this.now = moment().format('HH:mm')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .header {
    background-color: lightgrey;
    display: flex;
    justify-content: space-between;
    padding: 20px;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.3);
    font-size: 20px;
    .title {
      color: white;
      font-weight: bold;
      font-style: italic;
    }
    .clock {
      color: #000;
      font-weight: bold;
    }
  }
</style>
