<template>
  <div class="wrapper">
    <div class="derp">Hello motherfucker</div>
    <div id="mynetwork"></div>
    <div v-if="Object.keys(currentNode).length > 1" class="node-info">
      HELLO
      <br>
      {{ currentNode.options.title }}
    </div>
  </div>
</template>

<script>
  import { DataSet, Network } from 'vis'
  export default {
    name: 'App',
    data () {
      return {
        currentNode: {}
      }
    },
    mounted () {
      this.draw()
    },
    methods: {
      draw () {
        console.log('draw')
        let that = this
        const nodes = new DataSet([
          {id: 1, label: 'Mathilde', title: 'Machine learning shit', color: '#ff0000', shape: 'star', font: { color: "#000", strokeWidth: 1, strokeColor: '#fff', margin: 10 }, margin: 10},
          {id: 2, label: 'Ched', title: 'Data Science', color: '#000000', shape: 'circle', font: { color: "#fff", strokeWidth: 1, strokeColor: '#000000' }, margin: 10},
          {id: 3, label: 'Valentin', title: 'Back dev', color: '#0000ff', shape: 'box', font: { color: "#fff", strokeWidth: 1, strokeColor: '#000000' }, margin: 10},
          {id: 4, label: 'Romain', title: 'Front dev', color: '#ffa500', shape: 'hexagon', font: { color: "#000", strokeWidth: 1, strokeColor: '#fff' }, margin: 10},
          {id: 5, label: 'Brendan', title: 'Engineer', color: '#ffff00', shape: 'triangle', font: { color: "#000", strokeWidth: 1, strokeColor: '#fff' }, margin: 10}
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

        network.on("selectNode", function(e){
          // functionality for popup to show on mouseover
          e.event.preventDefault()
          that.currentNode = this.body.nodes[e.nodes[0]]
        });

        document.querySelector('#mynetwork').addEventListener('click', () => {
          console.log(this.currentNode)
        })
      }
    }
  }
</script>

<style lang="scss">
  @import './styles/app';
  @import '~vis/dist/vis.min';
  .wrapper {
    height: 100%;
    .derp {
      font-weight: bold;
      font-size: 20px;
      margin-bottom: 10px;
    }
    #mynetwork {
      height: 400px;
      padding: 20px;
      z-index: 1;
    }
    .node-info {
      z-index: 2;
      position: absolute;
      height: 300px;
      width: 200px;
      left:200px;
      top:20px;
      padding: 20px;
      border-radius:20px;
      border:1px dotted #000;
      background-color: #fff;
    }
  }
</style>
