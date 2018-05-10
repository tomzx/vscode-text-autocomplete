import * as TrieSearch from 'trie-search';
import { CompletionItemProvider, TextDocument, Position, CancellationToken, CompletionItem, CompletionContext, ProviderResult, CompletionList, CompletionItemKind, Range } from 'vscode';
import { wordFrequencies } from './dictionaries/en';

interface TrieObject {
	key: string;
	index: number;
}

export class TextAutocompleteCompletionItemProvider implements CompletionItemProvider {
	private words: TrieSearch = new TrieSearch('key');

	public constructor() {
		this.setupDictionary();
	}

	protected setupDictionary(): void {
		this.words = new TrieSearch('key');
		let i = 0;
		this.words.addAll(wordFrequencies.map((value: string) => {
			return {
				key: value,
				index: ++i
			};
		}));
	}

	public provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext): ProviderResult<CompletionItem[] | CompletionList> {
		let wordToComplete = '';
		const range = document.getWordRangeAtPosition(position);
		if (range) {
			wordToComplete = document.getText(new Range(range.start, position));
		}

		const results = this.words.get(wordToComplete);

		// Sort the results by index
		results.sort((a: TrieObject, b: TrieObject) => {
			return a.index - b.index;
		});

		const numberOfWordsInResults = results.length;
		const items: CompletionItem[] = [];
		for (let [i, tag] of results.entries()) {
			let completionItem = new CompletionItem(tag.key, CompletionItemKind.Text);
			// Set sortText to order the value when displaying them in the autocompletion menu
			completionItem.sortText = this.stringPad(i.toString(), numberOfWordsInResults.toString().length, '0', 'STR_PAD_LEFT');
			items.push(completionItem);
		}

		return items;
	}

	private stringPad(input: string, padLength: number, padString: string, padType: string = 'STR_PAD_RIGHT'): string {
		const count = Math.max(0, padLength - input.length);
		const padMultiple = Math.ceil(count / padString.length);
		// This is a bit lazy... If the padString is multiple characters, we still need to limit the string length to the count
		const paddingString = padString.repeat(padMultiple).substr(0, count);
		if (padType === 'STR_PAD_LEFT') {
			return paddingString + input;
		} else if (padType === 'STR_PAD_RIGHT') {
			return input + paddingString;
		}

		return input;
	}
}
