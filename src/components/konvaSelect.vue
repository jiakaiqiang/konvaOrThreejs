<script setup>
import {onMounted} from "vue";
import Konva from "konva";

 onMounted(() => {
  var stage = new Konva.Stage({
    container: 'container1',
    width: window.innerWidth,
    height: window.innerHeight
  });

  var layer = new Konva.Layer();

  // 添加一些可拖动的矩形到图层
  function createRectangle(x, y, color) {
    return new Konva.Rect({
      x: x,
      y: y,
      width: 100,
      height: 100,
      fill: color,
      draggable: true
    });
  }

  var rect1 = createRectangle(50, 50, 'red');
  var rect2 = createRectangle(200, 150, 'blue');
  var rect3 = createRectangle(350, 50, 'green');

  layer.add(rect1, rect2, rect3);
  stage.add(layer);

  // 临时选区矩形
  let selectionRect;

  function startSelection(pos) {
    selectionRect = new Konva.Rect({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      stroke: 'black',
      strokeWidth: 2,
      fillEnabled: false,
      draggable: false
    });
    layer.add(selectionRect);
    layer.draw();
  }

  function updateSelection(pos) {
    var width = pos.x - selectionRect.x();
    var height = pos.y - selectionRect.y();
    selectionRect.set({
      width: Math.abs(width),
      height: Math.abs(height),
      x: Math.min(pos.x, selectionRect.x()),
      y: Math.min(pos.y, selectionRect.y())
    });
    layer.draw();
  }

  function endSelection() {
    // 在这里处理选中项
    // 假设我们简单地打印出与选区相交的矩形
    var intersected = layer.find('.' + Konva.Util.getRandomColor().toHexString()); // 假设每个矩形都有独特的颜色
    intersected.forEach(function (node) {
      if (selectionRect.intersects(node)) {
        console.log('Selected:', node.name()); // 假设每个矩形都有一个唯一的name属性
      }
    });

    // 清除选区
    selectionRect.remove();
    selectionRect = null;
  }

  var isSelecting = false;
  var startX, startY;

  stage.on('mousedown', function (evt) {
    isSelecting = true;
    startX = evt.evt.clientX - stage.container().offsetLeft;
    startY = evt.evt.clientY - stage.container().offsetTop;
    //startSelection({x: startX, y: startY});
  });

  stage.on('mousemove', function (evt) {
    if (!isSelecting) return;
    var currentX = evt.evt.clientX - stage.container().offsetLeft;
    var currentY = evt.evt.clientY - stage.container().offsetTop;
    //updateSelection({x: currentX, y: currentY});
  });

  stage.on('mouseup', function () {
    if (isSelecting) {
     // endSelection();
      isSelecting = false;
    }
  });
})
</script>

<template>
<div>
  <div id="container1"></div>
</div>
</template>

<style scoped>

</style>