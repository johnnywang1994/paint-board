<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <h1>Vue Paint Board</h1>
  <ControlPanel v-model="canvasConfig" />
  <PaintBoard :config="canvasConfig" />
</template>

<script>
import { reactive } from 'vue';
import ControlPanel from './components/ControlPanel.vue';
import PaintBoard from './components/PaintBoard.vue';

export default {
  components: {
    ControlPanel,
    PaintBoard,
  },
  data() {
    return {
      showPicker: false,
      canvasConfig: {
        width: 300,
        height: 300,
        strokeStyle: [0, 0, 0],
        lineWidth: 1
      }
    };
  }
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

#app {
  text-align: center;
  .color-board {
    margin: auto;
  }
  canvas {
    display: block;
    margin: 12px auto;
    border: 3px solid #ddd;
    user-select: none;
  }
}
</style>