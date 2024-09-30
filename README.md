**点模型**

点模型使用的是缓冲类型的几何体 通过bufferAttribute定义说明几何体的顶点数据,此外我们通过定义顶点的材质数据生成顶点材质,在将材质和顶点几个体通过顶点模型对象points 添加到场景中。其他模型实现类似
```js
 const geometry = new THREE.BufferGeometry();
const attribute =  new THREE.BufferAttribute(new Float32Array([ 0, 0, 0, //顶点1坐标
    10, 0, 0, //顶点2坐标
    0, 10, 0, //顶点3坐标
    0, 0, 10, //顶点4坐标
    0, 0, 10, //顶点5坐标
    10, 0, 10,]),3)
geometry.setAttribute('position',attribute)
//定义点模型
const material = new THREE.PointsMaterial({
    color: 0xffff00,
    size: 10.0 //点对象像素尺寸
});

//const material = new THREE.MeshPhongMaterial({color:'#fafafa'}) //高光材质

const cube = new THREE.Points(geometry, material)
scene.add(cube)
```
**线模型**
```js
 const material =  new THREE.LineBasicMaterial({
    color:'#fafafa',
    linewidth:10
})

const cube = new THREE.Line(geometry,material)
```
模型的细分数对于曲面而言细分数越大表面越光滑。
矩形平面举例：
```js
var geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
其中width 和height 代表的是矩形模型的长和宽 heightSegments 和 widthSegments 带表是 长和宽的细分数
```
![img.png](img.png)
**模型渲染和欧拉角度**
模型中的旋转属性用rotation属性同样可以使用set进行设置 同样也可以使用.xyz的方式去给对应的轴线设置旋转角度。此外模型还有对应轴线设置的方法 rotateY() rotateZ() rotateX()等设置 
rotation中的参数则是欧拉角度（Eulter）
```js
// 表示的是x轴 45度y轴0度z轴 90度
const eulter  =  new THREE.Eulter(Math.PI/4,0,Math.PI/2)
mesh.rotation.setFromEuler(eulter.rotation)
mesh.rotation.x =  Math.PI/4

```
**克隆和复制(clone,copy)**
常用的是clone()这样会得到一个和源对象一样的材质对象同样不会影响源对象
常见的方式就是修改多个材质对象的材质属性。
```js
const mesh2 = mesh.clone();
// 克隆几何体和材质，重新设置mesh2的材质和几何体属性
mesh2.geometry = mesh.geometry.clone();
mesh2.material = mesh.material.clone();
// 改变mesh2颜色，不会改变mesh的颜色
mesh2.material.color.set(0xff0000);

```
**group**

threejs中的group是一个组的概念可以理解成是一个组合框 他可以将材质物体，灯光 环境等放在一起 通过group的移动等操作可以统一的将组内的元素进行移移动等处理。

**遍历模型结构**

我们在创建模型的时候会给模型一个name的属性用于标记模型的名称 因此我们可以通过name属性获取对应模型的数据
```js
// 批量创建多个长方体表示高层楼
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



//遍历获取的
model.traverse(function(obj) {
    console.log('所有模型节点的名称',obj.name);
    // obj.isMesh：if判断模型对象obj是不是网格模型'Mesh'
    if (obj.isMesh) {//判断条件也可以是obj.type === 'Mesh'
        obj.material.color.set(0xffff00);
    }
});

```
可以通过scene.getObjectByName()来获取对应模型名称的模型组 
**本地坐标(局部坐标)和世界坐标**

本地坐标也成为局部坐标表示的是模型对象自身的坐标信息,一旦模型对象创建完成本地坐标一半不会改变
世界坐标表示的是模型自身添加到group后的坐标 世界坐标则表示的是模型的本地坐标和组坐标的和。
![img_1.png](img_1.png)
模型坐标的原点默认与几何体中的中心点重合。
模型材质的隐藏和现实 可以通过visible属性实现
```js
 const scane =  new THREE.scane()
scane.visible=false
mesh.material.visible =false;
注意的是同一个材质会因为不同的材质对象隐藏而隐藏
```
**颜色贴图**
```js
const geometry = new THREE.PlaneGeometry(200, 100);
//纹理贴图加载器TextureLoader
const texLoader = new THREE.TextureLoader();
// .load()方法加载图像，返回一个纹理对象Texture
const texture = texLoader.load('./earth.jpg');
const material = new THREE.MeshLambertMaterial({
    // 设置纹理贴图：Texture对象作为材质map属性的属性值
    map: texture,//map表示材质的颜色贴图属性
    
});
// 新版的webgl需要设置颜色的编码方式。
texture.colorSpace  = THREE.SRGBColorSpace;//设置为SRGB颜色空间

```
**自定义顶点的uv 坐标**
```js

/**纹理坐标0~1之间随意定义*/
const uvs = new Float32Array([
    0, 0, //图片左下角
    1, 0, //图片右下角
    1, 1, //图片右上角
    0, 1, //图片左上角
]);
// 设置几何体attributes属性的位置normal属性
geometry.attributes.uv = new THREE.BufferAttribute(uvs, 2); //2个为一组,表示一个顶点的纹理坐标
// 我们可以通过
//geometry.attributes.uv 获取uv坐标
 //uv 坐标的范围是0~1之间 原点是0,0 点
```
**纹理贴图的阵列**
```js
纹理贴图的阵列可以理解成是贴图的x,y轴线上的重复方式
// .load()方法加载图像，返回一个纹理对象Texture
const texture = texLoader.load('./瓷砖.jpg');
// 设置阵列模式
texture.wrapS = THREE.RepeatWrapping;//设置重复
texture.wrapT = THREE.RepeatWrapping;
// uv两个方向纹理重复数量
texture.repeat.set(12,12);//注意选择合适的阵列数量
```

相机的指向位置。
camera.lookAt(0, 0, 0); 

**纹理.encoding和渲染器**
为了正常的渲染一般 颜色贴图的.encoding 属性和渲染器的,outputEncoding属性保持一致。
```js
  const texture = new THREE.TextureLoader().load('./earth.jpg');
texture.colorSpace = THREE.LinearEncoding;//默认值



//解决加载gltf格式模型颜色偏差问题
renderer.outputColorSpace = THREE.sRGBEncoding;

```
**模型加载添加或者更换贴图**
```js
const texLoader = new THREE.TextureLoader();
const texture = texLoader.load('./黑色.png');// 加载手机mesh另一个颜色贴图
texture.encoding = THREE.sRGBEncoding; //和渲染器.outputEncoding一样值
loader.load("../手机模型.glb", function (gltf) {
    const mesh = gltf.scene.children[0]; //获取Mesh
    mesh.material.map = texture; //更换不同风格的颜色贴图
})

如上如果直接给模型加载贴图的话 会发现贴图是反的,这是应为贴图texture 中的存在flipy属性默认是true
表示的是贴图翻转,此时我们就得将这个属性设置为false

texture.flipY =  false
```
**PBR材质**
所谓的pbr就是物理模型 这种模型对于光照的反射更加的贴近真实物体所处的环境。
常见的材质有MeshStanderMaterial和MeshPhysicalMaterial两种材质。

pbr材质的金属度
```js
const mest = new THREE.MeshStandardMaterial({
    metalness: 1.0,//金属度属性
    roughness:0.5//粗糙度
})
通过 metalness 属性设置金属度 此值在0~1之间 1代表的是金属
通过 roughness 属性表示物体表单的粗糙度 此值在0~1 之间 1 表示镜子。
```
pbr材质的环境贴图

pbr材质因为是高度模仿显示生活 在使用的时候需要添加一个环境贴图,这个贴图则是立体的贴图
通过CubeTextureLoader贴图加载器。
```js
const textureCube = new THREE.CubeTextureLoader()
    .setPath('./环境贴图/环境贴图0/') //这是图片的前缀地址。
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
    // CubeTexture表示立方体纹理对象，父类是纹理对象Texture 
new THREE.MeshStandardMaterial({
    metalness: 1.0,
    roughness: 0.5,
    envMap: textureCube, //设置pbr材质环境贴图
})
```
**渲染器**
```js
 renderer.setClearAlpha(0.8);//设置背景透明度 0-1 
const renderer = new THREE.WebGLRenderer({
    antialias:true,//锯齿状
    alpha: false ,//设置背景透明
    preserveDrawingBuffer:true,//将图片可以帮存下来
})

renderer.setClearColor(0xb9d3ff, 0.4); //设置背景颜色和透明度



```
```js
//将图片保存下来

document.getElementById('download').addEventListener('click',function(){
    // 创建一个超链接元素，用来下载保存数据的文件
    const link = document.createElement('a');
    // 通过超链接herf属性，设置要保存到文件中的数据
    const canvas =  render.domElement
    link.href = canvas.toDataURL('image/png');
    link.download = 'threejs.png'; //下载文件名
    link.click(); //js代码触发超链接元素a的鼠标点击事件，开始下载文件到本地
})


```
**深度冲突**
实际的开发过程中会遇到模型闪烁的问题,这个问题产生的原因就是模型的深度冲突。
解决方法 我们一般设置渲染器的对数深度缓冲区
```js
const renderer = new THREE.WebGLRenderer({
    // 设置对数深度缓冲区，优化深度冲突问题
    logarithmicDepthBuffer: true
});
同时设置mesh 的位置
mesh.position.z=0.1
```
**模型加载的进度条**
```js
loader.load("../工厂.glb", function (gltf) {
    model.add(gltf.scene);
    //加载完成后进度条消失。
    document.getElementById("container").style.display = 'none';
}, function (xhr) {
    // 控制台查看加载进度xhr
    // 通过加载进度xhr可以控制前端进度条进度   
    const percent = xhr.loaded / xhr.total;
    console.log('加载进度' + percent);
})

```
**相机**
1.正投影相机
```js
 const width = threeValue.value.clientWidth; //canvas画布宽度
const height = threeValue.value.clientHeight; //canvas画布高度
const k = width / height; //canvas画布宽高比
const s = 600;//控制left, right, top, bottom范围大小
const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 8000);
参数分别是渲染空间的左边界,右边界,上边界,下边界,近界面,远截面。

```
2.透视相机
```js
const width = threeValue.value.clientWidth; //canvas画布宽度
const height = threeValue.value.clientHeight;
const camera =  new THREE.PerspectiveCamera(75,width/height,0,1,1000)
参数分别是 可视角度  长宽比 近截面 远截面
```
camera.up.set(0,-1,0) 可以设置相机的状态 类比于我们拍照手机的横屏和竖屏等。
注意如果camera.up后得通过  camera.lookAt(0,0,0); 重新设置相机姿态。
这两种的使用场景 对于模拟人眼的场景用的都是透视相机，对于只是查看的场景 用的是正交 比如查看全中国的地图，2d可视化

**包围盒**

包围盒是包围模型所有顶点的最小的盒子。

**透视相机OribitControls相机轨道**

常用的属性：
```js
controls.enblePan =false //禁用右键拖拽
control.enableZoom =  false//禁用滚轮缩放
control.enableRotate =  false // 禁用左键旋转
controls.target.set(x, y, z);//controls.target 的坐标务必和相机的lookAt()对应的坐标保持一致。
因为内部仍然执行的是相机的lookAt()
controls.maxDistance = 500;//相机位置与观察目标点最大值
controls.minDistance = 200;//相机位置与观察目标点最小值
```
**地图相机空间MapControls**
**精灵材质**

精灵材质模型 不需要我们创建物体
```js
const texture = new THREE.TextureLoader().load("./光点.png");
const spriteMaterial = new THREE.SpriteMaterial({
  color:0x00ffff,//设置颜色
    rotation:Math.PI/4 //设置惊醒材质的旋转角度
    map:texture//通过map 可以设置贴图
    
    
});
// 创建精灵模型对象，不需要几何体geometry参数
const sprite = new THREE.Sprite(spriteMaterial);
sprite.scale.set(12,23)//可以设置默认矩形的长宽



scane.add(sprite);
精灵材质默认的物体是平面的矩形和网格模型中de PlaneGeometry不同点在于精灵材质不会因为相机的旋转形状发生改变

//可以用来生成星星
```
**Raycaster射线拾取器**
一般我们常用的模型点击的时候获取对应点击的模型的时候就会使用到射线拾取模型
 首先创建射线拾取器
```js
  const raycaster = new THREE.Raycaster();
```
其次要创建射线的开始点和方向
```js
raycaster.ray.origin  =  new THREE.Vector3(100,0,0)
raycaster.ray.direction = new THREE.Vector3(1,0,0)//方向的节点必须是单元节点1
```
接着就要进行交叉计算 通过intersectObjects()
```js
 const intersects =  new THREE.intersectObject(group.children,true)//参数是一个group 或者是[mesh,mesh,mesh]
//intersects.lenght>0 的时候则表示是选中的模型  第二个参数表示的是 检查所有的孩子

```
注意射线拾取的时候，mesh1, mesh2, mesh3位置要确保更新的情况下，执行射线计算，threejs一般是渲染器执行一次.render()之后，你设置的mesh.position或者mesh父对象的position才会真实生效。
```JS
render()
// 注意更新下模型的世界矩阵，你设置的mesh.position生效，再进行射线拾取计算
model.updateMatrixWorld(true);
const intersects = raycaster.intersectObjects([mesh1, mesh2, mesh3]);


```
**屏幕坐标转标准设备坐标**
threejs标准坐标的范围是[-1,1] 因此对于屏幕的坐标而言x的范围是[0,offsetWidth]之间 那么x/offsetWidth 的范围就是[0,1] 然后我们给这个基础上乘2就变成了
[0,2] 然后我们在这个基础上-1 就得到了[-1,1]的范围 因此 就有个公式
```js
x =  px/width *2 -1
y =  py/height *2 -1
```

**通过raycaster进行模型拾取以及模型边框展示**

通过鼠标的点击事件我们进行模型的拾取
```js
render.domElement.addEventListener('click',function(event){
 const px = event.offsetX -  threeValue.value.getBoundingClientRect().left;
 const py = event.offsetY -  threeValue.value.getBoundingClientRect().top;
 //屏幕坐标px、py转标准设备坐标x、y
 //width、height表示canvas画布宽高度
 const x = (px / threeValue.value.clientWidth) * 2 - 1;
 const y = -(py / threeValue.value.clientHeight) * 2 + 1;
 const raycaster =  new THREE.Raycaster({
  origin:new THREE.Vector3(100,0,0),//创建射线原点
  direaction:new THREE.Vector3(1,0,0)//射线方向
 })

//通过点击点的位置生成射线然后进行模型的选中
 raycaster.setFromCamera(new THREE.Vector2(x,y),camera)
// raycaster.interspectObjects()中的参数分别是
//1.是group 或者mesh的list  group.children必须是mesh list 参数2 表示的是递归便利所有的子模型.
 const intersects =  raycaster.interspectObjects(model.children,true)
 if(intersects.length>0){
  intersects[0].object.material.set('red')
 }
//以上就是我们进行模型选择的过程并且根据选择的模型进行修改当前选中的模型颜色。

})

//接下来我们实现选中后显示选中模型的外轮廓

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const outlinePass = new OutlinePass(new THREE.Vector2(threeValue.value.clientWidth, threeValue.value.clientHeight), scene, camera);
outlinePass.visibleEdgeColor.set(0xff0000); // 可见边缘颜色
outlinePass.hiddenEdgeColor.set(0xffffff); // 隐藏边缘颜色
outlinePass.edgeStrength = 5; // 边缘强度
outlinePass.edgeThickness = 1; // 边缘厚度
composer.addPass(outlinePass);

//然后在渲染函数中添加 composer.render()
function render(){
 renderer.render(scene, camera); //执行渲染操作
 if (composer) {
  composer.render();
 }
 requestAnimationFrame(render);
}


render.domElement.addEventListener('click',function(event){
 const px = event.offsetX -  threeValue.value.getBoundingClientRect().left;
 const py = event.offsetY -  threeValue.value.getBoundingClientRect().top;
 //屏幕坐标px、py转标准设备坐标x、y
 //width、height表示canvas画布宽高度
 const x = (px / threeValue.value.clientWidth) * 2 - 1;
 const y = -(py / threeValue.value.clientHeight) * 2 + 1;
 const raycaster =  new THREE.Raycaster({
  origin:new THREE.Vector3(100,0,0),//创建射线原点
  direaction:new THREE.Vector3(1,0,0)//射线方向
 })

//通过点击点的位置生成射线然后进行模型的选中
 raycaster.setFromCamera(new THREE.Vector2(x,y),camera)
// raycaster.interspectObjects()中的参数分别是
//1.是group 或者mesh的list  group.children必须是mesh list 参数2 表示的是递归便利所有的子模型.


 for (let i = 0; i < model.children.length; i++) {
  const group = model.children[i];
  //递归遍历chooseObj，并给chooseObj的所有子孙后代设置一个ancestors属性指向自己
  group.traverse(function (obj) {
 
   if (obj.isMesh) {

    obj.ancestors = obj; //我们选中的mesh
   }
  })
 }
 
 const intersects =  raycaster.interspectObjects(model.children,true)
 if(intersects.length>0){
  outlinePass.selectedObjects =[intersects[0].object.ancestors];
 }


})








```
**raycaster拾取精灵模型**
```js
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
  //复制材质并更换材质颜色
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

```
**场景标注**
通过css2dObject这个库我们可以将世界坐标转换成我们canvas中的坐标。
```js
import { CSS2DRenderer,CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
//通过css2DObject(dom对象) 生成dom 元素
  const tagObject = new CSS2DObject(tags.value);

tagObject.position.set(-55,0,-55); //设置标签的位置一般和mesh.position.set()设置的坐标一直
//添加到场景中。
scene.add(tagObject)

//然后创建渲染器 用来专门的渲染dom元素

const css2Renderer = new CSS2DRenderer();
css2Renderer.render(scene, camera);

css2Renderer.setSize(threeValue.value.clientWidth, threeValue.value.clientHeight);

css2Renderer.domElement.style.position = 'absolute';
css2Renderer.domElement.style.top = '0px';
css2Renderer.domElement.style['pointer-events']='none';
css2Renderer.domElement.style.overflow = "auto";
css2Renderer.domElement.style.color = 'red';
css2Renderer.domElement.style.zIndex =2;


threeValue.value.appendChild(css2Renderer.domElement);
css2Renderer.render(scene, camera);

```
在我们通过鼠标的方式去选中某些模型 并且在对应的模型上添加标注的时候 点击后得重新渲染。
css2Renderer.render()

**动画库tween.js**


