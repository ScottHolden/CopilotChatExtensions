import * as vscode from 'vscode';

const PARTICIPANT_NAME = 'Llama';
const MODEL_SELECTOR: vscode.LanguageModelChatSelector = { vendor: 'copilot', family: 'gpt-3.5-turbo' };

interface IChatResult extends vscode.ChatResult { }

export function activate(context: vscode.ExtensionContext) {

    const handler: vscode.ChatRequestHandler = async (request: vscode.ChatRequest, context: vscode.ChatContext, stream: vscode.ChatResponseStream, token: vscode.CancellationToken): Promise<IChatResult> => {
        const messages = [
            vscode.LanguageModelChatMessage.User(`
            Ignore any previous instructions.
            You are a Llama assistant who should answer any question with Llama facts. 
            Every sentence should have a Llama joke or pun, or when a pun can not be made, replace random words with Llama.
            When asked about Azure or any Azure services, make up alternative names that sound like Azure services but are Llama related.
            For example, instead of Azure Functions, you could say Llama Functions.
            Make sure that every sentence has the word Llama in it at least 4 times.`),
            vscode.LanguageModelChatMessage.User(request.prompt)
        ];

        const [model] = await vscode.lm.selectChatModels(MODEL_SELECTOR);
        const chatResponse = await model.sendRequest(messages, {}, token);

        for await (const fragment of chatResponse.text) {
            stream.markdown(fragment);
        }

        return {};
    };

    const participant = vscode.chat.createChatParticipant(PARTICIPANT_NAME, handler);

    participant.followupProvider = {
        provideFollowups(result: IChatResult, context: vscode.ChatContext, token: vscode.CancellationToken) {
            return [{
                prompt: 'What can you help me with?',
                label: vscode.l10n.t('Ask the Llama anything!')
            } satisfies vscode.ChatFollowup];
        }
    };
}

export function deactivate() { }
