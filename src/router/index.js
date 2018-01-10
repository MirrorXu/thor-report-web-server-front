import Vue from 'vue'
import Router from 'vue-router'


// element-UI
import elementui from  'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(elementui);

import welcome from '@/components/page/welcome'
import template from '@/components/page/template'
import edit from '@/components/page/edit'




Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '欢迎',
      component:welcome
    },
    {
      path: '/template',
      name: '模板',
      component:template,
    },
    {
      path: '/edit',
      name: '编辑',
      component: edit
    }
  ]
})
