<script lang="ts">
	import { redirectWhenNotLoggedIn } from '$lib/scripts/loginSaved';
	import { AppBar, getToastStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	//@ts-ignore
	import { browser } from '$app/environment'; //Does work
	import { fetchDocumentByID, updateDocument } from '$lib/apiRequests';
	import Placeholder from '$lib/components/cards/placeholder.svelte';
	import Cookies from 'js-cookie';
	const toastStore = getToastStore();
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

	import { Carta, CartaEditor, CartaViewer } from 'carta-md';
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
	import Containers from './Containers.svelte';

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

	async function sendMessage(boardDoc: any) {
		// formatting date
		let current = new Date();
		let day = current.getDate();
		let month = current.getMonth() + 1;
		let year = current.getFullYear();
		let current_date = `${day}/${month}/${year}`;
		let current_time = current.toLocaleTimeString();

		//add it to the list of messages
		boardDoc.Messages.push({
			Date: current_date,
			Time: current_time,
			Replied: replied,
			Author: Cookies.get('savedLogin-username'),
			Message: value
		});

		//construct the final obj
		const data = new FormData();
		data.append(
			'newData',
			JSON.stringify({
				BoardCreator: boardDoc.BoardCreator,
				BoardName: boardDoc.BoardName,
				Containers: boardDoc.Containers,
				Description: boardDoc.Description,
				Messages: boardDoc.Messages
			})
		);
		updateDocument('DisscussionBoards', boardDoc._id, data).then((response) => {
			console.log(response);
			toastStore.trigger({
				message: 'Container created',
				background: 'variant-ghost-success',
				timeout: 3000
			});
			// Refresh the page
			location.reload();
		});
	}

	const cartaViewer = new Carta({
		sanitizer: DOMPurify.sanitize,
		extensions: [emoji(), code(), math(), anchor()]
	});

	let value = '';
	let replied = '';
	let collapsed = false;
</script>

{#if board}
	{#await fetchDocumentByID(board)}
		If this page takes too long to load, the link may be invalid
		<Placeholder />
	{:then boardDoc}
		<div>
			<div class="mb-24">
				<h1 class="h1">{boardDoc.BoardName}</h1>
				<br />
				<div class="card bg-modern-50 w-11/12 p-4 drop-shadow-md" style="margin: 0 auto">
					{boardDoc.Description}
				</div>
				<br />
				<Containers {boardDoc} />
				<br />
				<div id="messagesContainer">
					{#each boardDoc.Messages as message}
						<div class="card bg-modern-50 w-11/12 w-full p-4 drop-shadow-md" style="margin: 0 auto">
							<b>{message.Author}</b> on {message.Date} @ {message.Time}
							<br />
							<hr />
							<br />
							<CartaViewer carta={cartaViewer} value={message.Message} />
						</div>
					{/each}
				</div>
			</div>
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
					<svelte:fragment slot="trail">
						<button
							class="variant-filled-primary btn p-1"
							style="margin: 0 auto; display:block;"
							id="assetMaker"
							on:click|preventDefault={() => sendMessage(boardDoc)}
							><svg
								width="25px"
								height="25px"
								viewBox="-2.4 -2.4 28.80 28.80"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
									id="SVGRepo_tracerCarrier"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke="#CCCCCC"
									stroke-width="4.8"
								>
									<path
										d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z"
										stroke="#ffffff"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									></path>
								</g><g id="SVGRepo_iconCarrier">
									<path
										d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z"
										stroke="#ffffff"
										stroke-width="0.00024000000000000003"
										stroke-linecap="round"
										stroke-linejoin="round"
									></path>
								</g></svg
							></button
						>
					</svelte:fragment>
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

	#messagesContainer {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		align-items: stretch;
		width: 90%;
		margin: 10px auto;
	}
</style>
