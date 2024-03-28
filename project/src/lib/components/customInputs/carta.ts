import DOMPurify from 'dompurify';
import { emoji } from '@cartamd/plugin-emoji';
import { slash } from '@cartamd/plugin-slash';
import { code } from '@cartamd/plugin-code';
import { math } from '@cartamd/plugin-math';
import { anchor } from '@cartamd/plugin-anchor';
import { subscript } from 'carta-plugin-subscript';
import { insdel } from 'carta-plugin-ins-del';
import { imsize } from 'carta-plugin-imsize';
import { Carta } from 'carta-md';

/**
 * The Carta object used in the CartaEditor. Uses Isomorphic DOMPurify to sanitize input. Has the following extensions: emoji, slash, code, math, anchor, subscript, insdel and imsize. The slash menu has a snippet with an action for every feature of the editor. Used to write messages.
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export const carta = new Carta({
	sanitizer: DOMPurify.sanitize,
	extensions: [
		emoji(),
		slash({
			snippets: [
				{
					id: 'Bold',
					group: 'Text',
					title: 'Bold',

					description: 'Add bold text',
					action: (input) => {
						input.textarea.value += '**Bold text**';
					}
				},
				{
					id: 'Italics',
					group: 'Text',
					title: 'Italics',

					description: 'Add italicized text',
					action: (input) => {
						input.textarea.value += '_Italicized text_';
					}
				},
				{
					id: 'Strikethrough',
					group: 'Text',
					title: 'Strikethrough',

					description: 'Add crossed out text',
					action: (input) => {
						input.textarea.value += '~~Crossed out text~~';
					}
				},
				{
					id: 'SuperScript',
					group: 'Text',
					title: 'Superscript',

					description: 'Add superscripts',
					action: (input) => {
						input.textarea.value += '^superscript^';
					}
				},
				{
					id: 'SubScript',
					group: 'Text',
					title: 'Subscript',

					description: 'Add subscripts',
					action: (input) => {
						input.textarea.value += '~subscript~';
					}
				},
				{
					id: 'LineBreak',
					group: 'Text',
					title: 'Line Break',

					description: 'Separate text',
					action: (input) => {
						input.textarea.value += '<br>';
					}
				},
				{
					id: 'ThematicBreak ',
					group: 'Text',
					title: 'Thematic Break',

					description: 'Add a horizontal line',
					action: (input) => {
						input.textarea.value += '<hr>';
					}
				},
				{
					id: 'Link',
					group: 'Link',
					title: 'Link',

					description: 'Link anywhere; assets, types, etc.',
					action: (input) => {
						input.textarea.value += '[Link text](url)';
					}
				},
				{
					id: 'Images ',
					group: 'Link',
					title: 'Image',

					description: 'Add an image',
					action: (input) => {
						input.textarea.value +=
							'With all parameters:\n![image alt](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/220px-Image_created_with_a_mobile_phone.png "image title" =200x300)\n\nWith only width and height:\n![image alt](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/220px-Image_created_with_a_mobile_phone.png =200x300)\n\nWith only height:\n![image alt](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/220px-Image_created_with_a_mobile_phone.png =x300)\n\nWith only width:\n![image alt](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/220px-Image_created_with_a_mobile_phone.png =200x)\n\nWith no parameters:\n![image alt](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/220px-Image_created_with_a_mobile_phone.png =x)\n![image alt](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/220px-Image_created_with_a_mobile_phone.png)';
					}
				},
				{
					id: 'Insert',
					group: 'Extra',
					title: "'Insert' Mark",

					description: 'Add text like an insert in a diff',
					action: (input) => {
						input.textarea.value += '++inserted code++';
					}
				},
				{
					id: 'Delete',
					group: 'Extra',
					title: "'Delete' Mark",

					description: 'Add text like a deletion in a diff',
					action: (input) => {
						input.textarea.value += '--deleted code--';
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
		anchor(),
		subscript(),
		insdel(),
		imsize()
	]
});

/**
 * The Carta object used in the CartaViewer. Uses Isomorphic DOMPurify to sanitize input. Has the following extensions: emoji, code, math, anchor, subscript, insdel and imsize. Used to render messages.
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export const cartaViewer = new Carta({
	sanitizer: DOMPurify.sanitize,
	extensions: [emoji(), code(), math(), anchor(), subscript(), insdel(), imsize()]
});
