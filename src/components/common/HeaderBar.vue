<template>
    <div>
        <el-row class="hj-header-bar">
            <el-col :span="3" :offset="2">
                <div class="hj-header-usr-zone">
                    <img src="../../assets/jtlogo.png">
                </div>
            </el-col>
            <el-col :span="4">
                <span class="hj-header-text-btn hj-header-menu-item" @click="handleNavMenuSelect">首页</span>
                <span class="hj-header-text-btn hj-header-menu-item is-active-btn" @click="handleNavMenuSelect">课程</span>
                <span class="hj-header-text-btn hj-header-menu-item" @click="handleNavMenuSelect">练习</span>
            </el-col>
            <el-col :span="5" :push="7">
                <input v-model="searchForm.key" class="hj-header-search-input" placeholder="课程搜索"/>
                <span class="hj-header-text-btn" @click="handleSearch">搜索</span>
                <!--
                <span class="hj-header-text-btn" @click="handleDownloadShow">下载</span>
                -->
            </el-col>
            <el-col :span="3" :push="7">
                <div class="hj-header-usr-zone">
                    <span class="hj-header-text-btn hj-header-usr-text">用户名称</span>
                    <img class="hj-header-usr-thumbnail" src="../../assets/login.png">
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import ElButton from "../../../node_modules/element-ui/lib/button";
    import ElInput from "../../../node_modules/element-ui/lib/input";
    import ElRow from "../../../node_modules/element-ui/lib/row";
    import ElCol from "../../../node_modules/element-ui/lib/col";
export default {
    components: {
        ElCol,
        ElRow,
        ElInput,
        ElButton},
    data:function () {
        return {
            activeNavMenuItem:'1',
            searchForm:{
                key:''
            },
        }
    },
    methods:{
        handleSearch:function () {
            console.log("handleSearch");
        },
        handleNavMenuSelect:function () {
            
        },
        handleDownloadShow:function () {

        },
        handleUserInfoShow:function () {

        }

    }
}
</script>

<style>
    .hj-header-bar {
        height: 54px;
        line-height: 54px;

        background-image: none;
        background-color: #7c7c7c;

        border-width: 0px;
        border-radius: 0px;

        margin-bottom: 0px;

        text-align:center;
    }

    .hj-header-search-input, .hj-header-search-input:focus {
        height: 36px;
        padding: 0px 15px;
        outline: none;
        border-radius: 20px;
        border-style: none;
        box-shadow: none;
        margin-right: 10px;
    }

    .hj-header-text-btn {
        border-style: none;
        color: white;
        margin-right: 20px;
    }

    .hj-header-menu-item {
        margin-right: 24px;
    }

    .hj-header-text-btn:hover {
        cursor: pointer;
    }

    .is-active-btn {
        color: #7bbdef;
    }

    .hj-header-usr-zone {
        text-align:center;
    }

    .hj-header-usr-zone:hover{
        cursor:pointer;
    }

    .hj-header-usr-thumbnail {
        width: 40px;
        height: 40px;
        border:1px solid #7bbdef;
        border-radius: 20px;
        position: relative;
    }

    .hj-header-usr-zone img {
        vertical-align:middle;
    }

    .hj-header-usr-text {
        margin-right: 10px;
    }
</style>