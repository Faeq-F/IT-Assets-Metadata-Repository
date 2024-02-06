<script>
	let name = 'Asset App';
	let API_URL = 'http://localhost:5038/';
	let assets = [];
	let newAssets = '';
	function refreshAssets() {
		fetch(API_URL + 'api/teamproject/GetAssets')
			.then((response) => response.json())
			.then((data) => {
				assets = data;
			});
	}
	import { onMount } from 'svelte';
	onMount(async () => {
		refreshAssets();
	});
	function addAssets() {
		console.log('in');
		const data = new FormData();
		data.append('newAssets', newAssets);
		fetch(API_URL + 'api/teamproject/AddAssets', {
			method: 'POST',
			body: data
		})
			.then((response) => response.json())
			.then((data) => {
				alert(data);
				refreshAssets();
			});
	}
	function deleteAssets(id) {
		fetch(API_URL + 'api/teamproject/DeleteAssets?id=' + id, {
			method: 'DELETE'
		})
			.then((response) => response.json())
			.then((data) => {
				alert(data);
				refreshAssets();
			});
	}
</script>

<main style="margin-top: 20vh;">
	<h2>{name}</h2>
	<input bind:value={newAssets} />
	<button on:click={addAssets}>Add Assets</button>
	{#each assets as asset}
		<p>
			<b>*{asset.asset_name}</b>
			<button on:click={deleteAssets(asset.id)}>Delete Assets</button>
		</p>
	{/each}
</main>
