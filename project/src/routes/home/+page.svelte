<script lang="ts">
	//@ts-ignore
	import { browser } from '$app/environment'; //Does work
	import { onMount } from 'svelte';
	import { redirectWhenNotLoggedIn } from '$lib/scripts/loginSaved';
	onMount(() => {
		if (browser) {
			redirectWhenNotLoggedIn();
		}
	});
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<h1 class="h1">Home</h1>
<br />
<div class="card w-9/12 object-center" id="HomeCard">
	<p>
		A holistic Web-based system that supports the metadata-based organization of different
		source-code related assets
	</p>
</div>

<style>
	@import url('$lib/styles/root.css');
	#HomeCard {
		padding: 20px;
		margin: 0 auto;
		text-align: center;
	}
</style>
