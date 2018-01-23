<template>
    <div>
        <el-row class="hj-user-info-bar">

        </el-row>

    </div>
</template>

<script>
    import ElRow from "../../../node_modules/element-ui/lib/row";
    import ElCol from "../../../node_modules/element-ui/lib/col";
    export default {
        components: {ElRow},
        data:function () {
            return {

            }
        },
        methods: {

        }
    }
</script>

<style>
    .hj-user-info-bar {
        height: 185px;
        width: 100%;
        background-image: linear-gradient(to right, #82caf7 25%, #7bbdef 50%, #83d5d8 75%, #8adfd0 100%);
        vertical-align: middle;
    }
</style>