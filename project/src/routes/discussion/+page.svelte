<script lang="ts">
	import { redirectWhenNotLoggedIn } from '$lib/scripts/loginSaved';
	import { AppBar } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	//@ts-ignore
	import { browser } from '$app/environment'; //Does work
	import { fetchDocumentByID } from '$lib/apiRequests';
	import Placeholder from '$lib/components/cards/placeholder.svelte';
	let board: string;
	onMount(() => {
		if (browser) {
			redirectWhenNotLoggedIn();
		}
		const urlParams = new URLSearchParams(window.location.search);
		let temp = urlParams.get('board');
		if (temp == null) {
			redirectWhenNotLoggedIn();
		} else {
			board = temp;
		}
	});
</script>

{#if board}
	{#await fetchDocumentByID(board)}
		<Placeholder /><Placeholder />
	{:then boardDoc}
		<h1 class="h1">Discussions</h1>
		<br />
		<div>
			<div class="card bg-modern-50 block w-11/12 drop-shadow-md" id="assetHeader">
				<AppBar background="transparent">
					<svelte:fragment slot="lead">
						{boardDoc.BoardName}
					</svelte:fragment>
					<svelte:fragment slot="trail"></svelte:fragment>
				</AppBar>
			</div>
		</div>
	{/await}
{/if}
