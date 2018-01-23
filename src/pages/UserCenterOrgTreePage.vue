<template>
    <div>
        <el-tree
                :data="orgTree"
                :props="defaultProps"
                default-expand-all
                :expand-on-click-node="false"
                @node-click="handleNodeClick"
                :render-content="renderContent">
        </el-tree>
        <el-dialog title="添加组织节点" :visible.sync="showDialog">
            <el-form :model="orgBo" label-width="100px">
                <el-form-item label="父节点">
                    <el-col :span="16">
                        <el-input v-model="orgBo.parentName" :disabled="true"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="组织名称">
                    <el-col :span="16">
                        <el-input v-model="orgBo.name"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="组织简写">
                    <el-col :span="16">
                        <el-input v-model="orgBo.orgName"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="组织编码">
                    <el-col :span="16">
                        <el-input v-model="orgBo.code"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showDialog = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script type="text/jsx">
    import axios from 'axios'
    import Config from '../config.js'
    import ElRow from "../../node_modules/element-ui/lib/row";

    export default {
        components: {
            ElRow
        },
        data: function () {
            return {
                orgTree: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                showDialog: false,
                orgBo: {}
            }
        },
        created: function () {
            this.getOrgTree();
        },
        methods: {
            getOrgTree: function () {
                console.log(this.orgBo);
                var that = this;
                axios.get(Config.URL_BASE + '/org/tree').then(function (response) {
                    that.orgTree = response.data.data;
                })
            },
            handleNodeClick: function (data, checked, indeterminate) {
                console.log(data, checked, indeterminate);
            },
            save:function(){
                this.showDialog = false;
                var that = this;
                axios.post(Config.URL_BASE + '/org/tree', this.orgBo).then(function (response) {
                    if (response.data.retCode == 1){
                        that.orgBo = {};
                        that.getOrgTree();
                    }else {
                        alert(response.data.message);
                    }
                })

            },
            renderContent: function (h, {node, data, store}) {
                return (
                        <span>
                        <span>{node.label}</span>
                        <span style="padding-left: 8px">
                            <el-button style="font-size: 12px;" type="text"
                                       on-click={() => this.append(data)}>添加</el-button>
                            <el-button style="font-size: 12px;" type="text"
                                       on-click={() => this.update(data)}>修改</el-button>
                            <el-button style="font-size: 12px;" type="text"
                                       on-click={() => this.remove(data)}>删除</el-button>
                        </span>
                    </span>
                );
            },
            append: function (data) {
                this.showDialog = true;
                this.orgBo.parentName = data.name;
                this.orgBo.parentId = data.orgId;
            },
            update:function (date) {
                var that = this;
                this.showDialog = true;
                that.orgBo = date;
                if (this.orgBo.parentId != null){
                    axios.get(Config.URL_BASE + '/org/tree/' + this.orgBo.parentId).then(function (response) {
                        that.orgBo.parentName = response.data.data.name;
                        that.getOrgTree();
                    })
                }else {
                    that.getOrgTree();
                }

            },
            remove: function (data) {
                var that = this;
                axios.delete(Config.URL_BASE + '/org/tree/' + data.orgId).then(function (response) {
                    if (response.data.retCode == 1) {
                        alert("删除组织成功");
                        that.getOrgTree();
                    }else {
                        alert(response.data.message);
                    }
                })
            },
        }
    }
</script>