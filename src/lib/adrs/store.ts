import { DecisionReceipt, generateReceipt } from './crypto';

// In a real system, this would be an immutable database or blockchain
let mockReceipts: DecisionReceipt[] = [
    generateReceipt({
        input: "Analyze credit risk for Applicant ID 9921",
        output: "Denied. High debt-to-income ratio (45%).",
        model: "RiskEngine-Llama3",
        version: "3.2.1",
        config: { temperature: 0, confidence: 0.98 },
        systemId: "FIN-AUTH-01",
        policyResult: "PASS"
    }),
    generateReceipt({
        input: "Approve medical reimbursement for Case 552",
        output: "Approved. Procedure within coverage limits.",
        model: "MedAudit-GPT4",
        version: "1.0.4",
        config: { confidence: 0.89 },
        systemId: "HEALTH-SYS-22",
        policyResult: "PASS"
    }),
    generateReceipt({
        input: "Flag suspicious transaction TXN-887",
        output: "Flagged. Unusual cross-border pattern.",
        model: "FraudSentinel",
        version: "v4-prod",
        config: { confidence: 0.72 },
        systemId: "SEC-MON-05",
        policyResult: "WARN"
    })
];

export function getReceipts() {
    return [...mockReceipts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function addReceipt(receipt: DecisionReceipt) {
    mockReceipts.push(receipt);
}

export function getReceiptById(id: string) {
    return mockReceipts.find(r => r.receiptId === id);
}
