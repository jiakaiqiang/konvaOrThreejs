import {createWebHashHistory, createRouter} from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {path: '/', component: () => import('../components/three.vue')},
        {path:'/select',component:()=>import('../components/select.vue')},
        {path:"/lights", component: () => import('../components/light.vue')},
        {path: '/konvaSelect', component: () => import('../components/konvaSelect.vue')},
        {path: '/konvaCanvas', component: () => import('../components/konvaCanvas.vue')},
    ],
})
export default router