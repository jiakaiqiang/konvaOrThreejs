<script setup>
import{ onMounted,ref}   from "vue";
import * as THREE from "three"
import{ OrbitControls } from "three/addons/controls/OrbitControls.js";
const lights =  ref(null)
const scene =  new THREE.Scene()



const init  = ()=>{
  //加载模型

  const geometry = new THREE.BoxGeometry(10,10,10)
  //材质
  const material = new THREE.MeshLambertMaterial({
    color:"#ffffff"
  })
//   const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// // 平行光设置产生阴影的光源对象,开启光源阴影的计算功能
//   directionalLight.castShadow = true;
  const ambient = new THREE.AmbientLight('pink');
  scene.add(ambient);
  //mesh
  const mesh =  new THREE.Mesh(geometry, material)
  scene.add(mesh)

  const spriteMaterials = new THREE.SpriteMaterial({
    color:"red",//设置颜色

  });
  const sprite = new THREE.Sprite(spriteMaterials);
  sprite.scale.set(1,1)
  sprite.position.set(5,5,5)

  scene.add(sprite)



  randomS()

  // const group = new THREE.Group();
  // for (let i = 0; i < 16000; i++) {
  //   // 精灵模型共享材质
  //   const sprite = new THREE.Sprite(spriteMaterials);
  //   group.add(sprite);
  //   sprite.scale.set(1, 1, 1);
  //   // 设置精灵模型位置，在长方体空间上上随机分布
  //   const x = 1000 * (Math.random() - 0.5);
  //   const y = 600 * Math.random();
  //   const z = 1000 * (Math.random() - 0.5);
  //   sprite.position.set(x, y, z)
  // }
  // const clock = new THREE.Clock();
  // scene.add(group)
  // function loop() {
  //   // loop()两次执行时间间隔
  //   const t = clock.getDelta();
  //   group.children.forEach(sprite => {
  //     // 雨滴的y坐标每次减t*60
  //     sprite.position.y -= t*60;
  //     if (sprite.position.y < 0) {
  //       sprite.position.y = 600;
  //     }
  //   });
  //   requestAnimationFrame(loop);
  // }
  // loop();


  mesh.castShadow = true;
  //创建相机
  const  camera =  new THREE.PerspectiveCamera(75,lights.value.clientWidth/lights.value.clientHeight,50,10000)
  camera.position.set(50,100,100)
  camera.lookAt(0,0,0)

  //创建渲染
  const renderer = new THREE.WebGLRenderer({
    antialias: true
  })

  renderer.setSize(lights.value.clientWidth, lights.value.clientHeight)
  lights.value.appendChild(renderer.domElement)

  renderer.render(scene, camera)
  const controls =  new OrbitControls(camera,renderer.domElement)
  controls.update()
  function render() {
    //requestAnimationFrame循环调用的函数中调用方法update(),来刷新时间


    renderer.render(scene, camera); //执行渲染操作
    requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
  }
  scene.updateMatrixWorld(true);
  render()
  renderer.domElement.addEventListener('click',function(event){
      const  px =  event.offsetX - lights.value.getBoundingClientRect().left
      const  py =  event.offsetY - lights.value.getBoundingClientRect().top
      const  x =  (px/ lights.value.clientWidth)*2 -1
      const  y =  -(py/ lights.value.clientHeight)*2 + 1
    console.log(x,y)
    //创建射线拾取
    const raycaster =  new THREE.Raycaster()

    //根据点击的xy 重新定义射线
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    //检测射线是否与场景中的物体相交

    const intersects =    raycaster.intersectObjects(scene.children,true);
     console.log(intersects,'intersects')

    if(intersects.length>0){
      intersects[0].object.change()
    }

  })





}
onMounted(() => {
  init()
})
const list  = []
const randomS =  ()=>{
  const texture =  new THREE.TextureLoader().load('./sunpoint.png')
  const spriteMaterial = new THREE.SpriteMaterial({
    color:0x00ffff,//设置颜色
    rotation:Math.PI/4,

  });


  list.forEach(item=>{
    scene.remove(item)
  })
   for(let i=0;i<10;i++){
     // 创建精灵模型对象，不需要几何体geometry参数
     const sprite = new THREE.Sprite(spriteMaterial);
     sprite.change = function(){

       let spriteMaterials =  sprite.material.clone()
       spriteMaterials.color.set(0xff0000)
       sprite.material = spriteMaterials
     }
     sprite.scale.set(10,10)
     list.push(sprite)
     sprite.position.set(i*20*Math.random()+1,i*20*Math.random()+1,i*20*Math.random()+1)
     scene.add(sprite)
   }
}

</script>

<template>
<div>
  <div ref="lights" style="width: 90vw;height: 90vh"></div>
</div>
</template>

<style scoped>

</style>