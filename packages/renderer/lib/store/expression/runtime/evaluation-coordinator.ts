import { IEvaluationCoordinator, IExpressionSlot } from "../../../types.ts";

export class CircularDependencyError extends Error {}

export class EvaluationCoordinator implements IEvaluationCoordinator {
  // Tracks nested expression reads to detect circular dependencies across slots.
  private readonly evaluationStack: string[] = [];

  // Guards against runaway calculated writes by counting how often a slot mutates in one reaction cascade.
  private readonly writeCounts = new WeakMap<IExpressionSlot, number>();
  private readonly recentWriters = new Set<IExpressionSlot>();

  constructor(private readonly maxPasses = 20) {}

  trackEvaluation<T>(slot: IExpressionSlot, run: () => T): T {
    const existingIndex = this.evaluationStack.indexOf(slot.toString());

    if (existingIndex !== -1) {
      slot.setCycleDetected([
        ...this.evaluationStack.slice(existingIndex),
        slot.toString(),
      ]);
      throw new CircularDependencyError("Circular dependency detected.");
    }

    this.evaluationStack.push(slot.toString());

    try {
      return run();
    } finally {
      const popped = this.evaluationStack.pop();
      if (popped !== slot.toString()) {
        this.evaluationStack.length = 0;
      }
    }
  }

  trackWrite(slot: IExpressionSlot, commit: () => boolean): void {
    // Every write attempt increases the slot’s pass count; exceeding maxPasses treats it as a cycle.
    this.recentWriters.add(slot);
    const next = (this.writeCounts.get(slot) ?? 0) + 1;
    this.writeCounts.set(slot, next);
    if (next > this.maxPasses) {
      for (const writer of this.recentWriters) {
        writer.setCycleDetected([]);
      }
    } else {
      // Returning true means the slot stabilized, so counters can be cleared.
      if (commit()) {
        this.writeCounts.delete(slot);
        this.recentWriters.delete(slot);
        slot.clearCycleDetected();
      }
    }
  }
}
