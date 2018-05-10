'use strict';

import * as vscode from 'vscode';
import { TextAutocompleteCompletionItemProvider } from './text_autocomplete_completion_item_provider';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "text-autocomplete" is now active!');

	const selector = '*';
	const completionItemProvider = new TextAutocompleteCompletionItemProvider();
	const completionItemProviderDisposable = vscode.languages.registerCompletionItemProvider(selector, completionItemProvider);

	context.subscriptions.push(completionItemProviderDisposable);
}

export function deactivate() {
}
