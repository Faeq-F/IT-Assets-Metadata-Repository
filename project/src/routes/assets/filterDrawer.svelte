<script lang="ts">
    
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	let activeFilters: string[] = [];
</script>
<h1 class="h1">
    Filters
</h1>
<div class="card" id="filters">
	<ListBox multiple>
		<ListBoxItem bind:group={activeFilters} name="medium" value="type1">type1</ListBoxItem>
		<ListBoxItem bind:group={activeFilters} name="medium" value="type2">type2</ListBoxItem>
		<ListBoxItem bind:group={activeFilters} name="medium" value="type3">type3</ListBoxItem>
	</ListBox>

</div>

<style>     
	@import url('$lib/styles/root.css');
    #filters{
        margin-left: 25%;
        margin-right: 25%;
    }
    .h1 {
		text-align: center;
		margin-top: 15%;
        margin-bottom: 5%;
	}
</style>