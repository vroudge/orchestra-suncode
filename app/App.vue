<template>
  <layout>
    <div class="wrapper">
      <img src="./assets/interlaced.png" id="lamp" width="30" height="30" style="display: none;">
      <div class="derp">This is it bois</div>
      <div id="mynetwork"></div>
      <node-context :node="currentNode" :config="config" @save="save" />
    </div>
  </layout>
</template>

<script>
  import { DataSet, Network } from 'vis'
  import Layout from './components/Layout.vue'
  import NodeContext from './components/NodeContext.vue'
  export default {
    name: 'App',
    components: { Layout, NodeContext },
    data () {
      return {
        currentNode: {},
        config: {
          location: '',
          whatever: ''
        }
      }
    },
    mounted () {
      this.draw()
    },
    methods: {
      draw () {
        console.log('draw');
        let that = this;
        const nodes = new DataSet([
          {id: 1, label: 'Mathilde', title: 'Machine learning shit', color: '#ff0000', shape: 'star', font: { color: "#000", strokeWidth: 1, strokeColor: '#fff', margin: 10 }, margin: 10, type: 'new'},
          {id: 2, label: 'Victor', title: 'Team leader', color: '#f801ff', shape: 'circle', font: { color: "#000" }, margin: 10, type: 'new'},
          {id: 3, label: 'Valentin', title: 'Back dev', color: '#0000ff', shape: 'box', font: { color: "#fff", strokeWidth: 1, strokeColor: '#000' }, margin: 10, type: 'legacy'},
          {id: 4, label: 'Romain', title: 'Front dev', color: '#ffa500', shape: 'hexagon', font: { color: "#000", strokeWidth: 1, strokeColor: '#fff' }, margin: 10, type: 'new'},
          {id: 5, label: 'Brendan', title: 'Engineer', color: '#ffff00', shape: 'triangle', font: { color: "#000", strokeWidth: 1, strokeColor: '#fff' }, margin: 10, type: 'new'}
        ]);

        // create an array with edges
        const edges = new DataSet([
          {from: 1, to: 3},
          {from: 1, to: 2},
          {from: 2, to: 4},
          {from: 2, to: 5}
        ]);

        // create a network
        const container = document.getElementById('mynetwork');

        // provide the data in the vis format
        const data = {
          nodes: nodes,
          edges: edges
        };
        const options = {interaction:{hover:true}};

        // initialize your network!
        const network = new Network(container, data, options);

        network.on("beforeDrawing",  function(ctx) {
          //const img = new Image();
          //img.src = './assets/interlaced.png';
          const img = document.getElementById("lamp")
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.fillStyle = ctx.createPattern(img, 'repeat');
          ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.restore();
        });

        network.on("selectNode", function(e){
          // functionality for popup to show on mouseover
          e.event.preventDefault();
          that.currentNode = this.body.nodes[e.nodes[0]]
        });

        network.on("deselectNode", function(e){
          // functionality for popup to show on mouseover
          e.event.preventDefault();
          that.currentNode = {};
          that.config.location = '';
          that.config.whatever= ''
        });
      },
      save () {
        console.log('save', this.currentNode, this.config);
        this.currentNode = {};
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
