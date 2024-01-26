<script>
	function HeaderScroll() {
		const header = document.querySelector('header');
		if (header != null) {
			// Detect scroll position
			let scrollPosition = Math.round(window.scrollY);
			//If it is past the top + a little extra space, then make it sticky
			if (
				scrollPosition >
				parseFloat(getComputedStyle(document.getElementsByTagName('header')[0]).fontSize) + 40
			) {
				header.classList.add('sticky');
			} else {
				//If not, make it flat
				header.classList.remove('sticky');
			}
		}
	}
</script>

<svelte:window on:wheel={HeaderScroll} />

<header id="header" class="sticky">
	<nav>
		<ul class="navbar">
			<li class="headerLink">
				<a href="/home">
					<span class="headerText"> Home </span>
				</a>
			</li>
			<span class="verticalDivider"></span>
			<li class="headerLink">
				<a href="/assets">
					<span class="headerText">Assets</span>
				</a>
			</li>
			<span class="verticalDivider"></span>
			<li class="headerLink">
				<a href="/types">
					<span class="headerText">Types</span>
				</a>
			</li>
			<span class="verticalDivider"></span>
			<li class="headerLink">
				<a href="/profile">
					<span class="headerText">Profile</span>
				</a>
			</li>
		</ul>
	</nav>
</header>

<style>
	@import url('$lib/styles/verticalDivider');

	.verticalDivider {
		margin-top: 1.5vh;
	}

	/* Links & text */
	.headerLink {
		-moz-user-select: -moz-none;
		-khtml-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.headerLink a {
		line-height: 30px;
		height: 100%;
		text-decoration: none;
		float: left !important;
		transition: all 0.3s ease 0s;
		text-decoration: none;
	}

	.headerText {
		padding-bottom: 4vh;
		vertical-align: middle;
		line-height: 70px;
		color: #2c2c2cd5;
		font-size: larger;
		font-weight: bold;
		-moz-user-select: -moz-none;
		-khtml-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	nav {
		padding: 10px 0;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.navbar {
		list-style: none;
		height: 70px;
		list-style-type: none;
		margin: 0;
		padding: 0;
		display: flex;
		justify-content: flex-start;
	}

	.navbar {
		padding-inline-start: 40px;
		padding-inline-end: 40px;
	}

	/* Header box */

	header {
		-moz-user-select: -moz-none;
		-khtml-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
		width: calc(100% - 81px);
		left: 0;
		color: #000;
		position: fixed;
		top: 2.5%;
		z-index: 500;
		width: 100%;
		background-color: transparent;
		border-radius: 30px;
		transition: 300ms ease;
		height: 10vh;
		display: block;
	}

	header {
		-moz-user-select: -moz-none;
		-khtml-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	header.sticky {
		box-shadow:
			rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
			rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,
			rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
		margin: 10px 2.5%;
		width: 95%;
		background-color: #f2f4f8;
	}

	@media (max-width: 661px) {
		nav {
			display: block;
			height: auto;
		}

		.headerText {
			line-height: 20px;
			font-size: small;
			/*Center font*/
		}

		.headerLink a {
			line-height: 20px;
			padding: 0 5px;
		}

		header {
			display: none;
		}
	}

	@media (min-width: 660px) {
		.headerText {
			line-height: 70px;
			font-size: larger;
		}

		.headerLink a {
			line-height: 30px;
			padding: 0 24px;
		}
	}
</style>
