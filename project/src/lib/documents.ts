/**
 * Describes the structure of a User document in the database
 * @author Thomas Appleby - zlac196@live.rhul.ac.uk
 */
export interface User {
	_id: string;
	username: string;
	email: string;
	role: string;
	passwordHash: number;
}

/**
 * Describes the structure of an Asset document in the database
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export interface Asset {
	_id: string;
	assetName: string;
	assetLink: string;
	assetType: string;
	metadataFields: any;
}

/**
 * Describes the structure of an Asset Type document in the database
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export interface Type {
	_id: string;
	typeName: string;
	metadataFields: typeField[];
}
/**
 * Describes the structure of a typeField in an Asset Type
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export interface typeField {
	field: string;
	dataType: string;
	list: boolean;
}

/**
 * Describes the structure of a Discussion board document in the database
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export interface Discussion {
	_id: string;
	boardName: string;
	boardCreator: string;
	description: string;
	messages: message[];
}

/**
 * Describes the structure of a message for a discussion board
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export interface message {
	Date: string;
	Time: string;
	Author: string;
	Message: string;
}

/**
 * Describes the structure of a Diffs entry, for an asset, in the database
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export interface Diff {
	_id: string;
	reference: string;
	original: Asset;
	diffs: generatedDiff[];
}

/**
 * Describes the structure of a generated diff for an Assets diff entry
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export interface generatedDiff {
	author: string;
	date: string;
	time: string;
	changes: change[];
}

/**
 * Describes the structure of a change entry in a generated diff
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export interface change {
	type: string;
	key: string;
	value: string;
	oldValue: string | undefined;
}
