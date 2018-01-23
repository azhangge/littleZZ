<template>
    <el-card class="hj-grid-item" :body-style="{ padding: '0px' }">

        <div class="hj-grid-item-op-container" >
            <span >退出</span>
        </div>
        <img src="../../assets/ShowImage.png">
        <div class="hj-grid-item-title">
            <a href="#"><nobr>{{ name }}</nobr></a>
        </div>
        <div>
            <span class="hj-grid-item-info" style="float: left;">{{ teacherName }}</span>
            <span class="hj-grid-item-info" style="float: right;">{{ timeLen }}课时</span>
        </div>
    </el-card>
</template>

<script>
    export default {
        props:[
            'id','name', 'teacherId', 'teacherName', 'timeLen', 'thumbnail'
        ],
        data:function () {
            return {
            }
        },
        methods:{

        }
    }
</script>

<style>
    .hj-grid-item{
        width: 224px;
        height:203px;
        background-color: white;
        position: relative;
        margin:0 20px 20px 0;
        display: inline-block;
        border-style: none;
        padding: 0px;
    }

    .hj-grid-item img {
        width:224px; height: 126px;
    }

    .hj-grid-item-title{
        height: 24px;
        font-size: 14px;
        color: #333333;
        display: block;
        padding: 4px 5px;
        margin-right: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space:nowrap;
    }

    .hj-grid-item-title a {
        text-decoration: none;
    }

    .hj-grid-item-info{
        color:#999999;
        font-size: 12px;
        margin: 4px 5px;
        margin-right: 8px;
    }

    .hj-grid-item-op-container{
        width: 100%;
        height: 48px;
        background-color: rgba(0, 0, 0, 0.5);
        position: absolute;
        top: 0px;
        left: 0px;
        vertical-align: middle;
        text-align: right;
    }

    .hj-grid-item-op-container span {
        margin-right: 10px;
        float: right;
        vertical-align: middle;
    }

</style>