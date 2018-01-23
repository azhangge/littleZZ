<template>
    <div>
        <el-form ref="question-form" labelWidth="160px">
            <el-form-item label="题干">
                <el-col :span="15">
                    <el-input v-if="opType == 2" type="textarea" v-model="statement"></el-input>
                    <p v-else >{{ statement }}</p>
                </el-col>
            </el-form-item>
            <el-form-item label="答案">
                <el-col :span="15">
                    <el-radio-group v-model="answer" :disabled="editable">
                        <el-radio label="A" >正确</el-radio>
                        <el-radio label="B" >错误</el-radio>
                    </el-radio-group>
                </el-col>
            </el-form-item>
            <el-form-item v-show="opType != 3 " label="解析">
                <el-col :span="15">
                    <el-input v-if="opType == 2" type="textarea" v-model="analysis"></el-input>
                    <p v-else>{{ analysis }}</p>
                </el-col>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import ElButton from "../../../node_modules/element-ui/lib/button";
    import ElForm from "../../../node_modules/element-ui/lib/form";
    import ElFormItem from "../../../node_modules/element-ui/lib/form-item";
    import ElSelect from "../../../node_modules/element-ui/lib/select";
    import ElOption from "../../../node_modules/element-ui/lib/option";
    import ElCheckboxGroup from "../../../node_modules/element-ui/lib/checkbox-group";
    import ElCheckbox from "../../../node_modules/element-ui/lib/checkbox";
    import ElInput from "../../../node_modules/element-ui/lib/input";
    export default{
        props:['qcontent', 'opType'],
         //1 查看，2 编辑，3 答题
        components: {
            ElInput,
            ElCheckbox,
            ElCheckboxGroup,
            ElOption,
            ElSelect,
            ElFormItem,
            ElForm,
            ElButton,
        },
        data:function(){
            return {
                statement:this.qcontent.statement,
                answer:this.qcontent.answer,
                analysis:this.qcontent.analysis
            };
        },
        computed:{
            editable:function () {
                if (this.opType != '1'){
                    return false;
                } else {
                    return true;
                }
            }
        },
        methods:{
            getQ:function () {
                var ques = {
                    statement:this.statement,
                    answer:this.answer,
                    analysis:this.analysis
                };
                return ques;
            }
        }

    }
</script>
<style>

</style>