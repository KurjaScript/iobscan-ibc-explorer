import { getChannelsListAPI } from '@/api/channels';
import { useResetSearch } from '@/composables';
import { BASE_PARAMS } from '@/constants';
import { API_CODE } from '@/constants/apiCode';
import ChainHelper from '@/helper/chainHelper';
import { formatBigNumber } from '@/helper/parseStringHelper';
import {
    IResponseChannelsList,
    IRequestChannelsList,
    IResponseChannelsListItem
} from '@/types/interface/channels.interface';
import { TChannelStatus } from '@/types/interface/components/table.interface';
import { urlPageParser } from '@/utils/urlTools';
import { computed, onMounted, ref, Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export const useGetChannelsList = () => {
    const channelsList = ref<IResponseChannelsListItem[]>([]);
    const total = ref<number>(0);

    const getChannelsList = async (params: IRequestChannelsList) => {
        const { loading } = params;

        if (loading) {
            loading.value = true;
            delete params.loading;
        }
        try {
            const allData = {} as IResponseChannelsList;
            const getAllData = async () => {
                const result = await getChannelsListAPI({
                    ...BASE_PARAMS,
                    ...params
                });
                const { code, data, message } = result;
                if (data.constructor === Object) {
                    if (data.items.length < BASE_PARAMS.page_size) {
                        allData.items = (allData.items || []).concat(data?.items);
                        loading && (loading.value = false);
                        if (code === API_CODE.success) {
                            if (!params.use_count) {
                                const { items } = allData as IRequestChannelsList;
                                channelsList.value = ChainHelper.sortByChainName(
                                    items,
                                    params.chain
                                );
                            } else {
                                total.value = data as number;
                            }
                        } else {
                            console.error(message);
                        }
                    } else {
                        allData.items = (allData.items || []).concat(data.items);
                        params.page_num++;
                        getAllData();
                    }
                } else {
                    total.value = data as number;
                }
            };
            getAllData();
        } catch (error) {
            loading && (loading.value = false);
            console.error(error);
        }
    };
    getChannelsList({ ...BASE_PARAMS, use_count: true });
    return {
        channelsList,
        total,
        getChannelsList
    };
};

export const useChannelsQuery = () => {
    const route = useRoute();
    const chainIdQuery = route.query.chain as string;
    const statusQuery = route.query.status as TChannelStatus;
    return {
        chainIdQuery,
        statusQuery
    };
};

export const useChannelsSelected = (
    chainIdQuery: string,
    statusQuery: TChannelStatus,
    getChannelsList: (params: IRequestChannelsList) => Promise<void>,
    loading: Ref<boolean>
) => {
    let pageUrl = '/channels';

    const router = useRouter();
    const searchChain = ref(chainIdQuery ? chainIdQuery : undefined);
    const searchStatus = ref(statusQuery ? statusQuery : undefined);
    const refreshList = () => {
        getChannelsList({
            ...BASE_PARAMS,
            chain: searchChain.value,
            status: searchStatus.value,
            loading: loading
        });
    };
    const onSelectedChain = (chain_id?: string) => {
        searchChain.value = chain_id !== 'allchain,allchain' ? chain_id : '';
        pageUrl = urlPageParser(pageUrl, {
            key: 'chain',
            value: searchChain.value as string
        });
        router.replace(pageUrl);
        refreshList();
    };

    const onSelectedStatus = (value?: number | string) => {
        searchStatus.value = value as TChannelStatus;
        pageUrl = urlPageParser(pageUrl, {
            key: 'status',
            value: value as TChannelStatus
        });
        router.replace(pageUrl);
        refreshList();
    };

    onMounted(() => {
        refreshList();
    });
    return {
        searchChain,
        searchStatus,
        onSelectedChain,
        onSelectedStatus
    };
};

export const useChannelsRef = () => {
    const chainDropdown = ref();
    const statusDropdown = ref();
    return {
        chainDropdown,
        statusDropdown
    };
};

export const useSubTitleComputed = (
    searchChain: Ref<string | undefined>,
    searchStatus: Ref<TChannelStatus | undefined>,
    total: Ref<number>,
    channelsList: Ref<IResponseChannelsListItem[]>
) => {
    const subtitle = computed(() => {
        if (!searchChain.value && !searchStatus.value) {
            return `${formatBigNumber(total.value, 0)} channels found`;
        } else {
            return `${formatBigNumber(channelsList.value.length, 0)} of the ${formatBigNumber(
                total.value,
                0
            )} channels found`;
        }
    });
    return {
        subtitle
    };
};

export const useChannelsColumnJump = () => {
    const router = useRouter();
    const goChains = () => {
        router.push('/chains');
    };
    const resetSearchCondition = () => {
        const { resetSearch } = useResetSearch();
        resetSearch();
    };
    return {
        goChains,
        resetSearchCondition
    };
};
