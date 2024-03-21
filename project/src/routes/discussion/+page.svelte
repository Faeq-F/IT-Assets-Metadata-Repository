<script lang="ts">
	import { redirectWhenNotLoggedIn } from '$lib/scripts/loginSaved';
	import {
		AppBar,
		getModalStore,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	//@ts-ignore
	import { browser } from '$app/environment'; //Does work
	import { fetchDocumentByID } from '$lib/apiRequests';
	import Placeholder from '$lib/components/cards/placeholder.svelte';
	import MakeMessage from './MakeMessage.svelte';

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

	const modalStore = getModalStore();
	const modalComponent: ModalComponent = { ref: MakeMessage };
	const makeModal: ModalSettings = {
		type: 'component',
		component: modalComponent
	};
</script>

{#if board}
	{#await fetchDocumentByID(board)}
		If this page takes too long to load, the link may be invalid
		<Placeholder />
	{:then boardDoc}
		<h1 class="h1">{boardDoc.BoardName}</h1>
		<br />
		<div>
			<div class="card bg-modern-50 block w-11/12 drop-shadow-md" id="boardHeader">
				<AppBar background="transparent">
					<svelte:fragment slot="lead">
						{#if boardDoc.Messages.length > 0}
							<p id="nothingHere" class="ml-2">Messages:</p>
						{:else}
							<p id="nothingHere" class="ml-2">
								It doesn't look like there are any messages on this board yet, click the <i
									class="fa-solid fa-plus"
								></i>
								to get started
							</p>
						{/if}
					</svelte:fragment>
					<svelte:fragment slot="trail">
						<button
							id="createMessage"
							class="card card-hover border-modern-500 bg-modern-50 border-2 drop-shadow-md"
							on:click={() => modalStore.trigger(makeModal)}
							><i class="fa-solid fa-plus"></i></button
						>
					</svelte:fragment>
				</AppBar>
			</div>
		</div>
	{/await}
{/if}

<style>
	#createMessage {
		width: 2vw;
		height: 2vw;
		padding: 0;
		float: right;
	}

	#nothingHere {
		display: inline;
		float: left;
	}

	#boardHeader {
		height: auto;
		padding: 0px;
		margin: 0 auto;
	}

	#boardHeader::after {
		content: '';
		clear: both;
		display: table;
	}

	/* .assetsContainer {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		align-items: stretch;
		width: 90%;
		margin: 10px auto;
	} */
</style>
