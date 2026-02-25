import * as CryptoJS from 'crypto-js';

export interface DecisionReceipt {
    receiptId: string;
    promptHash: string;
    modelName: string;
    modelVersion: string;
    config: Record<string, any>;
    outputHash: string;
    confidence: number;
    timestamp: string;
    systemId: string;
    lineageRef: string;
    policyResult: 'PASS' | 'FAIL' | 'WARN';
    integrityHash: string;
    anchorHash?: string;
}

export function computeHash(data: any): string {
    const canonicalString = JSON.stringify(data, Object.keys(data).sort());
    return CryptoJS.SHA256(canonicalString).toString();
}

export function generateReceipt(params: {
    input: string;
    output: string;
    model: string;
    version: string;
    config: Record<string, any>;
    systemId: string;
    policyResult: 'PASS' | 'FAIL' | 'WARN';
}): DecisionReceipt {
    const promptHash = CryptoJS.SHA256(params.input).toString();
    const outputHash = CryptoJS.SHA256(params.output).toString();
    const timestamp = new Date().toISOString();

    const receiptBase = {
        promptHash,
        modelName: params.model,
        modelVersion: params.version,
        config: params.config,
        outputHash,
        confidence: params.config.confidence || 0.95,
        timestamp,
        systemId: params.systemId,
        lineageRef: `ref-${Math.random().toString(36).substring(7)}`,
        policyResult: params.policyResult,
    };

    const integrityHash = computeHash(receiptBase);

    return {
        receiptId: `rcpt-${Math.random().toString(36).substring(7)}`,
        ...receiptBase,
        integrityHash,
    };
}

export function verifyReceipt(receipt: DecisionReceipt): boolean {
    const { integrityHash, receiptId, anchorHash, ...rest } = receipt;
    const computed = computeHash(rest);
    return computed === integrityHash;
}
