<script lang="ts">
	import { AppBar, getToastStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { fetchDocumentByID } from '$lib/apiRequests';
	import Placeholder from '$lib/components/cards/placeholder.svelte';
	import Containers from './Containers.svelte';
	import Cookies from 'js-cookie';
	const toastStore = getToastStore();
	let board: string;

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		let temp = urlParams.get('board');
		if (temp == null) {
			window.location.href = '/home';
		} else {
			board = temp;
		}
	});

	import { CartaEditor, CartaViewer } from 'carta-md';
	import { carta, cartaViewer } from '$lib/components/customInputs/carta';
	import 'carta-md/default.css'; /* Default theme */
	import 'carta-md/light.css'; /* Markdown input theme */
	import '@cartamd/plugin-emoji/default.css';
	import 'katex/dist/katex.css';
	import '@cartamd/plugin-code/default.css';
	import '@cartamd/plugin-slash/default.css';
	import '@cartamd/plugin-anchor/default.css';
	import { deleteMessage, reply, sendMessage } from './Message';

	let value = '';
	let collapsedCreateMessage = false;
	let collapsedContainers = true;
</script>

<svelte:head>
	<title>Discussion</title>
</svelte:head>

{#if board}
	{#await fetchDocumentByID(board)}
		If this page takes too long to load, the link may be invalid
		<Placeholder />
	{:then boardDoc}
		<div>
			<div class={collapsedCreateMessage ? 'mb-24' : 'mb-72'}>
				<h1 class="h1">{boardDoc.BoardName}</h1>
				<br />
				<div class="card w-11/12 bg-modern-50 p-4 drop-shadow-md" style="margin: 0 auto">
					<button on:click={() => (collapsedContainers = !collapsedContainers)}>
						{#if collapsedContainers}
							<i class="fa-solid fa-angle-up"></i>
						{:else}
							<i class="fa-solid fa-angle-down"></i>
						{/if}
					</button>
					{boardDoc.Description}
					{#if !collapsedContainers}
						<br />
						<hr />
						<Containers {boardDoc} />
					{/if}
				</div>
				<br />
				<div id="messagesContainer">
					{#each boardDoc.Messages as message}
						<div
							class="message card w-full bg-modern-50 p-4 drop-shadow-md"
							style="margin: 5px auto"
						>
							<AppBar background="transparent">
								<svelte:fragment slot="lead">
									<b>{message.Author}</b>&nbsp;on {message.Date} @ {message.Time}
								</svelte:fragment>
								<svelte:fragment slot="trail">
									<button on:click={() => (value = reply(message.Author, message.Message, value))}
										><i class="fa-solid fa-reply"></i></button
									>
									{#if Cookies.get('savedLogin-username') == message.Author}
										<button on:click={() => deleteMessage(boardDoc, message, toastStore)}
											><i class="fa-solid fa-trash"></i></button
										>
									{/if}
								</svelte:fragment>
							</AppBar>
							<hr />
							<br />
							<div class="pb-4 pl-4">
								<CartaViewer carta={cartaViewer} value={message.Message} />
							</div>
						</div>
					{/each}
				</div>
			</div>
			<div
				class="card absolute bottom-10 block w-11/12 bg-modern-50 drop-shadow-md"
				id="boardHeader"
			>
				<AppBar background="transparent">
					<svelte:fragment slot="lead">
						<button on:click={() => (collapsedCreateMessage = !collapsedCreateMessage)}>
							{#if collapsedCreateMessage}
								<i class="fa-solid fa-angle-up"></i>
							{:else}
								<i class="fa-solid fa-angle-down"></i>
							{/if}
						</button>
						{#if boardDoc.Messages.length > 0}
							<p id="addMessage" class="ml-2">Add a message:</p>
						{:else}
							<p id="nothingHere" class="ml-2">Be the first to message:</p>
						{/if}
					</svelte:fragment>
					<svelte:fragment slot="trail">
						<button
							class="variant-filled-primary btn p-1"
							style="margin: 0 auto; display:block;"
							id="assetMaker"
							on:click|preventDefault={() => sendMessage(boardDoc, value, toastStore)}
						>
							<img src="send.svg" alt="send button" />
						</button>
					</svelte:fragment>
				</AppBar>
				<div
					style="height: 20vh;padding: 10px;padding-top: 0;"
					class={collapsedCreateMessage ? 'hidden' : ''}
				>
					<CartaEditor mode="tabs" {carta} bind:value placeholder="Type a '/' to get started" />
				</div>
			</div>
		</div>
	{/await}
{/if}

<style>
	:global(.carta-font-code) {
		font-family: monospace;
	}

	#addMessage,
	#nothingHere {
		display: inline;
		float: left;
	}

	#boardHeader {
		height: auto;
		padding: 0px;
		margin: 0 auto;
		bottom: 0%;
		left: 50%;
		transform: translate(-50%, 5%);
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}

	#boardHeader::after {
		content: '';
		clear: both;
		display: table;
	}

	#messagesContainer {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		align-items: stretch;
		width: 87%;
		margin: 10px auto;
	}
</style>
