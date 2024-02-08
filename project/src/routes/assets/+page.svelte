<script lang="ts">
	//Run 'npm install' to make sure you have all the dependencies
	import { Modal, Content, Trigger } from 'sv-popup';
	import MakeAsset from './makeAsset.svelte';
	import { AppBar, Autocomplete } from '@skeletonlabs/skeleton';

	function searchKeyword() {
		alert((document.getElementById('keyword') as HTMLInputElement).value);
	}

	import { injectAssetDivs } from './assetDivInjection';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	injectAssetDivs();

	let AreThereAssets = false;

	function highlight(text: string) {
		var container = document.getElementsByClassName('assetsContainer')[0];
		let items = container.getElementsByTagName('*');
		for (let i in items) {
			let inputText = items[i];
			var innerHTML = inputText.innerHTML;
			var index = innerHTML.indexOf(text);
			if (index >= 0) {
				index = innerHTML.indexOf(text);
				innerHTML =
					innerHTML.substring(0, index) +
					"<span style='background-color: yellow;' class='highlight'>" +
					innerHTML.substring(index, index + text.length) +
					'</span>' +
					innerHTML.substring(index + text.length);
				inputText.innerHTML = innerHTML;
			}
		}
	}

	function removeHighlights() {
		var highlightElements = document.getElementsByClassName('highlight');
		for (let i in highlightElements) {
			let element = highlightElements[i] as HTMLElement;
			if (element.outerHTML) {
				element.outerHTML = element.innerText;
			}
		}
	}

	function filterAssets() {
		let container = document.getElementsByClassName('assetsContainer')[0];
		let items = container.getElementsByTagName('*');
		let searchTerm = (document.getElementById('keyword') as HTMLInputElement).value;
		if (searchTerm != '') {
			for (let i in items) {
				if (items[i].tagName == 'DIV') {
					let data = (items[i] as HTMLDivElement).innerText;
					data = data.replace(/(\r\n|\n|\r)/gm, '');
					if (!data.includes(searchTerm)) {
						(items[i] as HTMLDivElement).style.display = 'none';
					} else {
						(items[i] as HTMLDivElement).style.display = '';
					}
				}
			}
			removeHighlights();
			highlight(searchTerm);
		} else {
			for (let i in items) {
				if (items[i].tagName == 'DIV') {
					(items[i] as HTMLDivElement).style.display = '';
				}
			}
			removeHighlights();
		}
	}
	onMount(() => {
		if (browser) {
			if (document.getElementsByClassName('assetsContainer')[0].firstChild) {
				AreThereAssets = true;
			}

			(document.getElementById('keyword') as HTMLInputElement).addEventListener(
				'onkeyup',
				filterAssets
			);

			filterAssets();
		}
	});
</script>

<svelte:head>
	<title>Assets</title>
</svelte:head>

<h1 class="h1">Assets</h1>
<br />
<div>
	<div class="Card" id="assetHeader">
		<AppBar background="transparent">
			<svelte:fragment slot="lead">
				{#if AreThereAssets}
					<p id="nothingHere">Your assets:</p>
				{:else}
					<p id="nothingHere">
						It doesn't look like you have any assets yet, click the ➕ to get started
					</p>
				{/if}
			</svelte:fragment>

			<svelte:fragment slot="trail">
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim"><i class="fa-solid fa-search"></i></div>
					<input
						type="search"
						id="keyword"
						name="keyword"
						placeholder="Enter search term"
						class=""
						on:keyup={filterAssets}
					/>
				</div>
				<Modal>
					<Content>
						<MakeAsset />
					</Content>
					<Trigger>
						<button id="assetMaker" class="CardButton Card">➕</button>
					</Trigger>
				</Modal>
			</svelte:fragment>
		</AppBar>
	</div>
</div>
<br />
<div class="assetsContainer"></div>

<style>
	@import url('$lib/styles/root.css');
	@import url('$lib/styles/card.css');

	h1 {
		text-align: center;
		margin-top: 15vh;
	}

	#assetMaker {
		width: 2vw;
		height: 2vw;
		padding: 0;
		float: right;
	}

	#nothingHere {
		display: inline;
		float: left;
	}

	#assetHeader {
		height: auto;
		padding: 0px;
	}

	#assetHeader::after {
		content: '';
		clear: both;
		display: table;
	}

	.assetsContainer {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		width: 90%;
		margin: 10px auto;
	}

	#keyword {
		display: inline;
		float: right;
		margin-right: 20px;
	}
</style>
