<template>
  <div :class="`node-info ${isActive ? 'active' : ''}`">
    <div v-if="isActive">
      <h3>Name:</h3>
      {{ node.options.label }}
      <div v-if="node.options.type === 'device'">
        <h3>Status:</h3>
        <div :style="`font-weight: bold; color: ${color}`">{{ node.options.title }}</div>
        <h3>Infos:</h3>
        <div>Current Ouput: {{node.options.state.currentOuput}}</div>
        <div>Min Output: {{node.options.state.minOutput}}</div>
        <div>Max Output: {{node.options.state.maxOutput}}</div>
      </div>
      <div v-else>
        <h3>Childrens:</h3>
        <div class="childrens" v-for="child in children">
          <h4>- {{child.label}}</h4>
          <div v-if="child.type !== 'village'">
            <div :style="`font-weight: bold; color: ${statusColor(child.status)}`">Status: {{child.status}}</div>
          </div>
        </div>
      </div>
      <div v-if="!node.options.legacy" class="form-setup">
        <h3>Setup:</h3>
        <div class="infos-item">
          <div>
            <label for="extractor">Extractors:</label>
            <br/>
            <select id="extractor" v-model="extractor">
              <option value="0">csv</option>
              <option value="1">sql</option>
              <option value="2">modbus</option>
            </select>
          </div>
          <div>
            <label for="ex-opts"></label>
            <br/>
            <select id="ex-opts" v-model="extractorOpts">
              <option value="0">Output</option>
              <option value="1">Maximum Output</option>
            </select>
          </div>
        </div>
        <div class="infos-item">
          <div>
            <label for="insertor">Insertor:</label>
            <br/>
            <select id="insertor" v-model="insertor">
              <option value="0">csv</option>
              <option value="1">sql</option>
              <option value="2">modbus</option>
            </select>
          </div>
          <div>
            <label for="in-opts"></label>
            <br/>
            <select id="in-opts" v-model="insertorOpts">
              <option value="0">Output</option>
            </select>
          </div>
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
      },
      color: {
        default: '#000',
        type: String
      },
      children: {
        default: () => [],
        type: Array
      }
    },
    data () {
      return {
        insertor: 0,
        insertorOpts: 0,
        extractor: 0,
        extractorOpts: 0,
      }
    },
    computed: {
      isActive () {
        return Object.keys(this.node).length > 1
      }
    },
    methods: {
      statusColor (status) {
        switch(status) {
          case 'UNKNOWN':
            return '#999999';
          case 'UNHEALTHY':
            return '#ff4847';
          case 'OFF':
            return '#ff8900';
          default:
            return '#b1ffa4';
        }
      },
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
      margin: 10px 0 0 0;
    }
    h4 {
      margin: 10px 0 0 0;
    }
    &.active{
      left:20px;
    }
    .childrens {
      padding-left: 10px;
    }
    .form-setup {
      display: flex;
      flex-direction: column;
      margin-top: 10px;
      .infos-item {
        display: flex;
        div {
          margin-right: 10px;
        }
      }
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
