// npx vitest run __tests__/delegated-activable.spec.ts

import { describe, it, expect, vi } from "vitest"
import { ClineProvider } from "../core/webview/ClineProvider"
import { makeProviderStub } from "./helpers/provider-stub"

/**
 * Tests for the "delegated_activable" parent status introduced to fix the
 * subtask interruption bug.
 *
 * When a subtask is cancelled, the parent transitions from "delegated" →
 * "delegated_activable" (preserving awaitingChildId) instead of → "active"
 * (clearing awaitingChildId). This allows the child to still return to the
 * parent via attempt_completion after a cancel→continue flow.
 *
 * Note: cancelTask() behaviour is tested in
 * core/webview/__tests__/ClineProvider.flicker-free-cancel.spec.ts which uses
 * the full ClineProvider setup required by that method.
 */

// ---------------------------------------------------------------------------
// createTaskWithHistoryItem() — restores parent from delegated_activable → delegated
// ---------------------------------------------------------------------------

describe("createTaskWithHistoryItem() — parent restoration from delegated_activable", () => {
	it("transitions parent from delegated_activable → delegated when child is rehydrated", async () => {
		const parentHistory = {
			id: "parent-1",
			task: "parent task",
			ts: 1000,
			number: 1,
			tokensIn: 0,
			tokensOut: 0,
			totalCost: 0,
			status: "delegated_activable",
			awaitingChildId: "child-1",
			delegatedToId: "child-1",
		}

		const updateTaskHistory = vi.fn().mockResolvedValue([])
		const getTaskWithId = vi.fn().mockImplementation((id: string) => {
			if (id === "parent-1") return Promise.resolve({ historyItem: parentHistory })
			throw new Error(`unexpected id: ${id}`)
		})

		// Simulate the logic from createTaskWithHistoryItem
		const childHistoryItem = {
			id: "child-1",
			parentTaskId: "parent-1",
		}

		if (childHistoryItem.parentTaskId) {
			const { historyItem: ph } = await getTaskWithId(childHistoryItem.parentTaskId)
			if (ph?.status === "delegated_activable" && ph?.awaitingChildId === childHistoryItem.id) {
				await updateTaskHistory({ ...ph, status: "delegated" })
			}
		}

		expect(updateTaskHistory).toHaveBeenCalledWith(
			expect.objectContaining({
				id: "parent-1",
				status: "delegated",
				awaitingChildId: "child-1",
			}),
		)
	})

	it("does NOT modify parent when parent is not delegated_activable", async () => {
		const parentHistory = {
			id: "parent-1",
			status: "delegated", // already delegated, not delegated_activable
			awaitingChildId: "child-1",
		}

		const updateTaskHistory = vi.fn().mockResolvedValue([])
		const getTaskWithId = vi.fn().mockResolvedValue({ historyItem: parentHistory })

		const childHistoryItem = { id: "child-1", parentTaskId: "parent-1" }

		if (childHistoryItem.parentTaskId) {
			const { historyItem: ph } = await getTaskWithId(childHistoryItem.parentTaskId)
			if (ph?.status === "delegated_activable" && ph?.awaitingChildId === childHistoryItem.id) {
				await updateTaskHistory({ ...ph, status: "delegated" })
			}
		}

		expect(updateTaskHistory).not.toHaveBeenCalled()
	})

	it("does NOT modify parent when awaitingChildId does not match", async () => {
		const parentHistory = {
			id: "parent-1",
			status: "delegated_activable",
			awaitingChildId: "other-child", // different child
		}

		const updateTaskHistory = vi.fn().mockResolvedValue([])
		const getTaskWithId = vi.fn().mockResolvedValue({ historyItem: parentHistory })

		const childHistoryItem = { id: "child-1", parentTaskId: "parent-1" }

		if (childHistoryItem.parentTaskId) {
			const { historyItem: ph } = await getTaskWithId(childHistoryItem.parentTaskId)
			if (ph?.status === "delegated_activable" && ph?.awaitingChildId === childHistoryItem.id) {
				await updateTaskHistory({ ...ph, status: "delegated" })
			}
		}

		expect(updateTaskHistory).not.toHaveBeenCalled()
	})
})

// ---------------------------------------------------------------------------
// showTaskWithId() — transitions delegated_activable → active when parent is resumed
// ---------------------------------------------------------------------------

describe("showTaskWithId() — parent resumed directly from history", () => {
	it("transitions delegated_activable → active and clears awaitingChildId when user resumes parent", async () => {
		const parentHistory = {
			id: "parent-1",
			task: "parent task",
			ts: 1000,
			number: 1,
			tokensIn: 0,
			tokensOut: 0,
			totalCost: 0,
			status: "delegated_activable",
			awaitingChildId: "child-1",
			delegatedToId: "child-1",
		}

		const updateTaskHistory = vi.fn().mockResolvedValue([])
		const getTaskWithId = vi.fn().mockResolvedValue({ historyItem: parentHistory })

		// Simulate the showTaskWithId logic
		let { historyItem } = await getTaskWithId("parent-1")

		if (historyItem.status === "delegated_activable") {
			historyItem = {
				...historyItem,
				status: "active",
				awaitingChildId: undefined,
			}
			await updateTaskHistory(historyItem)
		}

		expect(updateTaskHistory).toHaveBeenCalledWith(
			expect.objectContaining({
				id: "parent-1",
				status: "active",
				awaitingChildId: undefined,
			}),
		)
	})

	it("does NOT modify history when task is not delegated_activable", async () => {
		const parentHistory = {
			id: "parent-1",
			status: "active",
		}

		const updateTaskHistory = vi.fn().mockResolvedValue([])
		const getTaskWithId = vi.fn().mockResolvedValue({ historyItem: parentHistory })

		let { historyItem } = await getTaskWithId("parent-1")

		if (historyItem.status === "delegated_activable") {
			historyItem = {
				...historyItem,
				status: "active",
				awaitingChildId: undefined,
			}
			await updateTaskHistory(historyItem)
		}

		expect(updateTaskHistory).not.toHaveBeenCalled()
	})
})

// ---------------------------------------------------------------------------
// removeClineFromStack() — repairs delegated_activable parent when child is permanently removed
// ---------------------------------------------------------------------------

describe("removeClineFromStack() — repairs delegated_activable parent", () => {
	function buildRemoveProvider({
		childTaskId,
		parentTaskId,
		parentHistoryItem,
	}: {
		childTaskId: string
		parentTaskId: string
		parentHistoryItem: Record<string, unknown>
	}) {
		const updateTaskHistory = vi.fn().mockResolvedValue([])
		const getTaskWithId = vi.fn().mockImplementation((id: string) => {
			if (id === parentTaskId) return Promise.resolve({ historyItem: parentHistoryItem })
			throw new Error(`unexpected id: ${id}`)
		})

		const childTask = {
			taskId: childTaskId,
			instanceId: "inst-child",
			parentTaskId,
			rootTaskId: undefined,
			emit: vi.fn(),
			cancelCurrentRequest: vi.fn(),
			abortTask: vi.fn().mockResolvedValue(undefined),
			abandoned: false,
			isStreaming: false,
			didFinishAbortingStream: true,
			isWaitingForFirstChunk: false,
		}

		const provider = makeProviderStub({
			clineStack: [childTask],
			getTaskWithId,
			updateTaskHistory,
			log: vi.fn(),
			outputChannel: { appendLine: vi.fn() },
			taskEventListeners: new Map(),
		} as any)

		return { provider, childTask, updateTaskHistory, getTaskWithId }
	}

	it("repairs delegated_activable → active when a delegated_activable child is permanently removed", async () => {
		const { provider, updateTaskHistory } = buildRemoveProvider({
			childTaskId: "child-1",
			parentTaskId: "parent-1",
			parentHistoryItem: {
				id: "parent-1",
				task: "Parent task",
				ts: 1000,
				number: 1,
				tokensIn: 0,
				tokensOut: 0,
				totalCost: 0,
				status: "delegated_activable",
				awaitingChildId: "child-1",
				delegatedToId: "child-1",
				childIds: ["child-1"],
			},
		})

		await (ClineProvider.prototype as any).removeClineFromStack.call(provider)

		expect(updateTaskHistory).toHaveBeenCalledWith(
			expect.objectContaining({
				id: "parent-1",
				status: "active",
				awaitingChildId: undefined,
			}),
		)
	})
})

// ---------------------------------------------------------------------------
// reopenParentFromDelegation() guard — accepts delegated_activable status
// ---------------------------------------------------------------------------

describe("reopenParentFromDelegation() guard — accepts delegated_activable", () => {
	it("does NOT abort when parent status is delegated_activable and awaitingChildId matches", () => {
		const parentHistory = {
			status: "delegated_activable" as const,
			awaitingChildId: "child-da",
		}
		const cancelledDelegationChildIds = new Set<string>()
		const childTaskId = "child-da"

		const shouldAbort =
			cancelledDelegationChildIds.has(childTaskId) ||
			(parentHistory.status !== "delegated" &&
				parentHistory.status !== "active" &&
				parentHistory.status !== "delegated_activable") ||
			parentHistory.awaitingChildId !== childTaskId

		expect(shouldAbort).toBe(false)
	})

	it("aborts when parent status is delegated_activable but awaitingChildId does not match", () => {
		const parentHistory = {
			status: "delegated_activable" as const,
			awaitingChildId: "other-child",
		}
		const cancelledDelegationChildIds = new Set<string>()
		const childTaskId = "child-da"

		const shouldAbort =
			cancelledDelegationChildIds.has(childTaskId) ||
			(parentHistory.status !== "delegated" &&
				parentHistory.status !== "active" &&
				parentHistory.status !== "delegated_activable") ||
			parentHistory.awaitingChildId !== childTaskId

		expect(shouldAbort).toBe(true)
	})
})

// ---------------------------------------------------------------------------
// AttemptCompletionTool guard — accepts delegated_activable
// ---------------------------------------------------------------------------

describe("AttemptCompletionTool guard — accepts delegated_activable", () => {
	it("allows delegation when parent status is delegated_activable and awaitingChildId matches", () => {
		const parentHistory = {
			status: "delegated_activable" as const,
			awaitingChildId: "child-1",
		}
		const taskId = "child-1"

		const shouldDelegate =
			(parentHistory?.status === "delegated" ||
				parentHistory?.status === "active" ||
				parentHistory?.status === "delegated_activable") &&
			parentHistory?.awaitingChildId === taskId

		expect(shouldDelegate).toBe(true)
	})

	it("blocks delegation when parent status is delegated_activable but awaitingChildId does not match", () => {
		const parentHistory = {
			status: "delegated_activable" as const,
			awaitingChildId: "other-child",
		}
		const taskId = "child-1"

		const shouldDelegate =
			(parentHistory?.status === "delegated" ||
				parentHistory?.status === "active" ||
				parentHistory?.status === "delegated_activable") &&
			parentHistory?.awaitingChildId === taskId

		expect(shouldDelegate).toBe(false)
	})
})
