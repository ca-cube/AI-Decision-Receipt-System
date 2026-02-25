import { generateReceipt } from './crypto';
import { addReceipt } from './store';

/**
 * ADRS Middleware
 * 
 * This is the integration layer that enterprises use to automatically 
 * document AI decisions. It intercepts the model output and generates 
 * a signed receipt before returning the result to the business application.
 */
export async function documentDecision(params: {
    input: string;
    output: string;
    model: string;
    version: string;
    systemId: string;
    config?: Record<string, any>;
}) {
    console.log(`[ADRS] Intercepting decision for system: ${params.systemId}`);

    // 1. Evaluate compliance policy (Mock)
    const policyResult = evaluatePolicy(params.output);

    // 2. Generate Cryptographic Receipt
    const receipt = generateReceipt({
        input: params.input,
        output: params.output,
        model: params.model,
        version: params.version,
        systemId: params.systemId,
        config: params.config || { temperature: 0.7, top_p: 1 },
        policyResult: policyResult
    });

    // 3. Store in Immutable Ledger
    addReceipt(receipt);

    console.log(`[ADRS] Receipt generated: ${receipt.receiptId} (Hash: ${receipt.integrityHash.substring(0, 8)}...)`);

    return receipt;
}

function evaluatePolicy(output: string): 'PASS' | 'FAIL' | 'WARN' {
    const sensitiveTerms = ['restricted', 'unauthorized', 'deny'];
    const hasSensitive = sensitiveTerms.some(term => output.toLowerCase().includes(term));

    if (hasSensitive) return 'WARN';
    return 'PASS';
}
