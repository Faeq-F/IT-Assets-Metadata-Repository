<script lang="ts">
	export let key: string;
	export let newValue: any;
</script>

<div class="card variant-ghost-error m-2 p-4">
	<div><span class="font-bold">Updated: </span>{key}</div>
	<div><span class="font-bold">To: </span>{newValue}</div>
</div>
