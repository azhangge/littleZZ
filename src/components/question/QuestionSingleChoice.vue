<template>
    <div>

        <el-form v-if="opType == 2" ref="question-form" labelWidth="160px">
            <el-form-item label="题干">
                <el-col :span="15">
                    <el-input type="textarea" v-model="statement"></el-input>
                </el-col>

            </el-form-item>

            <el-form-item label="选项A">
                <el-col :span="15">
                    <el-input v-model="contextA"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="选项B">
                <el-col :span="15">
                    <el-input v-model="contextB"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="选项C">
                <el-col :span="15">
                    <el-input v-model="contextC"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="选项D">
                <el-col :span="15">
                    <el-input v-model="contextD"></el-input>
                </el-col>
            </el-form-item>

            <el-form-item label="答案">
                <el-col :span="15">
                    <el-radio-group v-model="answer">
                        <el-radio label="A">A</el-radio>
                        <el-radio label="B">B</el-radio>
                        <el-radio label="C">C</el-radio>
                        <el-radio label="D">D</el-radio>
                    </el-radio-group>
                </el-col>
            </el-form-item>

            <el-form-item label="解析">
                <el-col :span="15">
                    <el-input type="textarea" v-model="analysis"></el-input>
                </el-col>
            </el-form-item>
        </el-form>

        <el-form v-else ref="question-form" labelWidth="160px">
            <el-form-item label="题干">
                <p>{{  statement }}</p>
            </el-form-item>

            <el-form-item label="选项A">
                <p>{{ contextA }}</p>
            </el-form-item>
            <el-form-item label="选项B">
                <p>{{ contextB }}</p>
            </el-form-item>
            <el-form-item label="选项C">
                <p>{{  contextC }}</p>
            </el-form-item>
            <el-form-item label="选项D">
                <p>{{  contextD }}</p>
            </el-form-item>

            <el-form-item label="答案">
                <el-radio-group v-model="answer" disabled>
                    <el-radio label="A">A</el-radio>
                    <el-radio label="B">B</el-radio>
                    <el-radio label="C">C</el-radio>
                    <el-radio label="D">D</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="解析">
                <p>{{ analysis }}</p>
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
    import ElRadioGroup from "../../../node_modules/element-ui/lib/radio-group";
    import ElRadio from "../../../node_modules/element-ui/lib/radio";
    export default{
        props:['qcontent', 'opType'],
        components: {
            ElRadio,
            ElRadioGroup,
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
                analysis:this.qcontent.analysis,
                contextA:this.qcontent.contextA,
                contextB:this.qcontent.contextB,
                contextC:this.qcontent.contextC,
                contextD:this.qcontent.contextD,

            };
        },
        methods:{
            getQ:function () {
                var ques = {
                    statement:this.statement,
                    answer:this.answer,
                    analysis:this.analysis,
                    contextA:this.contextA,
                    contextB:this.contextB,
                    contextC:this.contextC,
                    contextD:this.contextD,
                };
                return ques;
            }
        }
    }
</script>
<style>

</style>