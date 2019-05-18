<template>
  <div :class="`node-info ${isActive ? 'active' : ''}`">
    <div v-if="isActive">
      <h3>Title:</h3>
      {{ node.options.title }}
      <div v-if="node.options.type === 'legacy'" class="form-setup">
        <h3>Setup:</h3>
        <div>
          <label for="location">Location:</label>
          <br/>
          <input id="location" type="text" v-model="config.location" />
        </div>
        <div>
          <label for="wtf">Something whatever:</label>
          <br/>
          <input id="wtf" type="text" v-model="config.whatever" />
        </div>
        <div>
          <button @click="save">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'NodeContext',
    props: {
      config: {
        default: {
          location: '',
          whatever: ''
        },
        type: Object
      },
      node: {
        default: {},
        type: Object
      }
    },
    computed: {
      isActive () {
        return Object.keys(this.node).length > 1
      }
    },
    methods: {
      save () {
        this.$emit('save')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .node-info {
    z-index: 2;
    position: absolute;
    height: 300px;
    width: 200px;
    left:-500px;
    top: 80px;
    padding: 20px;
    border-radius:20px;
    border: 1px solid lightgrey;
    box-shadow: 5px 5px 10px 0 rgba(0,0,0,0.5);
    background-color: #fff;
    transition: left 0.4s ease-out;
    h3 {
      margin: 0;
    }
    &.active{
      left:20px;
    }
    .form-setup {
      display: flex;
      flex-direction: column;
      margin-top: 10px;
      div {
        margin-bottom: 10px;
        label {
          font-weight: bold;
          text-decoration: underline;
        }
      }
    }
  }
</style>
