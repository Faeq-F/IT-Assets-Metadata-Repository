<script lang="ts">
    import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
    import { onMount } from 'svelte';
    import { fetchDocuments } from '../api/apiRequests';
    import { filterAssets } from './keywordSearch';
    import { injectAssetDivs } from './assetDivInjection';

    export let activeFilters: string[] = [];

	let typeFilters: string[] = [];

    onMount(async () => {
        const assetDocuments = await fetchDocuments('Asset').then((Docs) => {
            for (let i of Docs){
                if (!typeFilters.includes(i.assetType)){
                typeFilters = [...typeFilters, i.assetType]
            }
            }
        });
        });
</script>

<h1 class="h1">Filters test</h1>
<div class="card" id="filters">
    <ListBox multiple id="ListBox">
        
        {#each typeFilters as item (item)}
            <ListBoxItem bind:group={activeFilters} name="medium" value={item}>{item}</ListBoxItem>
        {/each}
    </ListBox>
</div>

<style>
    @import url('$lib/styles/root.css');
    #filters {
        margin-left: 25%;
        margin-right: 25%;
    }
    .h1 {
        text-align: center;
        margin-top: 15%;
        margin-bottom: 5%;
    }
</style>
