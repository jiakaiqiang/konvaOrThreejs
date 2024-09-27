<template>
  <div ref="threeValue" style="width: 90vw;height: 90vh">

  </div>
</template>
<script setup>
import {onMounted,ref} from 'vue'
import * as THREE from 'three'
import Stats from 'three/addons/libs/stats.module.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
const stats =  new Stats() //添加帧数
const threeValue =  ref(null)
// 创建场景
const scene = new THREE.Scene()
const init = () => {
  console.log(threeValue.value.clientWidth,threeValue.value.clientHeight)
  //创建物体
  // const geometry = new THREE.BoxGeometry(10, 10, 10) //长方形

  //自定义物体形状


  const geometry = new THREE.BufferGeometry();
  const attribute =  new THREE.BufferAttribute(new Float32Array([ 0, 0, 0, //顶点1坐标
      10, 0, 0, //顶点2坐标
      0, 10, 0, //顶点3坐标
      0, 0, 10, //顶点4坐标
      0, 0, 10, //顶点5坐标
      10, 0, 10,]),3)
  geometry.setAttribute('position',attribute)
  // 每个顶点的法线数据和顶点位置数据一一对应
  const normals = new Float32Array([
    0, 0, 1, //顶点1法线( 法向量 )
    0, 0, 1, //顶点2法线
    0, 0, 1, //顶点3法线
    0, 0, 1, //顶点4法线
    0, 0, 1, //顶点5法线
    0, 0, 1, //顶点6法线
  ]);
// 设置几何体的顶点法线属性.attributes.normal
  geometry.attributes.normal = new THREE.BufferAttribute(normals, 3);
  //定义点模型
 /*

 const material = new THREE.PointsMaterial({
    color: 0xffff00,
    size: 10.0 //点对象像素尺寸
  });

  //const material = new THREE.MeshPhongMaterial({color:'#fafafa'}) //高光材质

  const cube = new THREE.Points(geometry, material)*/

  /*
  * 定义线模型
  * */
  // const material =  new THREE.LineBasicMaterial({
  //   color:'#fafafa',
  //   linewidth:10
  // })
  //
  // const cube = new THREE.Line(geometry,material)
  // const material = new THREE.MeshBasicMaterial({
  //   color:"#fafafa",
  //   side:THREE.DoubleSide, //双面绘制
  //   // transparent:true,//开启透明
  //   // opacity:0.1//透明度
  // })
  // const cube =  new THREE.Mesh(geometry,material)
  //
  // scene.add(cube)
  // 创建相机
  const camera = new THREE.PerspectiveCamera(75, threeValue.value.clientWidth / threeValue.value.clientHeight, 0.1, 1000)
  camera.position.set(50,100,100)
  // 创建渲染器
  const renderer = new THREE.WebGLRenderer({
    antialias:true,//锯齿状
  })
  renderer.setSize(threeValue.value.clientWidth, threeValue.value.clientHeight)
  threeValue.value.appendChild(renderer.domElement)
  //创建控制轨道
  const controls =  new OrbitControls(camera,renderer.domElement)
  controls.update()

  //添加点光源
//   const  pointLight =  new THREE.PointLight('pink');
//   pointLight.position.set(10, 20, 10);
// // // 改变点光源位置，使用OrbitControls辅助观察
// //   pointLight.position.set(-400, -200, -300);
//   const pointLightHelper = new THREE.PointLightHelper(pointLight, 10);
//
//   scene.add(pointLightHelper);
  const group1 = new THREE.Group(); //所有高层楼的父对象
  group1.name = "高层";
  for (let i = 0; i < 5; i++) {
    const geometry = new THREE.BoxGeometry(20, 60, 10);
    const material = new THREE.MeshLambertMaterial({
      color: 0x00ffff
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = i * 30; // 网格模型mesh沿着x轴方向阵列
    group1.add(mesh); //添加到组对象group1
    mesh.name = i + 1 + '号楼';
    // console.log('mesh.name',mesh.name);
  }
  group1.position.y = 30;


  const group2 = new THREE.Group();
  group2.name = "洋房";
// 批量创建多个长方体表示洋房
  for (let i = 0; i < 5; i++) {
    const geometry = new THREE.BoxGeometry(20, 30, 10);
    const material = new THREE.MeshLambertMaterial({
      color: 0x00ffff
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = i * 30;
    group2.add(mesh); //添加到组对象group2
    mesh.name = i + 6 + '号楼';
  }
  group2.position.z = 50;
  group2.position.y = 15;

  const model = new THREE.Group();
  model.name='小区房子';
  model.add(group1, group2);
  model.position.set(-50,0,-25);
  scene.add(model);
  model.traverse(function(obj) {
    console.log('所有模型节点的名称',obj.name,obj.isMesh);
    // obj.isMesh：if判断模型对象obj是不是网格模型'Mesh'
    if (obj.isMesh&&obj.name=='1号楼') {//判断条件也可以是obj.type === 'Mesh'
       console.log(obj.geometry.attributes.uv)
      obj.material.color.set(0xffff00);

    }
  });
  //添加平行光源

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
  directionalLight.position.set(30, 50, 10);
// 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0

  scene.add(directionalLight);
  //添加平行光辅助
  const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5,0xff0000);
  scene.add(dirLightHelper);

  //创建帧渲染
  threeValue.value.appendChild(stats.domElement)
  // 渲染
  renderer.render(scene, camera)

  function render() {
    //requestAnimationFrame循环调用的函数中调用方法update(),来刷新时间

    stats.update();
    renderer.render(scene, camera); //执行渲染操作
    requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
  }
  render();

}

onMounted(() => {
  init()
})

</script>
<style lang="scss"></style>