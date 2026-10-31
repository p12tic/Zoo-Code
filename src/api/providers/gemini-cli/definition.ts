import { z } from "zod"

import { providerIdentifiers } from "@roo-code/types"
import { anthropicDefaultModelId } from "../anthropic/definition"
import {
	API_MODEL_ID_FIELD,
	apiModelIdProviderModelShape,
	createModelIdAccessor,
	createProviderDefinition,
} from "../common"

export const geminiCliProviderDefinition = createProviderDefinition({
	apiProvider: providerIdentifiers.geminiCli,
	modelIdKey: API_MODEL_ID_FIELD,
	getModelId: createModelIdAccessor(API_MODEL_ID_FIELD),
	// Gemini CLI has no catalog of its own; it keeps the Anthropic fallback default.
	getDefaultModelId: () => anthropicDefaultModelId,
	schema: {
		...apiModelIdProviderModelShape,
		geminiCliOAuthPath: z.string().optional(),
		geminiCliProjectId: z.string().optional(),
	},
})
