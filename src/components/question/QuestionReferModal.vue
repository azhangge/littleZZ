<template>
    <div>
        <el-dialog
                title="添加题目"
                :visible.sync="dialogVisible"
                :before-close="handleClose">
            <el-row>
                <el-col span="8">
                    <span>来源</span>
                    <el-radio class="radio" v-model="source" :label="1">系统题库</el-radio>
                    <el-radio class="radio" v-model="source" :label="2">个人收藏</el-radio>
                </el-col>
                <el-col span="8">
                    <span>题目类型</span>
                    <el-select v-model="qTypeFilter" placeholder="请选择">
                        <el-option
                                v-for="item in questionTypes"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col  span="8">
                    <el-input
                            placeholder="题目搜索"
                            icon="search"
                            v-model="searchText"
                            :on-icon-click="handleSearch">
                    </el-input>
                </el-col>
            </el-row>

            <el-table
                    ref="multipleTable"
                    :data="tableData3"
                    border
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        label="日期"
                        width="120">
                    <template scope="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="姓名"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="地址"
                        show-overflow-tooltip>
                </el-table-column>
            </el-table>
            <el-row>
                <el-col push="16">
                    <el-pagination
                            layout="prev, pager, next"
                            :total="1000">
                    </el-pagination>
                </el-col>

            </el-row>

            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
        </el-dialog>

    </div>
</template>


<script>
    import ElRow from "../../../node_modules/element-ui/lib/row";
    import ElCol from "../../../node_modules/element-ui/lib/col";

    export default {
        components: {
            ElCol,
            ElRow},
        props:['isShow'],
        data:function () {
            return {
                mainCategoryId:null,
                subCategoryId:null,
                pageIndex:0,
                pageSize:10,
                qTypeFilter: null,
                searchText:"",
                selectedQuestionIds:[],
                dialogVisible: this.isShow,
                source:1, //1, 表示访问题库，2 表示访问个人收藏

                categoryDict: [],
                categoryDictMap:{
                    value:'courseCategoryId',
                    label:'name'
                },
                questionTypes: [
                    {name:"全部", value:0},
                    {name:"单选题", value:1},
                    {name:"多选题", value:2},
                    {name:"判断题", value:3},
                ],

                tableData3: [{
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-08',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-06',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-07',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }],


            };
        },
        created:function () {

        },
        methods:{
            handleClose:function () {
                this.dialogVisible = false;
            },
            handleSearch:function () {

            },
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange(val) {
                this.selectedQuestionIds = val;
            }
        },
        computed:{},
    }

</script>

<style>

</style>