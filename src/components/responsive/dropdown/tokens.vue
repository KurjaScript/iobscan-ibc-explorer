<template>
  <a-dropdown v-model:visible="visible" :trigger="['click']" :overlayStyle="{ zIndex: 1020 }" @visibleChange="visibleChange">
    <div
      :class="['inline-flex', 'items-center', 'default_color', 'dropdown-container', visible ? 'visible_border' : '']">
      <div
        :class="['inline-flex', 'flex-1', 'text-center', 'mr-8', 'ml-8', 'justify-center', 'items-center', selectToken.length > 0 ? 'selected_color' : '', selectedInfo.title === defaultTitle.defaultTokens ? 'selected_color_default' : '', selectToken.length > 0 && visible ? 'visible_color' : '']">
        <img width="18" height="18"  class="mr-4" v-if="selectedInfo.icon.length" :src="selectedInfo.icon"/>
        <span class="selectedInfo_title">{{ selectedInfo.title }}</span>
        </div>
      <span class="button_icon flex justify-between items-center">
        <svg :style="{ transform: visible ? 'rotate(180deg)' : 'rotate(0)' }" focusable="false" data-icon="down"
          width="12px" height="12px" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"
          :class="[visible ? 'visible_color' : '']">
          <path
            d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z">
          </path>
        </svg>
      </span>
    </div>

    <template #overlay>
      <div class="overlay">
        <div>
          <span @click="onSelected(defaultTitle.defaultTokens, undefined)"
            :class="['chains-tag', isSelected(undefined) ? 'visible_color visible_border' : '']">All Tokens</span>
        </div>
        <div class="mt-24">
          <div :style="{ marginBottom: '-2px' }" class="leading-none">Authed IBC Tokens</div>
          <div class="flex flex-wrap">
            <span v-for="item in dropdownData" @click="onSelected(item.symbol, item.denom)"
              :class="['chains-tag', 'mr-12', 'mt-12', isSelected(item.denom) ? 'visible_color visible_border' : '']"
              :key="item.denom">
              <img :src="iconSrc(item.icon)" width="24" height="24" class="mr-8" />
              <span class="symbol">{{ item.symbol }}</span>
            </span>
          </div>
        </div>
        <div class="mt-24">
          <div class="leading-none">Other IBC Tokens</div>
          <span :class="['chains-tag', 'mr-12', 'mt-16', isSelected('others') ? 'visible_color visible_border' : '']"
            key="others" @click="onSelected('Others', 'others')"><img :src="imgSrc" width="24" height="24"
              class="mr-8" />
            Others</span>
        </div>
        <div class="mt-24">
          <div class="flex items-center">
            <div class="leading-none">Custom IBC Tokens</div>
            <a-popover destroyTooltipOnHide overlay-class-name="antd-popover">
              <template #content>
                <p class="tip_color">
                  Hash (in hex format) of the <br> denomination trace information.
                </p>
              </template>
              <img class="tip hover" style="margin-left: 8px;" src="/src/assets/tip.png" />
            </a-popover>
          </div>
          <div class="flex items-center mt-12 flex-wrap">
            <a-input allowClear v-model:value="tokenInput" class="token-input" placeholder="Search by ibc/hash"
              @input="onInputChange" />
            <a-button @click="confirmChains" type="primary" class="confirm-button ml-12">Confirm</a-button>
          </div>
        </div>
      </div>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
import { formatLongTitleString, getRestString } from '@/helper/parseString';
import { onMounted, computed, ref } from 'vue';
import {defaultTitle} from '../../../constants/index';
import Tools from '@/utils/Tools';
const imgSrc = new URL('../../../assets/token-default.png', import.meta.url).href

type TDenom = string | undefined

type TSelectToken = {
  denom: TDenom,
  symbol: string
}
interface IProps {
  dropdownData: any[]
  base_denom?: string
}

const props = withDefaults(defineProps<IProps>(), {
  dropdownData: (sessionStorage.getItem('baseDenoms') && JSON.parse(sessionStorage.getItem('baseDenoms')!)) || []
})

const visible = ref(false)
const selectToken = ref<TSelectToken[]>([])
const tokenInput = ref<TDenom>(undefined)

let backupDropdownData: TSelectToken[] | null;

const isSelected = computed(() => (denom: TDenom) => selectToken.value.length > 0 && selectToken.value[0]?.denom === denom)
const selectedInfo = computed(() => {
  let title = defaultTitle.defaultTokens;
  let icon = '';
  if (selectToken.value.length > 0) {
    title = selectToken.value[0].symbol == tokenInput.value ? getRestString(tokenInput.value, 4, 4) : selectToken.value[0].symbol;
    icon = findSymbolIcon(selectToken.value[0].symbol);
  }
  return {
    title,
    icon
  }
})

const findSymbolIcon = (symbol: string) => {
    if(symbol === 'Others'){
      return imgSrc;
    }else{
      const baseDenomInfo = Tools.findSymbol(props.dropdownData, symbol);
      if (baseDenomInfo) {
          return baseDenomInfo.icon || imgSrc;
      } 
      return '';
    }
};

const iconSrc = (src:string) => {
  if (src) return src
  return imgSrc
}

onMounted(() => {
  if (props.base_denom) {
    const filterObj = props.dropdownData.find(item => item.denom === props.base_denom)
    if (filterObj && filterObj.denom) {
      selectToken.value = [{
        denom: filterObj.denom,
        symbol: filterObj.symbol
      }]
    } else if (props.base_denom === 'others') {
      selectToken.value = [{
        denom: 'others',
        symbol: 'Others'
      }]
    } else {
      tokenInput.value = props.base_denom
      selectToken.value = [{
        denom: props.base_denom,
        symbol: props.base_denom
      }]
    }
  }
})

defineExpose({
  selectToken,
  tokenInput
})

const emit = defineEmits<{
  (e: 'onTokensSelected', denom: TDenom): void
}>()

const sumbitTokens = (denom: TDenom) => {
  emit('onTokensSelected', denom)
  visible.value = false
}

const confirmChains = () => {
  if (tokenInput.value) {
    selectToken.value = [{
      denom: tokenInput.value,
      symbol: tokenInput.value
    }]
  }
  sumbitTokens(tokenInput.value)
}

const onInputChange = () => {
  if (!backupDropdownData && selectToken.value.length) {
    backupDropdownData = selectToken.value;
  }
  
  selectToken.value = []
  if (!tokenInput.value) return
  selectToken.value = [{
    denom: tokenInput.value,
    symbol: tokenInput.value
  }]
}

const visibleChange = (visible: boolean) => {
  if (!visible && backupDropdownData) {
    selectToken.value = backupDropdownData;
    tokenInput.value = undefined
  }
  backupDropdownData = null;
}

const onSelected = (symbol: string, denom: TDenom) => {
  selectToken.value = []
  selectToken.value.push({
    symbol,
    denom
  })
  sumbitTokens(denom)
}
</script>

<style lang="less" scoped>
.dropdown-container {
  height: 36px;
  border: 1px solid var(--bj-border-color);
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  min-width: 124px;
}

.button_icon {
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  padding: 0 6px;
  border-left: 1px solid var(--bj-border-color);
  height: 36px;

  &>svg {
    color: var(--bj-text-third);
  }
}

.visible_border {
  border: 1px solid var(--bj-primary-color) !important;
  box-shadow: 0 0 0 2px rgb(61 80 255 / 20%);
}

.visible_color {
  color: var(--bj-primary-color) !important;
}

.default_color {
  color: var(--bj-text-second);
}

.selected_color {
  color: var(--bj-primary-color);
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 8px;
  max-width: 118px;
  &_default {
    color: var(--bj-text-second);
  }
}
.selectedInfo_title {
    max-width: 118px;
    overflow: hidden;
    text-overflow: ellipsis;
}
.overlay {
  max-width: 872px;
  background: #FFFFFF;
  box-shadow: 0px 2px 8px 0px #D9DEEC;
  border-radius: 4px;
  min-height: 200px;
  border: 1px solid var(--bj-border-color);
  padding: 16px 4px 24px 16px;
  transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.chains-tag {
  position: relative;
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-align: left;
  background-image: none;
  border: 1px solid transparent;
  box-shadow: 0 2px 0 rgb(0 0 0 / 2%);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  user-select: none;
  padding: 5px 8px 5px 8px;
  border-radius: 4px;
  color: var(--bj-text-second);
  background: var(--bj-background-color);
  width: 158px;
  box-sizing: border-box;

  &:hover {
    border: 1px solid var(--bj-primary-color);
  }
  .symbol {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.token-input {
  width: 240px;
}

.confirm_button {
  color: #fff;
}

.tip {
  width: 20px;

  &_color {
    color: var(--bj-text-second);
  }
}

.hover {
  cursor: pointer;
}

.tip_color {
  color: var(--bj-text-second);
  text-align: center;
  margin: -2px -2px;
}

// tablet
@media screen and (max-width: 768px) {
  .overlay {
    max-width: 381px;
    height: 450px;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      box-shadow: inset006pxrgba(0, 0, 0, 0.3);
      border-radius: 2px;
      width: 8px;
      background: rgba(61, 80, 255, 0.1);
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      box-shadow: inset006pxrgba(0, 0, 0, 0.5);
      background: rgba(61, 80, 255, 0.5);
    }

    &::-webkit-scrollbar-thumb:window-inactive {
      background: rgba(61, 80, 255, 0.9);
    }
  }
}

// mobile
@media screen and (max-width: 414px) {
  .overlay {
    max-width: 284px;
    height: 450px;
  }

  .confirm-button {
    margin: 12px 0 0;
  }

  .token-input {
    width: 245px;
  }
}
</style>