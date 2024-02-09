<script lang="ts">
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	let valueMultiple: string[] = [];
</script>
<h1 class="h1">
    Filters
</h1>
<div class="card" id="filters">
	<ListBox multiple>
		<ListBoxItem bind:group={valueMultiple} name="medium" value="type1">type1</ListBoxItem>
		<ListBoxItem bind:group={valueMultiple} name="medium" value="type2">type2</ListBoxItem>
		<ListBoxItem bind:group={valueMultiple} name="medium" value="type3">type3</ListBoxItem>
	</ListBox>

</div>
<div class="card" id="applyButton">    
    <button type="button"> Apply Filters</button>
</div>

<style>     
    #filters{
        margin-left: 25%;
        margin-right: 25%;
    }
    #applyButton{
        text-align: center;
        margin-top: 5%;
        margin-left: 45%;
        margin-right: 45%;
    }
    .h1 {
		text-align: center;
		margin-top: 15%;
        margin-bottom: 5%;
	}
</style>