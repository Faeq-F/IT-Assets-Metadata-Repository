<svelte:head>
	<title>Assets</title>
</svelte:head>

<script>
	function makeAsset(){
		alert('unfinished');
	}
</script>

<h1>Assets page</h1>
<div class="makeAssets">
	<header> Make Assets</header>
	<form>
		<label for="assetName" class="formlabel">Name: </label>
		<input type="text" id="assetName" name="assetName" placeholder="Enter Asset Name" /><br /><br />		

		<label for="assetType" class="formlabel">Asset Type: </label><br />

		<input type="radio" name="assetType" value="Type 1">
		<label for="type1" class="formlabel"> Type 1</label><br />

		<input type="radio" name="assetType" value="Type 2">
		<label for="type2" class="formlabel"> Type 2</label><br />

		<input type="radio" name="assetType" value="Type 3">
		<label for="type3" class="formlabel"> Type 3</label><br />
	</form>
	<button id="assetMaker" on:click={makeAsset}> Make Asset</button>
</div>
<div class="viewAssets">
	<header> View Assets</header>
	<input type="text" id="keyword" name="keyword" /><br /><br />
</div>

<p id="bottom">Something at the bottom to see navbar animation work</p>

<style>
	@import url('$lib/styles/root.css');

	h1 {
		text-align: center;
		margin-top: 15vh;
	}
	#bottom {
		margin-top: 150vh;
	}
	.makeAssets{
		border: 5px outset red;
		background-color: lightblue;
		text-align:center;
		width: 50%;	
		margin-left: 25%;
	}	
	.viewAssets{
		border: 5px outset red;
		background-color: lightblue;
		text-align:center;
		width: 50%;	
		margin-left: 25%;
		margin-top: 10vh;
	}	
</style>