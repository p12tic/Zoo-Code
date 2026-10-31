import { z } from "zod"

import { serviceTierSchema, providerIdentifiers } from "@roo-code/types"
import {
	API_MODEL_ID_FIELD,
	apiModelIdProviderModelShape,
	createModelIdAccessor,
	createProviderDefinition,
} from "../common"
import { openAiNativeDefaultModelId } from "../openai/definition"

export const openAiNativeProviderDefinition = createProviderDefinition({
	apiProvider: providerIdentifiers.openaiNative,
	modelIdKey: API_MODEL_ID_FIELD,
	getModelId: createModelIdAccessor(API_MODEL_ID_FIELD),
	getDefaultModelId: () => openAiNativeDefaultModelId,
	schema: {
		...apiModelIdProviderModelShape,
		openAiNativeApiKey: z.string().optional(),
		openAiNativeBaseUrl: z.string().optional(),
		// OpenAI Responses API service tier for openai-native provider only.
		// UI should only expose this when the selected model supports flex/priority.
		openAiNativeServiceTier: serviceTierSchema.optional(),
	},
})
