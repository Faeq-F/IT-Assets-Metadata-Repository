export default function getRandomColor() {
		let colors = [
			'#FFE6E6',
			'#E1AFD1',
			'#AD88C6',
			'#7469B6',
			'#8E7AB5',
			'#B784B7',
			'#E493B3',
			'#EEA5A6'
		];
		let color = colors[Math.floor(Math.random() * colors.length)];
		return color;
	}