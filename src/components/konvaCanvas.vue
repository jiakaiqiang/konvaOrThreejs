<template>
  <div id="container">

  </div>

</template>
<script setup>
import {onMounted, reactive} from "vue";
import Konva from "konva";

onMounted(() => {
  init()
})
let starPosition = reactive({})
const  init = () => {
  //创建容器
  const stage = new Konva.Stage({
    container: 'container',
    width: document.body.clientWidth,
    height: 600,

  });

//创建图层
  const layer = new Konva.Layer()

  //框选矩形框
  const selectionRectangle = new Konva.Rect({
    name: "selectionRectangle",
    fill: "rgba(0,0,255,0.5)",

    draggable: true,
    visible: false, // 默认不显示
  });

//创建物品
  const react = new Konva.Rect({
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 2,
    draggable: true
  })
  const react2 = new Konva.Rect({
    width: 1000,
    height: 600,
    fill: '#fafafa',
    stroke: 'black',
    strokeWidth: 2,

  })
  layer.add(react2)
  layer.draw()
  layer.add(selectionRectangle)



  react2.on('mousedown', function () {
    const x1 = stage.getPointerPosition().x;
    const y1 = stage.getPointerPosition().y;
    const x2 = stage.getPointerPosition().x;
    const y2 = stage.getPointerPosition().y;
    starPosition = {
      x1,
      x2,
      y1,
      y2,
    };
    console.log(starPosition)
    selectionRectangle.visible(true)

  })
  react2.on('mousemove', function () {

    const {x1, y1} = starPosition
    const x2 = stage.getPointerPosition().x;
    const y2 = stage.getPointerPosition().y;
    console.log(x1, y1, x2, y2)
    selectionRectangle.setAttrs({
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
    });
    layer.batchDraw();


  })
  react2.on('mouseup', function () {

    setTimeout(() => {
      const copyRect = selectionRectangle.clone();//将当前的进行复制 然后重新添加到layer 中的
      copyRect.setAttrs({
        name: "border",
        borderType: "in",
        fill: "rgba(255,255,255,0.2)",
        stroke: "red",
        strokeWidth: 1,

      });
      layer.add(copyRect);
      layer.batchDraw();
      selectionRectangle.visible(false)
    })
})


    layer.add(react)
    layer.draw();
    stage.add(layer)
    //创建动画
    let date = 100
    const animation = new Konva.Animation(function (frame) {
      if (react.y() > 500) {
        date = 1
      }
      react.y((frame.time / 1000) * date);
    }, layer);
    animation.start();


    //添加图片
    Konva.Image.fromURL('./logo.png', function (image) {
      image.setAttrs({
        x: 200,
        y: 10,
        width: 100,
        height: 100
      })
      layer.add(image)
      layer.draw()
    })

  }

</script>


<style scoped>

</style>