<template>
  <layout>
    <div class="wrapper">
      <div v-show="!isLoading">
        <img src="./assets/interlaced.png" id="lamp" width="30" height="30" style="display: none;">
        <div class="derp">Grid</div>
        <div id="mynetwork"></div>
        <node-context :node="currentNode" :config="config" @save="save" :color="statusColor(currentNode.options.status)" :children="getChildren(currentNode.options.id)" />
      </div>
      <lottie v-show="isLoading" :options="defaultOptions" :height="400" :width="400" />
    </div>
  </layout>
</template>

<script>
  import lottie from 'vue-lottie'
  import * as animationData from './data.json';
  import { Network } from 'vis'
  import Layout from './components/Layout.vue'
  import NodeContext from './components/NodeContext.vue'
  import entry from './api/entry.gql'
  export default {
    name: 'App',
    components: { Layout, NodeContext, lottie },
    data () {
      return {
        isLoading: true,
        defaultOptions: {animationData},
        currentNode: {
          options: {
            status: ''
          }
        },
        config: {
          location: '',
          whatever: ''
        },
        entry: {},
        edges: [],
        nodes: []
      }
    },
    apollo: {
      entry: {
        query: entry,
        deep: false,
        update (data) {
          //console.log('Update', data);
          return data;
        },
        result ({ data, loading, networkStatus }) {
          //console.log('Result', data);
          if(data) {
            this.draw(data)
          }
        },
        error (error) {
          console.error('We\'ve got an error!', error);
        },
        loadingKey: 'loadingQueriesCount',
        watchLoading (isLoading, countModifier) {
          // countModifier is either 1 or -1
          console.log(isLoading)
          this.isLoading = isLoading
        },
      },
    },
    methods: {
      draw (graph) {
        console.log('draw');
        const node = { font: { color: "#000" }, margin: 10 };
        const nodes = [];
        const edges = [];

        const stack = [graph.entrypoint];

        while (stack.length) {
          const current = stack.pop();
          if (!nodes.find(node => node.id === current.id)) {
            nodes.push({id: current.id, label: current.name, title: current.name, shape: 'star', color: '#5fa4ff', ...node });
          }
          if (current.villageConnection) {
            current.villageConnection.forEach(elem => {
              stack.push(elem.village);
              if (!nodes.find(node => node.id === elem.village.id)) {
                nodes.push({type: 'village', id: elem.village.id, label: elem.village.name, title: elem.village.name, shape: 'circle', color: '#b1ffa4', ...node });
              }
              edges.push({ from: current.id, to: elem.village.id })
            })
          }
          if (current.deviceConnection) {
            current.deviceConnection.forEach(elem => {
              stack.push(elem.device);
              if (!nodes.find(node => node.id === elem.device.id)) {
                nodes.push({type: 'device', id: elem.device.id, label: elem.device.name, title: elem.device.status, shape: 'box', color: this.statusColor(elem.device.status), status: elem.device.status, ...node });
              }
              edges.push({ from: current.id, to: elem.device.id })
            })
          }
        }

        let that = this;

        const container = document.getElementById('mynetwork');

        const data = {
          nodes: nodes,
          edges: edges
        };
        const options = {interaction:{hover:true}};

        const network = new Network(container, data, options);

        network.on("beforeDrawing",  function(ctx) {
          const img = document.getElementById("lamp");
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.fillStyle = ctx.createPattern(img, 'repeat');
          ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.restore();
        });

        network.on("selectNode", function(e){
          e.event.preventDefault();
          that.currentNode = this.body.nodes[e.nodes[0]]
        });

        network.on("deselectNode", function(e){
          e.event.preventDefault();
          that.currentNode = {
            options: {
              status: ''
            }
          };
          that.config.location = '';
          that.config.whatever= ''
        });
        this.nodes = nodes
        this.edges = edges
      },
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
      getNode(id) {
        return this.nodes.find(node => node.id === id)
      },
      getEdges (id) {
        return this.edges.filter(item => {
          if(item.from === id) {
            return item
          }
        })
      },
      getChildren(id) {
        if(this.currentNode.id) {
          return this.getEdges(id).map(item => this.getNode(item.to))
        }
        return []
      },
      save () {
        // console.log('save', this.currentNode, this.config);
        this.currentNode = {
          options: {
            status: ''
          }
        };
        this.config.location = '';
        this.config.whatever= ''
      }
    }
  }
</script>

<style lang="scss">
  @import './styles/app';
  @import '~vis/dist/vis.min';
  .wrapper {
    height: 100%;
    padding: 20px;
    .derp {
      font-weight: bold;
      font-size: 20px;
      margin-bottom: 10px;
    }
    #mynetwork {
      height: 700px;
      padding: 20px;
      z-index: 1;
    }
  }
</style>
