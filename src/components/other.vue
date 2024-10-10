<script setup>
import {onMounted,ref,reactive} from "vue";
import TWEEN from '@tweenjs/tween.js';
import * as THREE  from 'three'
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
const threeValue = ref(null)
//创建场景
const scene = new THREE.Scene()
const  keywordMap =  reactive({
  keyW:false
})
const init=()=>{
  // 创建物体
  const geometry =  new THREE.BoxGeometry(1,1,1)

  //创建材质
  const material = new THREE.MeshBasicMaterial({color: 0x00ff00})

  //创建网格模型
  const mesh =  new THREE.Mesh(geometry,material)

  //添加网格模型到场景中
  scene.add(mesh)

  // 创建相机
  const camera = new THREE.PerspectiveCamera(75,   threeValue.value.clientWidth/threeValue.value.clientHeight, 0.1, 1000)
  camera.position.set(10, 10, 10);
  camera.lookAt(0, 0, 0);

  //生成可视化的小球。
  const A =  new THREE.Vector3(0,3,0)
  const B =  new THREE.Vector3(8,0,0)
  const meshA =  createMesh(0x00ff00,1)
  meshA.position.copy(A)

  const meshB = createMesh(0x00ff00,1)
     meshB.position.copy(B)
  function createMesh(color,r){
    const box =  new THREE.CircleGeometry(r)
    const  material = new THREE.MeshBasicMaterial({color})
    const mesh =  new THREE.Mesh(box,material)
    return mesh



  }
  const group = new THREE.Group()
  group.add(meshA,meshB)
  scene.add(group)
  //生成箭头
  const AB =  B.clone().sub(A)
  const L =  AB.length()
  //生成向量的方向
  const dir =  AB.clone().normalize()
  //生成箭头
  const arrowHelper =  new THREE.ArrowHelper(dir,A,L)
group.add(arrowHelper)












//   const dir = new THREE.Vector3();
//   camera.getWorldDirection(dir);// 获取相机的视线方向
// // dis表示相机沿着相机视线方向平移200
//   const dis = dir.clone().multiplyScalar(20);
// // 相机动画:平移前坐标——>平移后坐标
//   new TWEEN.Tween(camera.position)
//       .to(camera.position.clone().add(dis), 3000)
//       .start()
  // 创建渲染器
  const renderer = new THREE.WebGLRenderer({antialias: true})
  renderer.setSize(threeValue.value.clientWidth, threeValue.value.clientHeight)
//   const angle = THREE.MathUtils.radToDeg(Math.PI);
//   console.log('Math.PI',angle);
//   const tes = THREE.MathUtils.degToRad(30);
//   console.log('test',tes)
//   // 获取DOM元素并添加到场景中
//   const A = new THREE.Vector3(30, 30, 0);// 人起点A
// // walk表示运动的位移量用向量
//   const walk = new THREE.Vector3(100, 50, 0);
//   const b =  A.clone().add(walk)
//   console.log('mu',A.clone().multiplyScalar(2))
//   console.log(b,'test')
  threeValue.value.appendChild(renderer.domElement)
  //创建轨道控制器
  const controls =  new OrbitControls(camera,renderer.domElement)
  controls.update()
  const  clock =  new THREE.Clock()
const v =  new THREE.Vector3(0,0,3)
  // 循环渲染
  function animate() {
    if(keywordMap.keyW){
     let datetime =  clock.getDelta()
      const depo =v.clone().multiplyScalar(datetime)
      group.position.add(depo)
    }
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    TWEEN.update();
  }
  animate()
}
onMounted(()=>{
  init()
})
document.addEventListener('keydown', (event) => {
  if(event.keyCode==87){
    keywordMap.keyW = true
  }
  console.log(event,keywordMap.keyW,'-wefwefwef')
});
</script>

<template>
  <div ref="threeValue" style="width: 90vw;height: 90vh">

  </div>
</template>

<style scoped>

</style>