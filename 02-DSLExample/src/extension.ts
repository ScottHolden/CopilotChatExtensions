import * as vscode from 'vscode';
import * as smedsl from './smedsl-spec';


const PARTICIPANT_NAME = 'smedsl';
const MODEL_SELECTOR: vscode.LanguageModelChatSelector = { vendor: 'copilot', family: 'gpt-3.5-turbo' };

interface IChatResult extends vscode.ChatResult { }

export function activate(context: vscode.ExtensionContext) {

    const handler: vscode.ChatRequestHandler = async (request: vscode.ChatRequest, context: vscode.ChatContext, stream: vscode.ChatResponseStream, token: vscode.CancellationToken): Promise<IChatResult> => {
        const messages = [
            vscode.LanguageModelChatMessage.User(`
            Ignore any previous instructions.
            You are a DSL subject matter expert. Respond to questions about the DSL specification below. Only respond to questions related to the DSL specification below.
            Make sure to provide clear and concise answers. If unsure about anything ask for clarification.
            Do not talk about actual implementations or code. Only respond to questions related to the DSL specification below. Provide the answer and nothing else.

            DSL Specification:
            ${smedsl.Specification}
            
            Only respond to questions related to the DSL specification above. If asked about anything else respond with "I can only answer questions related to DSL.".`),
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
}

export function deactivate() { }
