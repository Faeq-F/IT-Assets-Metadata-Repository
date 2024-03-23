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
						id: 'Link',
						group: 'Basic',
						title: 'Link',

						description: 'Link anywhere; assets, types, etc.',
						action: (input) => {
							input.textarea.value += '[Link text](url)';
						}
					},
					{
						id: 'Bold',
						group: 'Basic',
						title: 'Bold',

						description: 'Add bold text',
						action: (input) => {
							input.textarea.value += '**Bold text**';
						}
					},
					{
						id: 'Italics',
						group: 'Basic',
						title: 'Italics',

						description: 'Add italicized text',
						action: (input) => {
							input.textarea.value += '_Italicized text_';
						}
					},
					{
						id: 'Strikethrough',
						group: 'Basic',
						title: 'Strikethrough',

						description: 'Add crossed out text',
						action: (input) => {
							input.textarea.value += '~~Crossed out text~~';
						}
					},
					{
						id: 'LineBreak',
						group: 'Basic',
						title: 'Line Break',

						description: 'Separate text',
						action: (input) => {
							input.textarea.value += '<br>';
						}
					},
					{
						id: 'ThematicBreak ',
						group: 'Basic',
						title: 'Thematic Break',

						description: 'Add a horizontal line',
						action: (input) => {
							input.textarea.value += '<hr>';
						}
					},
					{
						id: 'Math',
						group: 'Extra',
						title: 'Math',

						description: 'Add KaTeX expressions',
						action: (input) => {
							input.textarea.value +=
								'inline:\n<br>\nPythagorean theorem: $a^2+b^2=c^2$\n<br><br>\nBlock:\n<br>\n$$\\mathcal{L}\\{f\\}(s) = \\int_0^{\\infty} {f(t)e^{-st}dt}$$\n<br><br>\n$$\\dfrac{\\partial}{\\partial t}(\\dfrac{\\partial \\mathcal{L}}{\\partial \\dot{q}_k}) - \\dfrac{\\partial \\mathcal{L}}{\\partial q_k} = 0$$';
						}
					},
					{
						id: 'Emoji',
						group: 'Extra',
						title: 'Emoji',
						description: 'Add emojis',
						action: (input) => {
							input.textarea.value += ":smile: Type after a ':' to search for emojis";
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
	let collapsed = false;
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
						<button on:click={() => (collapsed = !collapsed)}>
							{#if collapsed}
								<i class="fa-solid fa-angle-up"></i>
							{:else}
								<i class="fa-solid fa-angle-down"></i>
							{/if}
						</button>
						{#if boardDoc.Messages.length > 0}
							<p id="nothingHere" class="ml-2">Add a message:</p>
						{:else}
							<p id="nothingHere" class="ml-2">Be the first to message:</p>
						{/if}
					</svelte:fragment>
					<svelte:fragment slot="trail"></svelte:fragment>
				</AppBar>
				<div style="height: 20vh;padding: 10px;padding-top: 0;" class={collapsed ? 'hidden' : ''}>
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
		transform: translate(-50%, -5%);
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
