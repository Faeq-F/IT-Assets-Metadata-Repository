<script lang="ts">
	import { deleteDocument } from '../api/apiRequests';

	export let id: string;
	export let typeName: string;
	export let metadataFields: any[];
</script>

<div id="Type" class="card card-hover bg-modern-50 drop-shadow-md">
	<div id="ButtonActions">
		<button type="button" class="btn btn-sm"><i class="fa-solid fa-maximize"></i></button>
		<button type="button" class="btn btn-sm"><i class="fa-solid fa-pen"></i></button><button
			type="button"
			class="btn btn-sm"
			on:click={() => deleteDocument('AssetType', id)}><i class="fa-solid fa-trash"></i></button
		>
	</div>
	<div class="h3" style="margin:10px; font-weight: bold;">
		{typeName}
	</div>
	<div style="margin: 10px; font-weight: 500">Fields required:</div>
	<ul>
		{#each metadataFields as field}
			<li>
				⦿ {field.field}
				<span class="assetCard card variant-ghost-surface badge">{field.dataType}</span>
				{#if field.list}
					<span class="assetCard card variant-ghost-surface badge">Multi-value</span>
				{/if}
			</li>
		{/each}
	</ul>
</div>

<style>
	#Type {
		margin: 10px;
		padding: 10px;
		flex-grow: 1;
	}
	li {
		margin-top: 5px;
		margin-left: 20px;
	}
	li span {
		margin-left: 5px;
		padding: 2px 5px;
	}
	#ButtonActions {
		position: absolute;
		top: 10px;
		right: 20px;
		width: 10px;
	}
</style>
