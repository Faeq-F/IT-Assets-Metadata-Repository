import { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const UItheme = {
	name: 'my-custom-theme',
	properties: {
		// =~= Theme Properties =~=
		'--theme-font-family-base': `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		'--theme-font-family-heading': `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		'--theme-font-color-base': '0 0 0',
		'--theme-font-color-dark': '255 255 255',
		'--theme-rounded-base': '9999px',
		'--theme-rounded-container': '16px',
		'--theme-border-base': '1px',
		// =~= Theme On-X Colors =~=
		'--on-primary': '0 0 0',
		'--on-secondary': '0 0 0',
		'--on-tertiary': '0 0 0',
		'--on-success': '255 255 255',
		'--on-warning': '255 255 255',
		'--on-error': '255 255 255',
		'--on-surface': '255 255 255',
		// =~= Theme Colors  =~=
		// primary | #bfbfff
		'--color-primary-50': '245 245 255', // #f5f5ff
		'--color-primary-100': '242 242 255', // #f2f2ff
		'--color-primary-200': '239 239 255', // #efefff
		'--color-primary-300': '229 229 255', // #e5e5ff
		'--color-primary-400': '210 210 255', // #d2d2ff
		'--color-primary-500': '191 191 255', // #bfbfff
		'--color-primary-600': '172 172 230', // #acace6
		'--color-primary-700': '143 143 191', // #8f8fbf
		'--color-primary-800': '115 115 153', // #737399
		'--color-primary-900': '94 94 125', // #5e5e7d
		// secondary | #ac8cae
		'--color-secondary-50': '243 238 243', // #f3eef3
		'--color-secondary-100': '238 232 239', // #eee8ef
		'--color-secondary-200': '234 226 235', // #eae2eb
		'--color-secondary-300': '222 209 223', // #ded1df
		'--color-secondary-400': '197 175 198', // #c5afc6
		'--color-secondary-500': '172 140 174', // #ac8cae
		'--color-secondary-600': '155 126 157', // #9b7e9d
		'--color-secondary-700': '129 105 131', // #816983
		'--color-secondary-800': '103 84 104', // #675468
		'--color-secondary-900': '84 69 85', // #544555
		// tertiary | #848baa
		'--color-tertiary-50': '237 238 242', // #edeef2
		'--color-tertiary-100': '230 232 238', // #e6e8ee
		'--color-tertiary-200': '224 226 234', // #e0e2ea
		'--color-tertiary-300': '206 209 221', // #ced1dd
		'--color-tertiary-400': '169 174 196', // #a9aec4
		'--color-tertiary-500': '132 139 170', // #848baa
		'--color-tertiary-600': '119 125 153', // #777d99
		'--color-tertiary-700': '99 104 128', // #636880
		'--color-tertiary-800': '79 83 102', // #4f5366
		'--color-tertiary-900': '65 68 83', // #414453
		// success | #007d00
		'--color-success-50': '217 236 217', // #d9ecd9
		'--color-success-100': '204 229 204', // #cce5cc
		'--color-success-200': '191 223 191', // #bfdfbf
		'--color-success-300': '153 203 153', // #99cb99
		'--color-success-400': '77 164 77', // #4da44d
		'--color-success-500': '0 125 0', // #007d00
		'--color-success-600': '0 113 0', // #007100
		'--color-success-700': '0 94 0', // #005e00
		'--color-success-800': '0 75 0', // #004b00
		'--color-success-900': '0 61 0', // #003d00
		// warning | #008080
		'--color-warning-50': '217 236 236', // #d9ecec
		'--color-warning-100': '204 230 230', // #cce6e6
		'--color-warning-200': '191 223 223', // #bfdfdf
		'--color-warning-300': '153 204 204', // #99cccc
		'--color-warning-400': '77 166 166', // #4da6a6
		'--color-warning-500': '0 128 128', // #008080
		'--color-warning-600': '0 115 115', // #007373
		'--color-warning-700': '0 96 96', // #006060
		'--color-warning-800': '0 77 77', // #004d4d
		'--color-warning-900': '0 63 63', // #003f3f
		// error | #d70000
		'--color-error-50': '249 217 217', // #f9d9d9
		'--color-error-100': '247 204 204', // #f7cccc
		'--color-error-200': '245 191 191', // #f5bfbf
		'--color-error-300': '239 153 153', // #ef9999
		'--color-error-400': '227 77 77', // #e34d4d
		'--color-error-500': '215 0 0', // #d70000
		'--color-error-600': '194 0 0', // #c20000
		'--color-error-700': '161 0 0', // #a10000
		'--color-error-800': '129 0 0', // #810000
		'--color-error-900': '105 0 0', // #690000
		// surface | #575757
		'--color-surface-50': '230 230 230', // #e6e6e6
		'--color-surface-100': '221 221 221', // #dddddd
		'--color-surface-200': '213 213 213', // #d5d5d5
		'--color-surface-300': '188 188 188', // #bcbcbc
		'--color-surface-400': '137 137 137', // #898989
		'--color-surface-500': '87 87 87', // #575757
		'--color-surface-600': '78 78 78', // #4e4e4e
		'--color-surface-700': '65 65 65', // #414141
		'--color-surface-800': '52 52 52', // #343434
		'--color-surface-900': '43 43 43' // #2b2b2b
	}
};
