<template>
  <div class="color-board">
    <div class="color-board__wrapper">
      <span
        v-for="color in colorList"
        :key="`c_i_${color}`"
        :style="`background: ${color};`"
        :class="{ active: modelValue === color }"
        @click="$emit('update:modelValue', color)"
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ColorBoard',
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      colorList: ['red', 'blue', 'yellow', 'black', 'grey', 'purple', 'pink'],
    };
  },
}
</script>

<style lang="scss">
.color-board {
  max-width: 500px;
  &__wrapper {
    display: flex;
    > span {
      display: block;
      width: 50px;
      height: 50px;
      &.active {
        border: 3px solid black;
      }
    }
  }
}
</style>