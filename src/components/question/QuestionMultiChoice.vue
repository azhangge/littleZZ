<template>
    <div>
        <el-form  v-if="opType == 2" ref="question-form" labelWidth="160px">
            <el-form-item label="题干">
                <el-col :span="15">
                    <el-input type="textarea" v-model="statement" ></el-input>
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
                    <el-checkbox-group v-model="answer">
                        <el-checkbox label="A">A</el-checkbox>
                        <el-checkbox label="B">B</el-checkbox>
                        <el-checkbox label="C">C</el-checkbox>
                        <el-checkbox label="D">D</el-checkbox>
                    </el-checkbox-group>
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
                <p>{{  contextA }}</p>
            </el-form-item>
            <el-form-item label="选项B">
                <p>{{  contextB }}</p>
            </el-form-item>
            <el-form-item label="选项C">
                <p>{{  contextC }}</p>
            </el-form-item>
            <el-form-item label="选项D">
                <p>{{  contextD }}</p>
            </el-form-item>

            <el-form-item label="答案">
                <el-checkbox-group v-model="answer" >
                    <el-checkbox label="A" disabled>A</el-checkbox>
                    <el-checkbox label="B" disabled>B</el-checkbox>
                    <el-checkbox label="C" disabled>C</el-checkbox>
                    <el-checkbox label="D" disabled>D</el-checkbox>
                </el-checkbox-group>
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
    import ElCheckboxGroup from "../../../node_modules/element-ui/lib/checkbox-group";
    import ElCheckbox from "../../../node_modules/element-ui/lib/checkbox";
    export default{
        components: {
            ElCheckbox,
            ElCheckboxGroup,
            ElOption,
            ElSelect,
            ElFormItem,
            ElForm,
            ElButton,
        },
        props:['qcontent', 'opType'],
        data:function(){
            return {
                statement:this.qcontent.statement,
                answer:[],
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
                    answer:this.answerStr,
                    analysis:this.analysis,
                    contextA:this.contextA,
                    contextB:this.contextB,
                    contextC:this.contextC,
                    contextD:this.contextD,
                };
                return ques;
            },

        },
        created:function () {
            if (this.qcontent.answer != null) {
                this.answer =  this.qcontent.answer.split("");
            }
        },
        computed:{
            answerStr:function () {
                var ansStr = '';
                var ansArr = this.answer;
                ansArr.forEach(function (val, index, array) {
                    ansStr += val;
                });

                return ansStr;
            }
        }


    }
</script>
<style>

</style>