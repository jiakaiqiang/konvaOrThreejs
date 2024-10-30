<script setup>
import {onMounted,ref,reactive} from "vue";
import TWEEN from '@tweenjs/tween.js';
import * as THREE  from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { OctreeHelper } from 'three/examples/jsm/helpers/OctreeHelper.js';
import { Octree } from 'three/examples/jsm/math/Octree.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// 引入cannon-es
import * as CANNON from 'cannon-es';
const threeValue = ref(null)
//创建场景
const scene = new THREE.Scene()
let leftButtonBool = ref(false)
const  keywordMap =  reactive({
  keyW:false,
  keyS:false,
  keyA:false,
  keyD:false
})
let  object = {}

const init=()=> {


  // 添加网格辅助工具
  scene.add( new THREE.GridHelper(100, 100, 0.01, 0x00ff00))


  const world = new CANNON.World();
// 设置物理世界重力加速度
// world.gravity.set(0, -9.8, 0);
  world.gravity.set(0, -50, 0);

  const sphereMaterial = new CANNON.Material()
// 物理小球：对应threejs的网格小球
  const body = new CANNON.Body({
    mass: 0.3,//碰撞体质量
    material: sphereMaterial,//碰撞体材质
    shape: new CANNON.Sphere(1.5)
  });

  body.position.y = 100;
  world.addBody(body);

// 物理地面
  const groundMaterial = new CANNON.Material()
  const groundBody = new CANNON.Body({
    mass: 0, // 质量为0，始终保持静止，不会受到力碰撞或加速度影响
    shape: new CANNON.Plane(),
    material: groundMaterial,
  });
// 改变平面默认的方向，法线默认沿着z轴，旋转到平面向上朝着y方向
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);//旋转规律类似threejs 平面
  world.addBody(groundBody);

// 设置地面材质和小球材质之间的碰撞反弹恢复系数
  const contactMaterial = new CANNON.ContactMaterial(groundMaterial, sphereMaterial, {
    restitution: 0.7, //反弹恢复系数
  })
// 把关联的材质添加到物理世界中
  world.addContactMaterial(contactMaterial)




  // 创建物体
  const geometry = new THREE.BoxGeometry(1, 1, 1)

  //创建材质
  const material = new THREE.MeshBasicMaterial({color: 0x00ff00})

  //创建网格模型
  const mesh = new THREE.Mesh(geometry, material)
  const worldOctree = new Octree();
// 分割模型，生成八叉树节点
  worldOctree.fromGraphNode(mesh);
  //添加网格模型到场景中
  scene.add(mesh)
  const helper = new OctreeHelper( worldOctree );
  scene.add( helper );
  // 创建相机
  const camera= new THREE.PerspectiveCamera(75, threeValue.value.clientWidth / threeValue.value.clientHeight, 0.1, 1000)


  // //生成可视化的小球。
  // const A = new THREE.Vector3(0, 3, 0)
  // const B = new THREE.Vector3(8, 0, 0)
  // const meshA = createMesh(0x00ff00, 1)
  // meshA.position.copy(A)
  //
  // const meshB = createMesh(0x00ff00, 1)
  // meshB.position.copy(B)

  function createMesh(color, r) {
    const box = new THREE.CircleGeometry(r)
    const material = new THREE.MeshBasicMaterial({color})
    const mesh = new THREE.Mesh(box, material)
    return mesh


  }

  //加载模型
  const gltfLoader = new GLTFLoader();
 gltfLoader.load(
      'model.gltf',
      (gltf) => {

        if(gltf.scene){
          gltf.scene.traverse(function(obj) {
          object = gltf.scene
            if (obj.isMesh) {//判断是否是网格模型
              obj.material = new THREE.MeshBasicMaterial({
                color:0x00ff00
              });
            }
          });
          scene.add(object)
          object.add(camera)
          camera.position.set(0, 0.5, 1);
          camera.lookAt(0, 0.5, 1);
          render()
        }
        // 监听图片加载完成，创建纹理对象
      }
  )



  // group.add(meshA, meshB)

  // //生成箭头
  // const AB = B.clone().sub(A)
  // const L = AB.length()
  // //生成向量的方向
  // const dir = AB.clone().normalize()
  // //生成箭头
  // const arrowHelper = new THREE.ArrowHelper(dir, A, L)
  // group.add(arrowHelper)


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
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.update()

// 用三维向量表示玩家角色(人)运动漫游速度
  const v = new THREE.Vector3(0, 0, 0);//初始速度设置为0
  const a = 12;//WASD按键的加速度：调节按键加速快慢
  const damping = -0.1;//阻尼 当没有WASD加速的时候，人、车等玩家角色慢慢减速停下来
// 渲染循环
  const clock = new THREE.Clock();

  function render() {
    const deltaTime = clock.getDelta();
    if (keywordMap.keyW) {
      //先假设W键对应运动方向为z
      const front = new THREE.Vector3();
      object.getWorldDirection(front)
      console.log(front,'front')
      if (v.length() <4) {//限制最高速度
        // W键按下时候，速度随着时间增加
        v.add(front.multiplyScalar(-a * deltaTime));
      }
    }

    if(keywordMap.keyS){
      const back = new THREE.Vector3();
      object.getWorldDirection(back)
      if (v.length() <4) {//限制最高速度
        // W键按下时候，速度随着时间增加
        v.add(back.multiplyScalar( a * deltaTime));
      }
    }

    if(keywordMap.keyD){
      //定义绕着y轴旋转
      const front = new THREE.Vector3();
      //获取相机的方向
      object.getWorldDirection(front);
      const up = new THREE.Vector3(0, 1, 0);//y方向

      const left = up.clone().cross(front);
      v.add(left.multiplyScalar(a * deltaTime));
    }
    if(keywordMap.keyA){

      const front = new THREE.Vector3();
      object.getWorldDirection(front);
      const up = new THREE.Vector3(0, 1, 0);//y方向
      //叉乘获得垂直于向量up和front的向量 左右与叉乘顺序有关,可以用右手螺旋定则判断，也可以代码测试结合3D场景观察验证
      const right = front.clone().cross(up);
      v.add(right.multiplyScalar(a * deltaTime));
    }


    world.step(1/60);//更新物理计算
    mesh.position.copy(body.position);// 网格小球与物理小球位置同步
    // 阻尼减速
    v.addScaledVector(v, damping); // v乘damping的这个变量 再和v 相加再复制给a

    //更新玩家角色的位置  当v是0的时候，位置更新也不会变化
    const deltaPos = v.clone().multiplyScalar(deltaTime);

    object.position.add(deltaPos);
    //作为子元素然后实现目标跟随的状态


    renderer.render(scene, camera);
    requestAnimationFrame(render);
    TWEEN.update()
  }


  document.addEventListener('mousemove',function(event){
    object.rotation.y -= event.movementX / 600;
    camera.rotation.x -= event.movementY / 600;
  })
}
onMounted(()=>{
  init()
})

document.addEventListener('keydown', (event) => {
  console.log(event.keyCode,'wewe')
  leftButtonBool.value = true;
  if(event.keyCode==87){
    keywordMap.keyW = true
  }
  if(event.keyCode==83){
    keywordMap.keyS= true
  }
  if(event.keyCode==65){
    keywordMap.keyA=true
  }
  if(event.keyCode==68){
    keywordMap.keyD=true
  }

});
document.addEventListener('keyup', (event) => {
  leftButtonBool.value = false
  if(event.keyCode==87){
    keywordMap.keyW = false
  }
  if(event.keyCode==83){
    keywordMap.keyS= false
  }
  if(event.keyCode==65){
    keywordMap.keyA=false
  }
  if(event.keyCode==68){
    keywordMap.keyD=false
  }

});
</script>

<template>
  <div ref="threeValue" style="width: 90vw;height: 90vh">

  </div>
</template>

<style scoped>

</style>