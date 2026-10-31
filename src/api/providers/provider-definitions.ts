export * from "./anthropic/definition"
export * from "./baseten/definition"
export * from "./bedrock/definition"
export * from "./deepseek/definition"
export * from "./fake-ai/definition"
export * from "./fireworks/definition"
export * from "./friendli/definition"
export * from "./gemini/definition"
export * from "./gemini-cli/definition"
export * from "./lite-llm/definition"
export * from "./litellm/definition"
export * from "./lm-studio/definition"
export * from "./mistral/definition"
export * from "./moonshot/definition"
export * from "./ollama/definition"
export * from "./openai/definition"
export * from "./openai-codex/definition"
export type { OpenAiCodexRateLimitInfo } from "@roo-code/types"
export * from "./openai-native/definition"
export * from "./openrouter/definition"
export * from "./poe/definition"
export * from "./qwen-code/definition"
export * from "./requesty/definition"
export * from "./sambanova/definition"
export * from "./unbound/definition"
export * from "./vertex/definition"
export * from "./vscode-lm/definition"
export * from "./vscode-llm/definition"
export * from "./xai/definition"
export * from "./vercel-ai-gateway/definition"
export * from "./opencode-go/definition"
export * from "./kenari/definition"
export * from "./io-intelligence/definition"
export * from "./nanogpt/definition"
export * from "./kimi-code/definition"
export * from "./zai/definition"
export * from "./minimax/definition"
export * from "./mimo/definition"
export * from "./zoo-gateway/definition"

export type { ProviderDefinition } from "./common"

import { anthropicProviderDefinition } from "./anthropic/definition"
import { basetenProviderDefinition } from "./baseten/definition"
import { bedrockProviderDefinition } from "./bedrock/definition"
import { deepSeekProviderDefinition } from "./deepseek/definition"
import { fakeAiProviderDefinition } from "./fake-ai/definition"
import { fireworksProviderDefinition } from "./fireworks/definition"
import { friendliProviderDefinition } from "./friendli/definition"
import { geminiProviderDefinition } from "./gemini/definition"
import { geminiCliProviderDefinition } from "./gemini-cli/definition"
import { ioIntelligenceProviderDefinition } from "./io-intelligence/definition"
import { kenariProviderDefinition } from "./kenari/definition"
import { kimiCodeProviderDefinition } from "./kimi-code/definition"
import { litellmProviderDefinition } from "./litellm/definition"
import { lmStudioProviderDefinition } from "./lm-studio/definition"
import { mimoProviderDefinition } from "./mimo/definition"
import { minimaxProviderDefinition } from "./minimax/definition"
import { mistralProviderDefinition } from "./mistral/definition"
import { moonshotProviderDefinition } from "./moonshot/definition"
import { nanoGptProviderDefinition } from "./nanogpt/definition"
import { ollamaProviderDefinition } from "./ollama/definition"
import { openAiProviderDefinition } from "./openai/definition"
import { openAiCodexProviderDefinition } from "./openai-codex/definition"
import { openAiNativeProviderDefinition } from "./openai-native/definition"
import { opencodeGoProviderDefinition } from "./opencode-go/definition"
import { openRouterProviderDefinition } from "./openrouter/definition"
import { poeProviderDefinition } from "./poe/definition"
import { qwenCodeProviderDefinition } from "./qwen-code/definition"
import { requestyProviderDefinition } from "./requesty/definition"
import { sambaNovaProviderDefinition } from "./sambanova/definition"
import { unboundProviderDefinition } from "./unbound/definition"
import { vercelAiGatewayProviderDefinition } from "./vercel-ai-gateway/definition"
import { vertexProviderDefinition } from "./vertex/definition"
import { githubCopilotProviderDefinition, vsCodeLmProviderDefinition } from "./vscode-lm/definition"
import { xaiProviderDefinition } from "./xai/definition"
import { zaiProviderDefinition } from "./zai/definition"
import { zooGatewayProviderDefinition } from "./zoo-gateway/definition"

import type { ProviderDefinition } from "./common"

export const providerDefinitionList = [
	anthropicProviderDefinition,
	openRouterProviderDefinition,
	bedrockProviderDefinition,
	vertexProviderDefinition,
	openAiProviderDefinition,
	ollamaProviderDefinition,
	vsCodeLmProviderDefinition,
	githubCopilotProviderDefinition,
	lmStudioProviderDefinition,
	geminiProviderDefinition,
	geminiCliProviderDefinition,
	openAiCodexProviderDefinition,
	openAiNativeProviderDefinition,
	mistralProviderDefinition,
	deepSeekProviderDefinition,
	poeProviderDefinition,
	moonshotProviderDefinition,
	kimiCodeProviderDefinition,
	minimaxProviderDefinition,
	mimoProviderDefinition,
	requestyProviderDefinition,
	unboundProviderDefinition,
	fakeAiProviderDefinition,
	xaiProviderDefinition,
	litellmProviderDefinition,
	sambaNovaProviderDefinition,
	zaiProviderDefinition,
	fireworksProviderDefinition,
	friendliProviderDefinition,
	qwenCodeProviderDefinition,
	vercelAiGatewayProviderDefinition,
	opencodeGoProviderDefinition,
	kenariProviderDefinition,
	nanoGptProviderDefinition,
	ioIntelligenceProviderDefinition,
	zooGatewayProviderDefinition,
	basetenProviderDefinition,
] as const satisfies readonly ProviderDefinition[]
