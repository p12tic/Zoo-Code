import { z } from "zod"

import { providerIdentifiers } from "@roo-code/types"
import { baseProviderSettingsShape, createModelIdAccessor, createProviderDefinition } from "../common"
import { litellmDefaultModelId } from "../lite-llm/definition"

export const LITELLM_MODEL_ID_FIELD = "litellmModelId"

export const litellmProviderDefinition = createProviderDefinition({
	apiProvider: providerIdentifiers.litellm,
	modelIdKey: LITELLM_MODEL_ID_FIELD,
	getModelId: createModelIdAccessor(LITELLM_MODEL_ID_FIELD),
	getDefaultModelId: () => litellmDefaultModelId,
	schema: {
		...baseProviderSettingsShape,
		litellmBaseUrl: z.string().optional(),
		litellmApiKey: z.string().optional(),
		[LITELLM_MODEL_ID_FIELD]: z.string().optional(),
		litellmUsePromptCache: z.boolean().optional(),
	},
})
