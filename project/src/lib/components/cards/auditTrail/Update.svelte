<script lang="ts">
	export let key: string;
	export let oldValue: any;
	export let newValue: any;
</script>

<div class="card variant-ghost-warning m-2 p-4">
	<div><span class="font-bold">Updated: </span>{key}</div>
	<div><span class="font-bold">From: </span>{oldValue}</div>
	<div><span class="font-bold">To: </span>{newValue}</div>
</div>
