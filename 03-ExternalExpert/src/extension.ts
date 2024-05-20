import * as vscode from 'vscode';
import * as ee from './external-expert';

const PARTICIPANT_NAME = 'healthcare';

export function activate(context: vscode.ExtensionContext) {

    const handler: vscode.ChatRequestHandler = async (request: vscode.ChatRequest, context: vscode.ChatContext, stream: vscode.ChatResponseStream, token: vscode.CancellationToken): Promise<vscode.ChatResult> => {

        const chatResponse = await ee.askQuestion(request.prompt);

        for await (const fragment of chatResponse) {
            stream.markdown(fragment);
        }

        return {};
    };

    const participant = vscode.chat.createChatParticipant(PARTICIPANT_NAME, handler);
}

export function deactivate() { }
