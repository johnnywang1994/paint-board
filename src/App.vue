<template>
  <img alt="Vue logo" src="./assets/logo.png" />
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
  setup() {
    const canvasConfig = reactive({
      width: 300,
      height: 300,
      strokeStyle: 'red',
      lineWidth: 1
    });
    return { canvasConfig };
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