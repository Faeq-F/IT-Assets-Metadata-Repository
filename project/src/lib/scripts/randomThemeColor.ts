/**
 * gets a random color from a list of colors from the apps theme
 * @returns a random color from the apps theme
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export default function getRandomColor(): string {
	let colors = [
		'#FFE6E6',
		'#E1AFD1',
		'#AD88C6',
		'#7469B6',
		'#8E7AB5',
		'#B784B7',
		'#E493B3',
		'#EEA5A6',
		'#9195F6',
		'#FB88B4',
		'#F8EDFF',
		'#FFC5C5',
		'#FFEBD8',
		'#F1EAFF',
		'#E5D4FF',
		'#DCBFFF',
		'#D0A2F7'
	];
	let color = colors[Math.floor(Math.random() * colors.length)];
	return color;
}
