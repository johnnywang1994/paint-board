<template>
  <div class="control-panel">
    <div class="stroke-style">
      <ColorBoard v-model="modelValue.strokeStyle" />
      Line Width:(1-20)
      <input
        type="range"
        min="1"
        max="20"
        v-model="modelValue.lineWidth"
      />
      {{ modelValue.lineWidth }}
    </div>
    <div class="board-resizer">
      Lock:(Lock board size)
      <input type="checkbox" v-model="lockSize" />
      <br />
      Width:(100-1000)
      <input
        type="range"
        min="100"
        max="1000"
        v-model="modelValue.width"
        :disabled="lockSize"
      />
      {{ modelValue.width }}
      <br />
      Height:(100-1000)
      <input
        type="range"
        min="100"
        max="1000"
        v-model="modelValue.height"
        :disabled="lockSize"
      />
      {{ modelValue.height }}
    </div>
  </div>
</template>

<script>
import ColorBoard from './ColorBoard.vue';

export default {
  components: {
    ColorBoard
  },
  props: {
    // config => bind v-model
    modelValue: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      lockSize: false,
    };
  },
};
</script>

<style>

</style>