<template>
  <div id="app">
      <header-bar></header-bar>
      <el-row  class="hj-main-content">
          <el-col :span="4" :offset="2">
              <user-info-menu></user-info-menu>
          </el-col>
          <el-col :span="16" class="hj-user-zone-content">
              <router-view ></router-view>
          </el-col>
      </el-row>

      <el-row>
          <el-col :span="22" :offset="1" class="hj-footer">
          </el-col>
      </el-row>
  </div>
</template>

<script>
    import Vue from 'vue'
    import VueRouter from 'vue-router'

    import 'element-ui/lib/theme-default/index.css'
    import Element from 'element-ui'
    import ElRow from "element-ui/lib/row";
    import ElCol from "element-ui/lib/col";

    import HeaderBar from './components/common/HeaderBar.vue'
    import FooterBar from './components/common/FooterBar.vue'
    import UserInfoBar from './components/account/UserInfoBar.vue'
    import UserInfoMenu from './components/common/UserInfoMenu.vue'

    export default {
        components: {
            ElCol,
            ElRow,
            'header-bar': HeaderBar,
            'footer-bar': FooterBar,
            'user-info-bar': UserInfoBar,
            'user-info-menu': UserInfoMenu,
        },
        //router,
        data :function () {
            return {
                msg: 'Use Vue 2.0 Today!'
            }
        },
        methods: {
            startHacking () {
                this.$notify({
                    title: 'It Works',
                    message: 'We have laid the groundwork for you. Now it\'s your time to build something epic!',
                    duration: 6000
                })
            }
        }
    }
</script>

<style>
    body {
        font-family: Helvetica, sans-serif;
    }

    .hj-main-content {
        background-color: #f5f5f5;
        margin-top: 10px;
    }

    .hj-user-zone-content {
        background-color: white;
        border-left: solid #f5f5f5 10px;
        padding-bottom: 20px;
    }

    .hj-footer {
        height: 120px;
        background-color: white;

        border-top: solid #f5f5f5 10px;
        border-bottom: solid #f5f5f5 20px;

    }

</style>
