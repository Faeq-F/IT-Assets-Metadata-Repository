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

	import { Carta, CartaEditor } from 'carta-md';
	import 'carta-md/default.css'; /* Default theme */
	import 'carta-md/light.css'; /* Markdown input theme */
	import DOMPurify from 'dompurify';
	import { emoji } from '@cartamd/plugin-emoji';
	import { slash } from '@cartamd/plugin-slash';
	import { code } from '@cartamd/plugin-code';
	import { math } from '@cartamd/plugin-math';
	import { anchor } from '@cartamd/plugin-anchor';
	import '@cartamd/plugin-emoji/default.css';
	import 'katex/dist/katex.css';
	import '@cartamd/plugin-code/default.css';
	import '@cartamd/plugin-slash/default.css';
	import '@cartamd/plugin-anchor/default.css';

	const carta = new Carta({
		sanitizer: DOMPurify.sanitize,
		extensions: [
			emoji(),
			slash({
				snippets: [
					{
						id: 'Emoji',
						group: 'default',
						title: 'Emoji',
						description: 'Add emojis',
						action: (input) => {
							input.textarea.value += '::';
						}
					}
				]
			}),
			code(),
			math(),
			anchor()
		]
	});

	let value = '';
</script>

{#if board}
	{#await fetchDocumentByID(board)}
		If this page takes too long to load, the link may be invalid
		<Placeholder />
	{:then boardDoc}
		<h1 class="h1">{boardDoc.BoardName}</h1>
		<br />
		<div>
			<div
				class="card bg-modern-50 absolute bottom-10 block w-11/12 drop-shadow-md"
				id="boardHeader"
			>
				<AppBar background="transparent">
					<svelte:fragment slot="lead">
						{#if boardDoc.Messages.length > 0}
							<p id="nothingHere" class="ml-2">Add a message:</p>
						{:else}
							<p id="nothingHere" class="ml-2">Be the first to message:</p>
						{/if}
					</svelte:fragment>
					<svelte:fragment slot="trail"></svelte:fragment>
				</AppBar>
				<CartaEditor {carta} bind:value />
			</div>
		</div>
	{/await}
{/if}

<style>
	:global(.carta-font-code) {
		font-family: monospace;
	}

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
		transform: translate(-50%, -20%);
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
