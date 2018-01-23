<template>
    <div>
        <el-row style="padding: 12px 48px;padding-top: 48px;">
            <el-table :data="score" style="width: 100%">
                <el-table-column prop="examName" label="题干"></el-table-column>
                <el-table-column prop="userName" label="题型" width="100"></el-table-column>
                <el-table-column prop="userScore" label="得分" width="100"></el-table-column>
                <el-table-column prop="userDuration" label="用时(分)" width="100"></el-table-column>
                <el-table-column prop="submitTime" label="交卷时间" width="160"></el-table-column>
            </el-table>
        </el-row>
        <el-row style="padding: 12px 48px;">
            <el-pagination
                    @size-change="handlePageSizeChange"
                    @current-change="handleCurrPageChange"
                    :current-page.sync="currentPage"
                    :page-sizes="[10, 20, 40, 80]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    style="float: right;">
            </el-pagination>
        </el-row>
    </div>
</template>

<script>
    import axios from 'axios'
    import Config from '../config.js'
    import ElRow from "../../node_modules/element-ui/lib/row";
    import ElCheckboxGroup from "../../node_modules/element-ui/lib/checkbox-group";
    import ElCheckbox from "../../node_modules/element-ui/lib/checkbox";
    import ElRadio from "../../node_modules/element-ui/packages/radio/src/radio.vue";
    import ElRadioGroup from "../../node_modules/element-ui/packages/radio/src/radio-group.vue";
    import ElButton from "../../node_modules/element-ui/lib/button";

    export default {
        components: {
            ElRadioGroup,
            ElRadio,
            ElCheckbox,
            ElCheckboxGroup,
            ElRow,
            ElButton
        },
        data() {
            return {
                pageSize: 10,
                currentPage: 1,
                total: 0,
                score: [],
                examId:'',

            }
        },
        created: function () {
            this.examId = this.$route.params.examId;
            this.getScores();
        },
        methods: {
            getScores: function () {
                var that = this;
                axios.get(Config.URL_BASE + '/score/manage', {
                    params: {'examId': this.examId, 'pageIndex': this.currentPage - 1, 'pageSize': this.pageSize}
                }).then(function (respose) {
                    that.score = respose.data.data.items;
                    that.total = respose.data.data.total;
                })
            },
            handlePageSizeChange(val) {
                this.pageSize = val;
                this.getScores();
            },
            handleCurrPageChange() {
                this.getScores();
            },
        }
    }

</script>

<style>
    .link-type,
    .link-type:focus {
        color: #337ab7;
        cursor: pointer;
    }

    link-type:hover {
        color: rgb(32, 160, 255);
    }
</style>