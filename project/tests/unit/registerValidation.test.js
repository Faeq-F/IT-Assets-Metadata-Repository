import { expect, test } from 'vitest';
import { hashCode, containNumbers } from '$lib/scripts/validate';

test('HashCode', () => {
	const result = hashCode('test');
	expect(result).toEqual(3556498);
});

test('ContainNumbersFail', () => {
	const check = containNumbers(3);
	const result = check('test1');
	expect(result).toEqual({ containNumbers: 3 });
});

test('ContainNumbersPass', () => {
	const check = containNumbers(1);
	const result = check('test2');
	expect(result).toEqual(undefined);
});
