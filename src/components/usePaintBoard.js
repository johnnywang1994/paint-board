import { reactive, ref, watchEffect } from 'vue';

export function createPaintBoard(el, options) {
  return new PaintBoard(el, options);
}

function PaintBoard(el, options) {
  this.$el = el;
  this.$ctx = el.getContext('2d');
  this.$options = options;
  this._isDrawing = ref(false);
  this._position = reactive({x: 0, y: 0});
}

export function initBoard(instance) {
  setListener(instance);
  setCanvasConfig(instance)
}

function setCanvasConfig({ $el, $ctx, $options }) {
  const { width, height, strokeStyle, lineWidth } = $options;
  $el.width = width;
  $el.height = height;
  watchEffect(() => {
    $ctx.strokeStyle = strokeStyle;
  });
  $ctx.lineWidth = lineWidth;
  $ctx.lineJoin = 'round';
  $ctx.lineCap = 'round';
}

function setListener(instance) {
  const { $el } = instance;
  const startDrawing = (e) => {
    instance._isDrawing.value = true;
    instance._position.x = e.offsetX;
    instance._position.y = e.offsetY;
  };
  const drawing = (e) => drawCanvas(e, instance);
  const stopDrawing = () => { instance._isDrawing.value = false };
  $el.addEventListener('mousedown', startDrawing);
  $el.addEventListener('mousemove', drawing);
  $el.addEventListener('mouseup', stopDrawing);
  $el.addEventListener('mouseout', stopDrawing);
}

function drawCanvas(e, instance) {
  const { $ctx, _isDrawing, _position } = instance;
  if (!_isDrawing.value) return;
  $ctx.beginPath();
  $ctx.moveTo(_position.x, _position.y);
  $ctx.lineTo(e.offsetX, e.offsetY);
  $ctx.stroke();
  // 每移動畫完一次就將初始位置設為當前座標
  instance._position.x = e.offsetX;
  instance._position.y = e.offsetY;
}