/* eslint-disable */
// @ts-nocheck
import { Extension } from '@tiptap/core';
import {
  Plugin,
  PluginKey,
} from '@tiptap/pm/state';
import {
  Decoration,
  DecorationSet,
} from '@tiptap/pm/view';

const getRegex = (searchString, disableRegex, caseSensitive) => {
	const escapedString = disableRegex
		? searchString.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")
		: searchString;
	return new RegExp(escapedString, caseSensitive ? "gu" : "gui");
};

function processSearches(
	doc,
	searchTerm,
	selectedResultIndex,
	searchResultClass,
	selectedResultClass,
) {
	const decorations = [];
	const results = [];
	const textNodesWithPosition = [];

	if (!searchTerm) {
		return { decorationsToReturn: DecorationSet.empty, results: [] };
	}

	doc.descendants((node, pos) => {
		if (node.isText) {
			textNodesWithPosition.push({ text: node.text || "", pos });
		}
	});

	for (const { text, pos } of textNodesWithPosition) {
		const matches = Array.from(text.matchAll(searchTerm)).filter(([matchText]) => matchText.trim());

		for (const match of matches) {
			if (match.index !== undefined) {
				results.push({
					from: pos + match.index,
					to: pos + match.index + match[0].length,
				});
			}
		}
	}

	for (let i = 0; i < results.length; i++) {
		const result = results[i];
		if (!result) continue;
		const { from, to } = result;
		decorations.push(
			Decoration.inline(from, to, {
				class: selectedResultIndex === i ? selectedResultClass : searchResultClass,
			}),
		);
	}

	return {
		decorationsToReturn: DecorationSet.create(doc, decorations),
		results,
	};
}

const replace = (replaceTerm, results, { state, dispatch }) => {
	const firstResult = results[0];

	if (!firstResult) {
		return;
	}

	const { from, to } = firstResult;

	if (dispatch) {
		dispatch(state.tr.insertText(replaceTerm, from, to));
	}
};

const rebaseNextResult = (replaceTerm, index, lastOffset, results) => {
	const nextIndex = index + 1;

	if (!results[nextIndex]) {
		return null;
	}

	const currentResult = results[index];
	if (!currentResult) {
		return null;
	}

	const { from: currentFrom, to: currentTo } = currentResult;

	const offset = currentTo - currentFrom - replaceTerm.length + lastOffset;

	const { from, to } = results[nextIndex];

	results[nextIndex] = {
		to: to - offset,
		from: from - offset,
	};

	return [offset, results];
};

const replaceAll = (replaceTerm, results, { tr, dispatch }) => {
	if (!results.length) {
		return;
	}

	let offset = 0;

	for (let i = 0; i < results.length; i++) {
		const result = results[i];
		if (!result) continue;
		const { from, to } = result;
		tr.insertText(replaceTerm, from, to);
		const rebaseResponse = rebaseNextResult(replaceTerm, i, offset, results);

		if (rebaseResponse) {
			offset = rebaseResponse[0];
		}
	}

	dispatch(tr);
};

const selectNext = (editor) => {
	const { results } = editor.storage.searchAndReplace;

	if (!results.length) {
		return;
	}

	const { selectedResult } = editor.storage.searchAndReplace;

	if (selectedResult >= results.length - 1) {
		editor.storage.searchAndReplace.selectedResult = 0;
	} else {
		editor.storage.searchAndReplace.selectedResult += 1;
	}

	const result = results[editor.storage.searchAndReplace.selectedResult];
	if (!result) return;

	const { from } = result;

	const view = editor.view;

	if (view) {
		view
			.domAtPos(from)
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			.node.scrollIntoView({ behavior: "smooth", block: "center" });
	}
};

const selectPrevious = (editor) => {
	const { results } = editor.storage.searchAndReplace;

	if (!results.length) {
		return;
	}

	const { selectedResult } = editor.storage.searchAndReplace;

	if (selectedResult <= 0) {
		editor.storage.searchAndReplace.selectedResult = results.length - 1;
	} else {
		editor.storage.searchAndReplace.selectedResult -= 1;
	}

	const { from } = results[editor.storage.searchAndReplace.selectedResult];

	const view = editor.view;

	if (view) {
		view
			.domAtPos(from)
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			.node.scrollIntoView({ behavior: "smooth", block: "center" });
	}
};

export const searchAndReplacePluginKey = new PluginKey("searchAndReplacePlugin");

export const SearchAndReplace = Extension.create({
	name: "searchAndReplace",

	addOptions() {
		return {
			searchResultClass: " bg-yellow-200",
			selectedResultClass: "bg-yellow-500",
			disableRegex: true,
		};
	},

	addStorage() {
		return {
			searchTerm: "",
			replaceTerm: "",
			results: [],
			lastSearchTerm: "",
			selectedResult: 0,
			lastSelectedResult: 0,
			caseSensitive: false,
			lastCaseSensitiveState: false,
		};
	},

	addCommands() {
		return {
			setSearchTerm:
				(searchTerm) =>
				({ editor }) => {
					editor.storage.searchAndReplace.searchTerm = searchTerm;

					return false;
				},
			setReplaceTerm:
				(replaceTerm) =>
				({ editor }) => {
					editor.storage.searchAndReplace.replaceTerm = replaceTerm;

					return false;
				},
			replace:
				() =>
				({ editor, state, dispatch }) => {
					const { replaceTerm, results } = editor.storage.searchAndReplace;

					replace(replaceTerm, results, { state, dispatch });

					return false;
				},
			replaceAll:
				() =>
				({ editor, tr, dispatch }) => {
					const { replaceTerm, results } = editor.storage.searchAndReplace;

					replaceAll(replaceTerm, results, { tr, dispatch });

					return false;
				},
			selectNextResult:
				() =>
				({ editor }) => {
					selectNext(editor);

					return false;
				},
			selectPreviousResult:
				() =>
				({ editor }) => {
					selectPrevious(editor);

					return false;
				},
			setCaseSensitive:
				(caseSensitive) =>
				({ editor }) => {
					editor.storage.searchAndReplace.caseSensitive = caseSensitive;

					return false;
				},
		};
	},

	addProseMirrorPlugins() {
		const editor = this.editor;
		const { searchResultClass, selectedResultClass, disableRegex } = this.options;

		const setLastSearchTerm = (t) => {
			editor.storage.searchAndReplace.lastSearchTerm = t;
		};

		const setLastSelectedResult = (r) => {
			editor.storage.searchAndReplace.lastSelectedResult = r;
		};

		const setLastCaseSensitiveState = (s) => {
			editor.storage.searchAndReplace.lastCaseSensitiveState = s;
		};

		return [
			new Plugin({
				key: searchAndReplacePluginKey,
				state: {
					init: () => DecorationSet.empty,
					apply({ doc, docChanged }, oldState) {
						const {
							searchTerm,
							selectedResult,
							lastSearchTerm,
							lastSelectedResult,
							caseSensitive,
							lastCaseSensitiveState,
						} = editor.storage.searchAndReplace;

						if (
							!docChanged &&
							lastSearchTerm === searchTerm &&
							selectedResult === lastSelectedResult &&
							lastCaseSensitiveState === caseSensitive
						) {
							return oldState;
						}

						setLastSearchTerm(searchTerm);
						setLastSelectedResult(selectedResult);
						setLastCaseSensitiveState(caseSensitive);

						if (!searchTerm) {
							editor.storage.searchAndReplace.selectedResult = 0;
							editor.storage.searchAndReplace.results = [];
							return DecorationSet.empty;
						}

						const { decorationsToReturn, results } = processSearches(
							doc,
							getRegex(searchTerm, disableRegex, caseSensitive),
							selectedResult,
							searchResultClass,
							selectedResultClass,
						);

						editor.storage.searchAndReplace.results = results;

						if (selectedResult > results.length) {
							editor.storage.searchAndReplace.selectedResult = 1;
							editor.commands.selectPreviousResult();
						}

						return decorationsToReturn;
					},
				},
				props: {
					decorations(state) {
						return this.getState(state);
					},
				},
			}),
		];
	},
});

export default SearchAndReplace;
