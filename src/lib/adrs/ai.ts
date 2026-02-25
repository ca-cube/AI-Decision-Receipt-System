import { DecisionReceipt } from './crypto';

export interface AnomalyInsight {
    type: 'CONFIDENCE_DROP' | 'DRIFT' | 'CLUSTER_OUTLIER' | 'POLICY_VIOLATION';
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    description: string;
    receiptId: string;
}

/**
 * Layer 1: Anomaly Detection
 * Detects unusual patterns in confidence scores or timing.
 */
export function detectAnomalies(receipts: DecisionReceipt[]): AnomalyInsight[] {
    const anomalies: AnomalyInsight[] = [];

    receipts.forEach(r => {
        // Rule 1: Confidence drop
        if (r.confidence < 0.8) {
            anomalies.push({
                type: 'CONFIDENCE_DROP',
                severity: r.confidence < 0.6 ? 'HIGH' : 'MEDIUM',
                description: `Decision confidence (${(r.confidence * 100).toFixed(1)}%) is below enterprise threshold.`,
                receiptId: r.receiptId
            });
        }

        // Rule 2: Policy WARN/FAIL
        if (r.policyResult === 'WARN' || r.policyResult === 'FAIL') {
            anomalies.push({
                type: 'POLICY_VIOLATION',
                severity: r.policyResult === 'FAIL' ? 'HIGH' : 'MEDIUM',
                description: `Decision triggered compliance policy ${r.policyResult}.`,
                receiptId: r.receiptId
            });
        }
    });

    return anomalies;
}

/**
 * Layer 2: Decision Similarity Clustering (Simulation)
 * Detects if a decision is an outlier compared to historical decisions.
 */
export function clusterAnalysis(receipt: DecisionReceipt, history: DecisionReceipt[]) {
    // Mock logic: if recent decisions for the same model have very different hashes
    const modelHistory = history.filter(h => h.modelName === receipt.modelName);
    if (modelHistory.length > 5) {
        // Simulate distance calculation
        const isOutlier = Math.random() > 0.95;
        if (isOutlier) {
            return {
                isOutlier: true,
                reason: "Structural deviation from historical embedding cluster detected."
            };
        }
    }
    return { isOutlier: false };
}

/**
 * Layer 3: Counterfactual Replay
 * Simulates the decision under different policies/models.
 */
export function simulateCounterfactual(receipt: DecisionReceipt, newThreshold: number) {
    const originalPass = receipt.confidence >= 0.85;
    const simulatedPass = receipt.confidence >= newThreshold;

    return {
        originalThreshold: 0.85,
        newThreshold,
        originalOutcome: originalPass ? 'APPROVE' : 'DENY',
        simulatedOutcome: simulatedPass ? 'APPROVE' : 'DENY',
        isDifferent: originalPass !== simulatedPass
    };
}
