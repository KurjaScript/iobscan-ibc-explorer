<template>
    <a-input
        class="header_input"
        placeholder="Search by TxHash"
        :class="isActiveInputStyle ? 'active_input_style' : 'default_input_style'"
        allowClear
        v-model:value="inputValue"
        @focus="setInputBorderStyle"
        @blur="removeInputBorderStyle"
        @pressEnter="searchInput"
    >
        <template #suffix>
            <div class="input_prefix" @click="searchInput">
                <span class="input_prefix_icon iconfont icon-search"></span>
            </div>
        </template>
    </a-input>
</template>

<script>
import {ref} from 'vue';
import router from "../router";
export default {
    props: {
        disabled: Boolean,
    },
    setup(props, context) {
        let inputValue = ref('');
        let isActiveInputStyle = ref(false)
        const onPressEnter = (evt) => {
            context.emit('pressedEnter', evt.target.value);
        };
        const setInputBorderStyle = () => {
            isActiveInputStyle.value = true
        }
        const removeInputBorderStyle = () => {
            isActiveInputStyle.value = false
        }
        const searchInput = (evt) => {
            if(inputValue.value !== ''){
                if (/^[A-F0-9]{64}$/.test(inputValue.value)) {
                    router.push(`/transfers/details?hash=${inputValue.value}`)
                    inputValue.value = ''
                }else {
                    router.push(`/searchResult?${inputValue.value}`)
                    inputValue.value = ''
                }
            }
        }
        return {
            inputValue,
            isActiveInputStyle,
            onPressEnter,
            searchInput,
            setInputBorderStyle,
            removeInputBorderStyle
        };
    },
};
</script>

<style lang="less" scoped>
.ant-input-affix-wrapper-focused{
    box-shadow: none;
}
.active_input_style{
    border-color: rgba(61, 80, 255, 1) !important;
    border-right-color: transparent !important;
}
.default_input_style{

}
:deep.header_input {
    height: 40px;
    background-color: rgba(#ffffff, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    border-right:none;
    :hover{
        .input_prefix{
            background-color: #2C3EE3;
            color: rgba(255,255,255,1);

        }
    }
    .ant-input {
        background-color: transparent;
        color: #ffffff;
    }
    .anticon{
        color: #fff;
    }
    .input_prefix {
        height: 40px;
        border-radius:  0 20px 20px 0;
        padding: 4px 18px;
        background: #3D50FF;
        display: flex;
        align-items: center;
        justify-items: center;
        cursor: pointer;
        .input_prefix_icon{
            font-size: var(--bj-font-size-home-number);
            color: rgba(255,255,255,0.7);
        }
    }

}
.ant-input-affix-wrapper{
    padding-right: 0;
}
</style>
