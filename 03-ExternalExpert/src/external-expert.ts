const { OpenAIClient } = require("@azure/openai");
const { DefaultAzureCredential } = require("@azure/identity");
import * as config from "./external-expert.config";

const client = new OpenAIClient(config.azureOpenAIEndpoint, new DefaultAzureCredential());

const chatCompletionsConfig = {
    maxTokens: 400,
    azureExtensionOptions: {
        extensions: [
            {
                type: "azure_search",
                endpoint: config.searchEndpoint,
                authentication:{
                    type: "api_key",
                    apiKey: config.searchKey
                },
                embeddingDependency:{
                    type: "deployment_name",
                    deploymentName: config.azureOpenAIEmbeddingDeployment
                },
                indexName: config.searchIndexName,
                queryType: "vectorSimpleHybrid",
                semanticConfiguration: "default",
                strictness: 3,
                inScope: true
            },
        ],
    },
};

export async function* askQuestion(question: string) {
    const events = await client.streamChatCompletions(config.azureOpenAIChatDeployment, [
        { role: "user", content: question }
    ], chatCompletionsConfig);

    for await (const event of events) {
        for (const choice of event.choices) {
            const delta = choice.delta?.content;
            if (delta !== undefined && delta !== null) {
                yield delta;
            }
        }
    }
}