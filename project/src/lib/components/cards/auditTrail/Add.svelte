<script lang="ts">
	export let key: string;
	export let newValue: any;
</script>

<div class="card variant-ghost-success m-2 p-4">
	<div><span class="font-bold">Added to: </span>{key}</div>
	<div><span class="font-bold">Value: </span>{newValue}</div>
</div>
