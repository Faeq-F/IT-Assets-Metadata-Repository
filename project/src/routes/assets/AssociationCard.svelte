<script lang="ts">
	import { highlight } from './keywordSearch';

	export let document: any;
	export let keywordSearchInput: string[] = [];

	let associationType = '';
	if (document.assetName != undefined) {
		associationType = 'Asset';
	} else {
		associationType = 'User';
	}
</script>

<div class=" inline rounded-full">
	{#if associationType == 'Asset'}
		<p class="inline">
			{@html highlight(document.assetName, keywordSearchInput)}
		</p>
	{:else}
		<p class="inline">
			{@html highlight(document.username, keywordSearchInput)}
		</p>
	{/if}
</div>

<style></style>
