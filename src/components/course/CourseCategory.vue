<template>
    <div>
        <el-row  style="padding: 12px 48px;padding-top: 48px;line-height: 48px;text-align: right;">
            <el-button type="primary" size="small" @click="handleAdd">添加</el-button>
            <el-button type="primary" size="small" @click="handleDelete">删除</el-button>
        </el-row>
        <el-row  style="padding: 12px 48px;padding-top: 0px;line-height: 48px;">
            <tree-grid
                    :columns="columns"
                    :items="categories"
                    :itemsMap="categoriesMap"
                    :expandedRowKeys="expandedRowIds"
                    :selectedRowKeys="selectedRowIds"
                    @add-row="handleAddRow"
                    @del-row="handleDelRow"
                    @change-data="handleChangeData"
                    @expand-row="handleExpandRow"></tree-grid>
        </el-row>
        <el-row style="text-align: center;">
            <el-button type="primary" @click="handleSaveAll">保存</el-button>
        </el-row>

    </div>
</template>


<script>
    import axios from "axios";
    import treeGrid from "../common/TreeGrid.vue";
    import ElRow from "element-ui/lib/row";
    import ElButton from "element-ui/lib/button";
    import UserData from "../../userdata"
    import Config from "../../config"

    axios.defaults.headers.common['Authorization'] = UserData.token;

    const G_ID_PREFIX = "temp";
    let G_ID = 2000;

    export default {
        components: {
            ElButton,
            ElRow,
            treeGrid,
            },
        data() {
            return {
                columns:[{
                    type:'selection'
                }, {
                    title:"名称",
                    key:'name',
                    width:120,
                }, {
                    title:"编码",
                    key:"code",
                    sortable:true,
                    width:120
                }, {
                    title:"描述",
                    key:"descriptions",
                    width:240
                }, {
                    title:"操作",
                    type:"action",
                    actions:[{
                        text:"添加子类",
                        act:"add"
                    },{
                        text:"删除",
                        act:"del"
                    }]
                }],
                categories:[],
                categoriesMap:{},
                defaultProps: {
                    children: 'children',
                    name: 'name'
                },
                currEditId: null,
                expandedRowIds:[],
                selectedRowIds:[],
                changedRows:{},
                deletedRows:{}
            }
        },
        created:function () {

            this.loadData();
        },
        methods: {
            loadData:function () {
                var that = this;
                axios.get(Config.URL_BASE + '/course_category/tree', {withCredentials:true})
                    .then(function (response) {
                        console.log(response);
                        if (response.data != null && response.data.data != null) {
                            that.categories = response.data.data;
                            console.log(that.categories);
                            if (that.categories != null && that.categories.length > 0) {
                                that.changeListToMap(that.categories);
                                console.log(that.categoriesMap);
                            }
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            changeListToMap:function(categories){
                if (categories == null || categories.length < 1) {
                    return;
                }

                for (var i = 0; i < categories.length; i++) {
                    var category = categories[i];
                    category.id = category.courseCategoryId;
                    this.categoriesMap[category.courseCategoryId] = category;
                    if (category.children != null && category.children.length > 0) {
                        this.changeListToMap(category.children);
                    }
                }
            },
            handleSaveAll:function () {
                var that = this;
                console.log(this.changedRows);
                console.log(this.deletedRows);

                var changedData = [];
                var deletedData = [];

                for (var prop in this.changedRows) {
                    console.log(prop);
                    changedData.push(this.categoriesMap[prop]);
                }
                for (var prop in this.deletedRows) {
                    console.log(prop);
                    if (this.isTemporaryId(prop)) {
                        this.deletedRows[prop];
                    } else {
                        deletedData.push(this.deletedRows[prop].id);
                    }
                }

                var allModifyData = {changed : changedData, deleted: deletedData};

                axios.post(Config.URL_BASE + '/course_category/savebatch/', allModifyData, {withCredentials:true})
                    .then(function (response) {
                        if (response.data != null) {
                            that.displayMessage(response.data.retCode, response.data.message);
                        }

                        that.loadData();
                        that.changedRows = [];
                        that.deletedRows = [];
                        })
                    .catch(function (error) {

                    })
            },
            handleAdd:function () {
                this.handleAddRow(null);
            },
            handleDelete:function () {

            },
            handleAddRow: function (parent) {
                var newCategory = this.genCategory();

                if (parent == null) {
                    newCategory.parentId = null;
                    this.categories.push(newCategory);
                } else {
                    newCategory.parentId = parent.courseCategoryId;
                    if (this.categoriesMap[parent.courseCategoryId].children == null) {
                        this.categoriesMap[parent.courseCategoryId].children = [];
                    }
                    this.categoriesMap[parent.courseCategoryId].children.push(newCategory);
                }

                this.categoriesMap[newCategory.courseCategoryId] = newCategory;
                var tmp =  {};
                tmp[newCategory.courseCategoryId] = newCategory;
                this.categoriesMap = Object.assign({}, this.categoriesMap, tmp);
                this.currEditId = newCategory.courseCategoryId;
                this.changedRows = Object.assign({}, this.changedRows, tmp);
            },
            handleDelRow:function (item) {
                var parentId = item.parentId;

                if (item.courseCategoryId == this.currEditId) {
                    this.currEditId = null;
                }

                if (parentId != null) {
                    for (var i = 0 ; i < this.categoriesMap[parentId].children.length; i++) {
                        if (this.categoriesMap[parentId].children[i].courseCategoryId == item.courseCategoryId) {
                            this.categoriesMap[parentId].children.splice(i, 1);
                            break;
                        }
                    }
                } else {
                    for (var i = 0; i < this.categories.length; i++) {
                        if (this.categories[i].courseCategoryId == item.courseCategoryId) {
                            this.categories.splice(i, 1);
                        }
                    }
                }

                delete this.categoriesMap[item.courseCategoryId];
                this.categories = [].concat(this.categories);
                this.changeListToMap(this.categories);

                if (this.isTemporaryId(item.courseCategoryId)){
                    delete this.changedRows[item.courseCategoryId];

                    for (var prop in this.changedRows) {
                        if (this.changedRows[prop] == null) {
                            continue;
                        }

                        if (this.changedRows[prop].parentId == item.courseCategoryId) {
                            delete this.changedRows[prop];
                        }
                    }

                    this.changedRows = Object.assign({}, this.changedRows);
                }

                var tmp =  {};
                tmp[item.courseCategoryId] = item;
                this.deletedRows = Object.assign({}, this.deletedRows, tmp);
            },
            isTemporaryId:function(id){
                return (id != null && id.indexOf(G_ID_PREFIX) > -1);
            },
            handleChangeData:function (val, item, key) {
                var mapItem = this.categoriesMap[item.courseCategoryId];
                mapItem[key] = val;

                var tmp = {};
                tmp[item.courseCategoryId] = mapItem;

                this.categoriesMap[item.courseCategoryId][key] = val;
                this.categoriesMap = Object.assign({}, this.categoriesMap, tmp);

                this.changedRows = Object.assign({}, this.changedRows, tmp);
            },
            handleExpandRow:function (item, isExpanded) {
                if (isExpanded == false){
                    for (var i = 0; i < this.expandedRowIds.length; i ++) {
                        if (this.expandedRowIds[i] == item.courseCategoryId){
                            this.expandedRowIds.slice(i, 1);
                            return;
                        }
                    }
                } else {
                    for (var i = 0; i < this.expandedRowIds.length; i ++) {
                        if (this.expandedRowIds[i] == item.courseCategoryId){
                            return;
                        }
                    }
                    this.expandedRowIds.push(item.courseCategoryId);
                }
            },
            append(store, data) {
                var tempNodeData = this.genCategory();
                tempNodeData.parentId = data.courseCategoryId;
                store.append(tempNodeData, data);
            },
            remove(store, data) {
                store.remove(data);
            },

            handleNodeClick :function (data, node, store) {
                this.currEditId = data.courseCategoryId;
            },
            handleSave:function () {

            },
            genCategory:function () {
                var tmpId = G_ID_PREFIX + (G_ID ++);
                return {
                    courseCategoryId: tmpId,
                    id:tmpId,
                    code:"",
                    name :"",
                    appIconId:"",
                    descriptions : "",
                    parentId:null,
                    children:[]
                }
            },
            displayMessage:function (retCode, message) {
                var type = null;
                if (retCode == 0) {
                    type = "success";
                } else {
                    type = "error";
                }

                this.$notify({
                    title: '',
                    message: message,
                    type: type
                });
            }
        },
        computed:{

        }
    };

</script>

<style>
    .input-new-tag{width:78px; margin-left:10px; vertical-align:middle;}
    .button-new-tag{margin-left:10px;height:24px;line-height:22px;padding-top:0;padding-bottom:0;}

    .el-table .cell {padding: 0 12px;}

    .hj-table-cell-input {width:100%; height:28px;border-radius: 4px;border-width: 1px;}
    .hj-table-cell-input:hover, .hj-table-cell-input:focus {outline: 0;  border-color:#20a0ff;box-shadow: 0px;border-style:solid;}

    .editor-example {
        border: 1px solid #ccc;
    }
    .ql-container .ql-editor {
        min-height: 20em;
        padding-bottom: 1em;
        max-height: 25em;
    }
    .html {
        height: 9em;
        overflow-y: auto;
        border: 1px solid #ccc;
        border-top: none;
        resize: vertical;
    }
</style>