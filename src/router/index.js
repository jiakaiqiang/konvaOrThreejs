import {createWebHashHistory, createRouter} from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {path: '/', component: () => import('../components/three.vue')},
        {path: '/other', component: () => import('../components/other.vue')},
        {path:'/select',component:()=>import('../components/select.vue')},
        {path:'/testbz',component:()=>import('../components/标注.vue')},
        {path:"/lights", component: () => import('../components/light.vue')},
        {path: '/konvaSelect', component: () => import('../components/konvaSelect.vue')},
        {path: '/konvaCanvas', component: () => import('../components/konvaCanvas.vue')},
        {path:"/keys",component:()=>import('../components/keys.vue')},
        {path:"/line",component:()=>import('../components/line.vue')}
    ],
})
export default router