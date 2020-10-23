<template>
  <div class="color-board">
    <br />
    <div class="color-board__wrapper">
      <span
        v-for="color in colorList"
        :key="`c_i_${color}`"
        :style="`background: rgb(${color.join()});`"
        :class="{ active: modelValue.join() === color.join() }"
        @click="$emit('update:modelValue', [
          color[0],
          color[1],
          color[2] 
        ])"
      ></span>
      <!-- Color Picker -->
      <span>
        <ColorPicker v-model="modelValue" />
      </span>
    </div>
  </div>
</template>

<script>
import ColorPicker from './ColorPicker.vue';

export default {
  name: 'ColorBoard',
  props: {
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  components: {
    ColorPicker,
  },
  data() {
    return {
      colorList: [
        [255, 0, 0],
        [0, 0, 255],
        [255, 255, 0],
        [128, 128, 128],
        [128, 0, 128],
        [255, 192, 203],
        [0, 0, 0]
      ]
    };
  },
}
</script>

<style lang="scss">
.color-board {
  max-width: 500px;
  user-select: none;
  &__wrapper {
    display: inline-flex;
    justify-content: center;
    border: 1px solid #000;
    > span {
      display: block;
      width: 40px;
      height: 40px;
      cursor: pointer;
      &.active {
        position: relative;
        border: 3px solid #ffffff;
        &::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          width: 10px;
          height: 20px;
          border: solid #ffffff;
          border-width: 0 5px 5px 0;
          transform: rotate(45deg);
        }
      }
    }
  }
}
</style>