<template>
  <div>
    <button @click="handleTo" style="color:red;position: absolute;left:10px;top:10px;z-index:10">指定到达</button>
    <div ref="threejsContainer" class="threejs-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
let curve = null
let  sphere = null
const threejsContainer = ref(null);
const handleTo = ()=>{
  sphere.position.set(20,-20,20)
  console.log(sphere.position)

}
onMounted(() => {
  // 创建场景
  const scene = new THREE.Scene();

  // 创建相机
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  // 创建渲染器
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  threejsContainer.value.appendChild(renderer.domElement);

  // 添加轨道控制
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update()

  // 创建路径
 curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-10, 0, 0),
    new THREE.Vector3(0, 10, 0),
    new THREE.Vector3(10, 0, 0),
    new THREE.Vector3(20, 10, 0)
  ]);

  // 创建路径的几何体
  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
  const line = new THREE.Line(geometry, material);
  scene.add(line);

  // 创建模型
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(sphere);

  // 将相机作为模型的子对象
  sphere.add(camera);
  camera.position.set(-10, -10, 1); // 相机相对于模型的位置
  camera.lookAt(sphere.position);
  // 添加环境光
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  // 添加方向光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);

  let t = 0;

  function animate() {
    requestAnimationFrame(animate);

    // 更新模型的位置
    t += 0.001; // 调整这个值来控制运动速度
    if (t > 1) t = 0; // 循环路径

    const pos = curve.getPoint(t);
    sphere.position.set(pos.x,pos.y,pos.z)
   //  const back = new THREE.Vector3();
   //  sphere.getWorldDirection(back)
   //  const v =  new  THREE.Vector3()
   // v.add(pos.multiplyScalar(back))
   //  sphere.position.add(v.clone())
        // 更新相机的方向


    // 渲染场景
    renderer.render(scene, camera);
  }
  renderer.render(scene, camera);
  animate();
});
</script>

<style scoped>
.threejs-container {
  width: 100%;
  height: 100vh;
}
</style>
