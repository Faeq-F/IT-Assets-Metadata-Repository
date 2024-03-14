<script lang="ts">
	export let key: string;
	export let value: any;
</script>

<div class="card variant-ghost-error m-2 p-4">
	<div><span class="font-bold">Removed from: </span>{key}</div>
	<div><span class="font-bold">Value: </span>{value}</div>
</div>
