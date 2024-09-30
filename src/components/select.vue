<template>
  <div ref="threeValue" style="width: 90vw;height: 90vh">

  </div>
  <div ref="tags" style="height:100px;width: 100px;color:'pink';top:0;z-index:2;display: none">
    sfsfsfs
  </div>
</template>
<script setup>
import {onMounted,ref,reactive} from 'vue'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import * as THREE from 'three'
import Stats from 'three/addons/libs/stats.module.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
const stats =  new Stats() //添加帧数
const threeValue =  ref(null)
const tags = ref(null)
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import { CSS2DRenderer,CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
const scene = new THREE.Scene()
const init = () => {


  // const geometry = new THREE.BoxGeometry(10, 10, 10) //长方形

  //自定义物体形状
  const tagObject = new CSS2DObject(tags.value);




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

  // const width = threeValue.value.clientWidth; //canvas画布宽度
  // const height = threeValue.value.clientHeight; //canvas画布高度
  // const k = width / height; //canvas画布宽高比
  // const s = 600;//控制left, right, top, bottom范围大小
  // const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 8000);
  // // 创建渲染器
  camera.position.set(50,100,100)

  const css2Renderer = new CSS2DRenderer();
  css2Renderer.render(scene, camera);

  css2Renderer.setSize(threeValue.value.clientWidth, threeValue.value.clientHeight);

  css2Renderer.domElement.style.position = 'absolute';
  css2Renderer.domElement.style.top = '0px';
  css2Renderer.domElement.style['pointer-events']='none';
  css2Renderer.domElement.style.color= 'red';

  threeValue.value.appendChild(css2Renderer.domElement);
  css2Renderer.render(scene, camera);

  const renderer = new THREE.WebGLRenderer({
    antialias:true,//锯齿状
    alpha: false //设置背景透明
  })
  renderer.setSize(threeValue.value.clientWidth, threeValue.value.clientHeight)
  threeValue.value.appendChild(renderer.domElement)
  //创建控制轨道
  const controls =  new OrbitControls(camera,renderer.domElement)
  controls.update()


  const group1 = new THREE.Group(); //所有高层楼的父对象
  group1.name = "高层";
  for (let i = 0; i < 5; i++) {
    const geometry = new THREE.BoxGeometry(20, 60, 10);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x00ffff,
      clearcoat: 1.0,//物体表面清漆层或者说透明涂层的厚度
      clearcoatRoughness: 0.1,//透明涂层表面的粗糙度
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
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x00ffff,
      clearcoat: 1.0,//物体表面清漆层或者说透明涂层的厚度
      clearcoatRoughness: 0.1,//透明涂层表面的粗糙度
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


      obj.material.color.set(0xffff00);

    }

  });


  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
  directionalLight.position.set(30, 50, 10);
// 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0

  scene.add(directionalLight);
  //添加平行光辅助
  const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5,0xff0000);
  scene.add(dirLightHelper);

  //创建帧渲染
  // threeValue.value.appendChild(stats.domElement)
  // 渲染
  renderer.render(scene, camera)

  //renderer.setClearAlpha(0.8);//设置
  function render() {
    //requestAnimationFrame循环调用的函数中调用方法update(),来刷新时间

    stats.update();
    renderer.render(scene, camera); //执行渲染操作
    if (composer) {
      composer.render();
    }
    requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
  }

  camera.lookAt(0,0,0);
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const outlinePass = new OutlinePass(new THREE.Vector2(threeValue.value.clientWidth, threeValue.value.clientHeight), scene, camera);
  outlinePass.visibleEdgeColor.set(0xff0000); // 可见边缘颜色
  outlinePass.hiddenEdgeColor.set(0xffffff); // 隐藏边缘颜色
  outlinePass.edgeStrength = 5; // 边缘强度
  outlinePass.edgeThickness = 1; // 边缘厚度
  composer.addPass(outlinePass);
  render();
  // 创建场景
  model.updateMatrixWorld(true);
  //窗体改变的时候 渲染改变
  window.onresize=function(){
    console.log(threeValue.value.clientWidth)
    const width = threeValue.value.clientWidth; //canvas画布高度
    const height = threeValue.value.clientHeight; //canvas画布宽度
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

  }
  const axesHelper = new THREE.AxesHelper(100)

  scene.add(axesHelper);

  // 屏幕坐标转标准设备坐标
  renderer.domElement.addEventListener('click',function(event){
    // left、top表示canvas画布布局，距离顶部和左侧的距离(px)
    const px = event.offsetX -  threeValue.value.getBoundingClientRect().left;
    const py = event.offsetY -  threeValue.value.getBoundingClientRect().top;
    //屏幕坐标px、py转标准设备坐标x、y
    //width、height表示canvas画布宽高度
    const x = (px / threeValue.value.clientWidth) * 2 - 1;
    const y = -(py / threeValue.value.clientHeight) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.ray.origin = new THREE.Vector3(-100, 0, 0);
// 设置射线方向射线方向沿着x轴
    raycaster.ray.direction = new THREE.Vector3(1, 1, 0);
    //.setFromCamera()计算射线投射器`Raycaster`的射线属性.ray
    // 形象点说就是在点击位置创建一条射线，射线穿过的模型代表选中
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);



    for (let i = 0; i < model.children.length; i++) {
      const group = model.children[i];
      //递归遍历chooseObj，并给chooseObj的所有子孙后代设置一个ancestors属性指向自己
      group.traverse(function (obj) {
        console.log(obj)
        if (obj.isMesh) {

          obj.ancestors = obj;
        }
      })
    }

    const intersects =    raycaster.intersectObjects(model.children,true);
    console.log("射线器返回的对象", intersects);
    // intersects.length大于0说明，说明选中了模型
    if (intersects.length > 0) {






      // 选中模型的第一个模型，设置为红色
      model.traverse(function(obj) {

        if (obj.isMesh) {//判断条件也可  console.log(obj.geometry.attributes.uv)
          obj.name=='1号楼'&&obj.material.color.set(0xffff00);
          obj.name!='1号楼'&&obj.material.color.set(0x00ffff);
        }
      });

      outlinePass.selectedObjects =[intersects[0].object.ancestors];
      const worldPosition = new THREE.Vector3();
        intersects[0].object.ancestors.getWorldPosition(worldPosition)
      console.log(worldPosition,'----fwefwf')
         tagObject.position.copy(worldPosition);

        intersects[0].object.ancestors.add(tagObject);
        intersects[0].object.material.color.set(0xff0000);


    }
  })
}

onMounted(() => {
  init()
})


</script>
<style lang="scss"></style>