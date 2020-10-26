<template>
  <div class="color-picker">
    <div
      class="color-hint"
      :style="`background: rgb(${modelValue.join()});`"
      @click="showSelector = !showSelector"
    ></div>
    <div class="color-picker-selector" v-show="showSelector">
      {{onedTemp}}
      <!-- one-d -->
      <div
        class="oned"
        :style="`width: ${barWidth}px;height: ${barHeight}px;`"
        @touchstart.prevent.stop="onOnedDragStart"
        @touchmove.prevent.stop="onOnedDragging"
        @touchend="onOnedDragStop"
        @touchcancel="onOnedDragStop"
        @mousedown="onOnedDragStart"
        @mousemove="onOnedDragging"
        @mouseup="onOnedDragStop"
        @mouseout="onOnedDragStop"
      >
        <div class="oned-pointer" :style="`left: ${pointerPercent}%;`"></div>
        <div class="oned-bg"></div>
      </div>
      <!-- two-d -->
      <div
        class="twod"
        :style="`background: rgb(${onedTemp.join()});height: ${twodHeight}px`"
        @touchstart.prevent.stop="onTwodDragStart"
        @touchmove.prevent.stop="onTwodDragging"
        @touchend="onTwodDragStop"
        @touchcancel="onTwodDragStop"
        @mousedown="onTwodDragStart"
        @mousemove="onTwodDragging"
        @mouseup="onTwodDragStop"
        @mouseout="onTwodDragStop"
      >
        <div
          class="twod-pointer"
          :style="`left: ${twodPercent.x}%;top: ${twodPercent.y}%;`"
        ></div>
        <div class="twod-bg bg1"></div>
        <div class="twod-bg bg2"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOffset } from '../utils';

export default {
  name: 'ColorPicker',
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    barWidth: {
      type: Number,
      default: 300
    },
    barHeight: {
      type: Number,
      default: 50
    },
    twodHeight: {
      type: Number,
      default: 160,
    },
  },
  data() {
    return {
      showSelector: false,
      onedDragging: false,
      twodDragging: false,
      onedX: 0,
      twodX: this.barWidth,
      twodY: 0,
      onedTemp: [0, 0, 0], // stores color as an copy
      breakPoints: [0, 17, 33, 50, 66, 83, 100]
    };
  },
  computed: {
    pointerPercent() {
      return this.onedX / this.barWidth * 100;
    },
    twodPercent() {
      const vm = this;
      return {
        x: vm.twodX / vm.barWidth * 100,
        y: vm.twodY / vm.twodHeight * 100
      };
    }
  },
  methods: {
    // tools
    getFromTo(index) {
      const { breakPoints } = this;
      return {
        from: breakPoints[index - 1],
        to: breakPoints[index]
      };
    },
    updateModelValue(nV) {
      const { fixTwoDAxis: fix } = this;
      // fix axis for modelValue
      this.modelValue[0] = fix(nV[0]);
      this.modelValue[1] = fix(nV[1]);
      this.modelValue[2] = fix(nV[2]);
    },
    // One-d Events
    onOnedDragStart(e) {
      this.onedDragging = true;
      this.onOnedDragging(e);
    },
    onOnedDragging(e) {
      if (!this.onedDragging) return;
      const { x } = getOffset(e);
      if (x <= this.barWidth) {
        // move pointer
        if (x < 0) {
          this.onedX = 0;
        } else {
          this.onedX = x;
        }
        // change rgb by percent
        this.handleOnedColor();
      }
    },
    onOnedDragStop() {
      this.onedDragging = false;
    },
    // One-d Color
    handleOnedColor() {
      const { pointerPercent: per, breakPoints, getFromTo } = this;
      const min = 0;
      const max = 255;
      let nV;

      if (per >= breakPoints[5]) {
        const { from, to } = getFromTo(6);
        nV = [max, min, Math.ceil((to - per) / (to - from) * max)];
      } else if (per >= breakPoints[4]) {
        const { from, to } = getFromTo(5);
        nV = [Math.ceil((per - from) / (to - from) * max), min, max];
      } else if (per >= breakPoints[3]) {
        const { from, to } = getFromTo(4);
        nV = [min, Math.ceil((to - per) / (to - from) * max), max];
      } else if (per >= breakPoints[2]) {
        const { from, to } = getFromTo(3);
        nV = [min, max, Math.ceil((per - from) / (to - from) * max)];
      } else if (per >= breakPoints[1]) {
        const { from, to } = getFromTo(2);
        nV = [Math.ceil((to - per) / (to - from) * max), max, min];
      } else {
        const { from, to } = getFromTo(1);
        nV = [max, Math.ceil((per - from) / (to - from) * max), min];
      }
      // store temp data
      this.onedTemp = nV;
      // emit v-model
      this.updateModelValue(nV);
    },
    // Two-d events
    onTwodDragStart(e) {
      this.twodDragging = true;
      this.onTwodDragging(e);
    },
    onTwodDragging(e) {
      const vm = this;
      if (!vm.twodDragging) return;
      const { x, y } = getOffset(e);
      // move pointer
      if (x <= this.barWidth) {
        vm.twodX = x < 0 ? 0 : x;
      }
      if (y <= this.twodHeight) {
        vm.twodY = y < 0 ? 0 : y;
      }
      // change rgb by percent
      vm.handleTwodColor();
    },
    onTwodDragStop() {
      this.twodDragging = false;
    },
    // Two-d Color
    fixTwoDAxis(v) {
      const { twodPercent: { x: twodXPer, y: twodYPer } } = this;
      const xFix = (v) => (255 - v) * (100 - twodXPer) / 100 + v;
      const yFix = (v) => v * (100 - twodYPer) / 100;
      return Math.ceil(yFix(xFix(v)));
    },
    handleTwodColor() {
      const {
        onedTemp: temp,
      } = this;
      this.updateModelValue(temp);
    }
  },
};
</script>

<style lang="scss">
.color-picker {
  display: inline-block;
  width: 100%;
  height: 100%;
  user-select: none;
  .color-hint {
    width: 100%;
    height: 100%;
  }

  .color-picker-selector {
    position: absolute;
    padding: 8px 12px;
    background: #fff;
    box-shadow: 3px 2px 5px 0 rgb(153, 153, 153);
    border-radius: 5px;
    transform: translateZ(4px);
    @media screen and (max-width: 992px) {
      position: fixed;
      max-width: 300px;
      right: 0;
      left: 0;
      bottom: 16px;
      margin: auto;
    }

    .oned {
      position: relative;
      display: flex;
      align-items: center;
      @media screen and (max-width: 992px) {
        width: auto !important;
        max-width: 300px;
      }
      .oned-pointer {
        position: absolute;
        width: 10px;
        height: 80%;
        top: 0;
        bottom: 0;
        margin: auto;
        border: 2px solid #000;
        transform: translateX(-50%);
        cursor: pointer;
        pointer-events: none;
      }
      .oned-bg {
        width: 100%;
        height: 70%;
        background: linear-gradient(
          to right,
          red 0%,
          #ff0 17%,
          lime 33%,
          cyan 50%,
          blue 66%,
          #f0f 83%,
          red 100%
        );
      }
    }

    .twod {
      position: relative;
      width: 100%;
      margin-top: 8px;
      .twod-pointer {
        position: absolute;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid rgb(0, 0, 0);
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 2;
      }
      .twod-bg {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 3px;
        &.bg1 {
          background: linear-gradient(
            to right, 
            white 0%,
            rgba(255,255,255,0) 100%
          );
          z-index: 0;
        }
        &.bg2 {
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0) 0%,
            black 100%
          );
          z-index: 1;
        }
      }
    }
  }
}
</style>