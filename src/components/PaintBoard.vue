<template>
  <canvas
    @touchstart="startDrawing"
    @touchmove="drawCanvas"
    @touchend="stopDrawing"
    @touchcancel="stopDrawing"
    @mousedown="startDrawing"
    @mousemove="drawCanvas"
    @mouseup="stopDrawing"
    @mouseout="stopDrawing"
  />
</template>

<script>
import { watchEffect } from 'vue';
import { getOffset, fixBody } from '../utils';

export default {
  name: 'PaintBoard',
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      ctx: {},
      _isDrawing: false,
      _position: {
        x: 0,
        y: 0
      }
    };
  },
  methods: {
    initBoard() {
      this.ctx = this.$el.getContext('2d');
      this.setCanvasConfig();
    },
    setCanvasConfig() {
      const vm = this;
      const { $el, ctx } = vm;
      // width, height change will cause repaint
      // so seperated from other config
      watchEffect(() => {
        const { width, height } = vm.config;
        $el.width = width;
        $el.height = height;
      });
      watchEffect(() => {
        const { strokeStyle, lineWidth } = vm.config;
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
      });
    },
    // event listener
    startDrawing(e) {
      const vm = this;
      const { x, y } = getOffset(e);
      vm._isDrawing = true;
      vm._position.x = x;
      vm._position.y = y;
      fixBody(true);
    },
    drawCanvas(e) {
      const vm = this;
      const { ctx, _isDrawing, _position } = vm;
      if (!_isDrawing) return;
      const { x, y } = getOffset(e);
      ctx.beginPath();
      ctx.moveTo(_position.x, _position.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      // 每移動畫完一次就將初始位置設為當前座標
      vm._position.x = x;
      vm._position.y = y;
    },
    stopDrawing() {
      this._isDrawing = false;
      fixBody(false);
    },
  },
  mounted() {
    this.initBoard();
  },
};
</script>

<style lang="scss">
body.lockScroll {
}
</style>