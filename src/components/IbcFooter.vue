<template>
    <div class="footer_content">
        <div class="footer_content_left">
            <span class="footer_content_left_icon" v-for="(item, index) in iconLinks" :key="index"
                @click="onClickIcon(item.iconLink)">
                <i class="iconfont" :class="item.iconName"></i>
            </span>
            Contact us !
        </div>
        <div class="footer_content_right">
            {{ copyright }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const copyright = ref('Copyright © 2022 IRIS Foundation Ltd. All Rights Reserved.');
const iconLinks = [
    {
        iconName: 'icon-github',
        iconLink: 'https://github.com/irisnet'
    },
    {
        iconName: 'icon-telegram',
        iconLink: 'https://t.me/irisnetwork'
    },
    {
        iconName: 'icon-medium',
        iconLink: 'https://medium.com/irisnet-blog'
    },
    {
        iconName: 'icon-tweeter',
        iconLink: 'https://twitter.com/irisnetwork'
    },
]
const onClickIcon = (item: string) => {
    window.open(item);
};
</script>

<style lang="less" scoped>
.footer_content {
    box-sizing: border-box;
    padding: 16px 0;
    width: 100%;
    max-width: 1200px;
    .flex(row, nowrap, space-between, center);

    &_left {
        .flex(row, nowrap, flex-start, center);
        font-size: @font-size5;
        font-family: Montserrat-Regular, Montserrat;
        font-weight: 400;
        color: @font-color2;

        &_icon {
            .flex(row, nowrap, center, center);
            margin-right: 8px;
            width: 28px;
            height: 28px;
            padding: 6px;
            background-color: rgba(61, 80, 255, 0.1);
            border-radius: @card-radio;
            cursor: pointer;

            &:first-child {
                .iconfont {
                    font-size: 19px;
                }
            }

            &:last-child {
                .iconfont {
                    font-size: 15px;
                }
            }

            &:hover {
                background-color: var(--bj-primary-color);

                .iconfont {
                    color: #fff;
                }
            }
        }

        .iconfont {
            font-size: var(--bj-font-size-sub-title);
            color: var(--bj-primary-color);
        }
    }

    &_right {
        font-size: @font-size5;
        font-family: Montserrat-Regular, Montserrat;
        font-weight: 400;
        color: @font-color2;
    }
}

@media screen and (max-width: 1200px) {
    .footer_content {
        padding: 16px 32px;

        &_left {
            &_icon {}
        }

        &_right {}
    }
}

@media screen and (max-width: 768px) {
    .footer_content {
        .flex(column, nowrap, center, center);

        &_left {
            &_icon {}
        }

        &_right {
            margin-top: 16px;
        }
    }
}
</style>
