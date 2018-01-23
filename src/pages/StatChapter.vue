<template>
    <div>
        <el-row style="padding: 12px 48px;padding-top: 48px;line-height: 48px;">
            <el-input placeholder="课程/章节/学员名称" v-model="queryWord" class="input-with-select" size="small"
                      style="width: 200px;float:right;margin-top: 8px;">
                <el-button slot="append" icon="search" @click="wordSearch"></el-button>
            </el-input>
            <span>最近学习:</span>
            <el-date-picker
                    v-model="lastTimeStart"
                    type="datetime"
                    @change="lastTimeStartChange"
                    placeholder="选择日期时间">
            </el-date-picker>
            <span class="demonstration">至</span>
            <el-date-picker
                    v-model="lastTimeEnd"
                    type="datetime"
                    @change="lastTimeEndChange"
                    placeholder="选择日期时间">
            </el-date-picker>
        </el-row>
        <el-row style="padding: 12px 48px;">
            <el-table :data="chapterStudyList" border style="width: 100%">
                <el-table-column prop="chapterName" label="章节名称" width="300" show-overflow-tooltip></el-table-column>
                <el-table-column prop="courseName" label="课程名称" width="250" show-overflow-tooltip></el-table-column>
                <el-table-column prop="userName" label="学员" width="100"></el-table-column>
                <el-table-column prop="lastStudyTime" label="最近学习时长" width="150"></el-table-column>
                <el-table-column prop="totalStudyTime" label="累计学习时长" width="150"></el-table-column>
                <el-table-column prop="lastTime" label="最近学习"></el-table-column>
            </el-table>
        </el-row>
        <el-row style="padding: 12px 24px;">
            <el-pagination
                    style="float: right;"
                    @size-change="pageSizeChange"
                    @current-change="currPageChange"
                    :current-page.sync="currentPage"
                    :page-sizes="[10, 20, 40, 80]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
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

    export default {
        components: {
            ElRadioGroup,
            ElRadio,
            ElCheckbox,
            ElCheckboxGroup,
            ElRow
        },
        data: function () {
            return {
                queryWord: '',
                lastTimeStart: null,
                lastTimeEnd: null,
                orderKey: 0,
                orderBy: 0,
                currentPage: 1,
                pageSize: 10,
                total: 0,
                chapterStudyList: []
            }
        },
        created: function () {
            this.getChapterStudyList();
        },
        methods: {
            getChapterStudyList: function () {
                var that = this;
                axios.get(Config.URL_BASE + '/stat/chapter/list', {
                    params: {
                        'queryWord': this.queryWord,
                        'lastTimeStart': this.lastTimeStart,
                        'lastTimeEnd': this.lastTimeEnd,
                        'orderKey': this.orderKey,
                        'orderBy': this.orderBy,
                        'pageIndex': this.currentPage - 1,
                        'pageSize': this.pageSize,
                    }
                }).then(function (response) {
                    that.chapterStudyList = response.data.data.items;
                    for (var i = 0; i < that.chapterStudyList.length; i++) {
                        that.chapterStudyList[i].lastStudyTime = that.timeConvert(that.chapterStudyList[i].lastStudyTime);
                        that.chapterStudyList[i].totalStudyTime = that.timeConvert(that.chapterStudyList[i].totalStudyTime);
                    }
                    that.total = response.data.data.total;
                })
            },
            pageSizeChange: function (val) {
                this.pageSize = val;
                this.getChapterStudyList();
            },
            currPageChange: function () {
                this.getChapterStudyList();
            },
            wordSearch: function () {
                this.getChapterStudyList();
            },
            lastTimeStartChange: function () {
                this.lastTimeStart = this.formatDate(this.lastTimeStart);
                this.getChapterStudyList();
            },
            lastTimeEndChange: function () {
                this.lastTimeEnd = this.formatDate(this.lastTimeEnd);
                this.getChapterStudyList();
            },
            timeConvert: function (time) {
                var result = "";
                if (parseInt(time / 3600) > 0) {
                    result = parseInt(time / 3600) + "小时";
                    time = time % 3600;
                }
                if (parseInt(time / 60) > 0) {
                    result = result + parseInt(time / 60) + "分钟"
                    time = time % 60;
                } else if (result.length > 0 && parseInt(time / 60) == 0) {
                    result = result + "0分钟";
                }
                result = result + time % 60 + "秒";
                return result;
            },
            formatDate: function (date) {
                var d = new Date(date);
                var ss = d.getSeconds();
                var mm = d.getMinutes();
                var HH = d.getHours();
                var month = '' + (d.getMonth() + 1);
                var day = '' + d.getDate();
                var year = d.getFullYear();

                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;

                return [year, month, day].join('-') + " " + [HH, mm, ss].join(":");
            }
        }
    }
</script>