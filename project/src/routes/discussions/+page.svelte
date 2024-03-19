<script lang="ts">
	//@ts-ignore
	import { browser } from '$app/environment'; //Does work
	import { onMount } from 'svelte';
	import { redirectWhenNotLoggedIn } from '$lib/scripts/loginSaved';
	import { fetchDocuments } from '$lib/apiRequests';

	onMount(() => {
		if (browser) {
			redirectWhenNotLoggedIn();
		}
	});
</script>

<svelte:head>
	<title>Discussions</title>
</svelte:head>

<h1 class="h1">Discussions</h1>
<br />
<div class="card bg-modern-50 w-9/12 object-center shadow-md" id="HomeCard">
	<p>
		Discussion boards can be about anything. Certain projects that have been undertaken, or general
		questions. You can organize information being talked about in containers.
	</p>
</div>

<div class="card bg-modern-50 w-6/6 m-4 mx-48 p-5 shadow-md"></div>

<style>
	#HomeCard {
		padding: 20px;
		margin: 0 auto;
		text-align: center;
	}
</style>
