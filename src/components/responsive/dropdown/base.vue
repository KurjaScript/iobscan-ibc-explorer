<template>
  <a-dropdown v-model:visible="visible" :trigger="['click']">
    <div
      :class="['inline-flex', 'items-center', 'default_color', 'dropdown-container', visible ? 'visible_border' : '']">
      <div
        :class="['flex-1', 'ml-8', 'mr-8', 'text-center', selectOption.length > 0 ? 'selected_color' : '', (selectedText === defaultTitle.defaultStatus || selectedText === options[0].key) ? 'selected_color_default' : '', selectOption.length > 0 && visible ? 'visible_color' : '']">
        {{ selectedText }}</div>
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
      <div class="overlay-container">
        <div :class="['item', item.key === selectOption[0]?.key ? 'selected_option' : '']" v-for="item in options"
          :key="item.value" @click="onSelect(item.key, item.value)">{{ item.key }}</div>
      </div>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import {defaultTitle} from '../../../constants/index';
// todo clippers => 向下箭头换个清晰的svg
import { computed, onMounted, ref } from 'vue';
type TKey = string
type TValue = number | undefined | string

type TOption = {
  key: TKey
  value: TValue
}

interface IProps {
  options: TOption[]
  status?: string
}

const props = defineProps<IProps>()

const visible = ref(false)
const selectOption = ref<TOption[]>([])

const selectedText = computed(() => {
  if (selectOption.value.length > 0) {
    return selectOption.value[0].key
  } else {
    return props.options[0]?.key ?? defaultTitle.defaultStatus;
  }
})

onMounted(() => {
  if (props.status) {
    const { options } = props
    const filterData = options.filter(item => item.value == props.status)
    if (filterData.length > 0) {
      selectOption.value = filterData
    }
  }
})

defineExpose({
  selectOption
})

const emit = defineEmits<{
  (e: 'onSelectedChange', value: TValue): void
}>()

const onSelect = (key: TKey, value: TValue) => {
  selectOption.value = []
  selectOption.value.push({
    key,
    value
  })

  emit('onSelectedChange', value)
  visible.value = false
}


</script>

<style lang="less" scoped>
.dropdown-container {
  height: 36px;
  border: 1px solid var(--bj-border-color);
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  min-width: 126px;
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

.overlay-container {
  background: #fff;
  color: var(--bj-text-second);
  border: 1px solid var(--bj-border-color);
  border-radius: 4px;

  .item {
    padding: 9px 12px;
    cursor: pointer;

    &:hover {
      color: var(--bj-primary-color);

    }
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
  &_default {
    color: var(--bj-text-second);
  }
}

.selected_option {
  background: rgba(61, 80, 255, 0.04);
  color: var(--bj-primary-color);
}
</style>