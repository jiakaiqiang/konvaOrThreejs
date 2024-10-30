<template>
<div ref="threeValueskeys" style="width: 90vw;height: 90vh">

</div>
</template>
<script setup>
import { ref,onMounted} from 'vue'
import * as THREE from 'three'
import {GLTFLoader}  from 'three/examples/jsm/loaders/GLTFLoader.js'
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

//相机辅助线


const clock = new THREE.Clock();
const threeValueskeys = ref(null)
const  mixer = ref(null)
onMounted(()=>{
  init()
})

const scene =  new THREE.Scene()
const init = () =>{

  //创建坐标轴线
  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)
  //加载模型
  const loader = new GLTFLoader()
  loader.load(
    'model.gltf',
    function ( gltf ) {
      console.log(gltf)
      if(gltf.scene){
        gltf.scene.name='Box'
        gltf.scene.traverse(function(obj) {
          if (obj.isMesh) {//判断是否是网格模型

            obj.material = new THREE.MeshBasicMaterial({
              color:0x00ff00
            });



          }
        });
        const times = [0, 3, 6]; //时间轴上，设置三个时刻0、3、6秒
// times中三个不同时间点，物体分别对应values中的三个xyz坐标
        const values = [0, 0, 0, 10,10,10, 0, 0, 0];
// 0~3秒，物体从(0,0,0)逐渐移动到(100,0,0),3~6秒逐渐从(100,0,0)移动到(0,0,100)
        const posKF = new THREE.KeyframeTrack('Box.position', times, values);
// 从2秒到5秒，物体从红色逐渐变化为蓝色
        const colorKF = new THREE.KeyframeTrack('Box.material.color', [2, 5], [1, 0, 0, 0, 0, 1]);
// 1.3 基于关键帧数据，创建一个clip关键帧动画对象，命名"test"，持续时间6秒。
        const clip = new THREE.AnimationClip("test", 6, [posKF, colorKF])
        mixer.value = new THREE.AnimationMixer(gltf.scene);
        const clipAction = mixer.value.clipAction(clip);
//.play()控制动画播放，默认循环播放
        clipAction.play();
        scene.add(gltf.scene)


        render()
      }

    },
  )

  //
  const camera =  new THREE.PerspectiveCamera( 75,  threeValueskeys.value.clientWidth / threeValueskeys.value.clientHeight, 0.1, 1000 )
  //设置相机的位置
  camera.position.set(-10,-10,-2)


  scene.add(camera)
  //创建渲染器
  const renderer =  new THREE.WebGLRenderer()

   renderer.setSize(threeValueskeys.value.clientWidth,threeValueskeys.value.clientHeight)
  threeValueskeys.value.appendChild(renderer.domElement)


  //创建轨道控制器
  const controls = new OrbitControls(camera,renderer.domElement)
  controls.update()



   function render(){
     const frameT = clock.getDelta();
     // 更新播放器相关的时间
     mixer.value.update(frameT);
    renderer.render(scene,camera)
     requestAnimationFrame(render)
     controls.update()
   }

}


</script>
<style scoped>

</style>