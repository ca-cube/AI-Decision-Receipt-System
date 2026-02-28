"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Play, ShieldAlert, CheckCircle, ArrowRight, Settings2, History, Cpu } from 'lucide-react';
import { DecisionReceipt } from '@/lib/adrs/crypto';
import { getReceipts } from '@/lib/adrs/store';
import { simulateCounterfactual } from '@/lib/adrs/ai';
import Link from 'next/link';

interface SimulationResult {
    isDifferent: boolean;
    originalThreshold: number;
    newThreshold: number;
    originalOutcome: string;
    simulatedOutcome: string;
}

export default function SimulatorPage() {
    const [receipts, setReceipts] = useState<DecisionReceipt[]>([]);
    const [selectedReceiptId, setSelectedReceiptId] = useState('');
    const [threshold, setThreshold] = useState(0.7);
    const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);

    useEffect(() => {
        const data = getReceipts();
        setReceipts(data);
        if (data.length > 0) setSelectedReceiptId(data[0].receiptId);
    }, []);

    const runSimulation = () => {
        setIsSimulating(true);
        const receipt = receipts.find(r => r.receiptId === selectedReceiptId);
        if (receipt) {
            setTimeout(() => {
                const result = simulateCounterfactual(receipt, threshold);
                setSimulationResult(result);
                setIsSimulating(false);
            }, 1500);
        }
    };

    return (
        <div className="min-h-screen p-8 max-w-5xl mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <div className="space-y-1">
                    <Link href="/" className="text-xs text-primary font-bold uppercase flex items-center space-x-1 hover:underline">
                        <ArrowRight className="w-3 h-3 rotate-180" />
                        <span>Back to Ledger</span>
                    </Link>
                    <h1 className="text-3xl font-bold">Replay Simulation Engine</h1>
                    <p className="text-muted-foreground text-sm">Stress test historical decisions against evolving compliance thresholds.</p>
                </div>
                <div className="p-3 glass rounded-2xl">
                    <RefreshCw className={`w-6 h-6 text-primary ${isSimulating ? 'animate-spin' : ''}`} />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Config Panel */}
                <div className="glass p-6 rounded-2xl border border-white/5 space-y-6">
                    <div className="flex items-center space-x-2 text-primary">
                        <Settings2 className="w-4 h-4" />
                        <h2 className="text-sm font-bold uppercase tracking-widest">Configuration</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">Select Receipt</label>
                            <select
                                className="w-full bg-secondary/50 border border-white/10 rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                                value={selectedReceiptId}
                                onChange={(e) => setSelectedReceiptId(e.target.value)}
                            >
                                {receipts.map(r => (
                                    <option key={r.receiptId} value={r.receiptId}>{r.receiptId} ({r.modelName})</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-xs font-medium text-muted-foreground">Policy Threshold</label>
                                <span className="text-xs font-bold text-primary">{(threshold * 100).toFixed(0)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1.0"
                                step="0.05"
                                value={threshold}
                                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                                className="w-full accent-primary"
                            />
                        </div>

                        <button
                            onClick={runSimulation}
                            disabled={isSimulating}
                            className="w-full py-4 neo-gradient rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            <Play className="w-4 h-4" />
                            <span>{isSimulating ? 'Reconstructing...' : 'Execute Replay'}</span>
                        </button>
                    </div>
                </div>

                {/* Results / Visualizer */}
                <div className="md:col-span-2 space-y-6">
                    <div className="glass p-8 rounded-3xl border border-white/5 h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary rounded-full blur-[120px]" />
                        </div>

                        {!simulationResult && !isSimulating && (
                            <div className="text-center space-y-4 relative z-10">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                    <History className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground text-sm max-w-[200px]">Configure parameters and run simulation to view results.</p>
                            </div>
                        )}

                        {isSimulating && (
                            <div className="text-center space-y-6 relative z-10">
                                <div className="relative w-24 h-24 mx-auto">
                                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                                    <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Cpu className="w-8 h-8 text-primary animate-pulse" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-lg animate-pulse tracking-tight">Canonical Replay</p>
                                    <p className="text-xs text-muted-foreground">Re-validating integrity hashes...</p>
                                </div>
                            </div>
                        )}

                        {simulationResult && !isSimulating && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full h-full flex flex-col relative z-10"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <h3 className="font-bold text-xl">Simulation Result</h3>
                                    {simulationResult.isDifferent ? (
                                        <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center space-x-2">
                                            <ShieldAlert className="w-3 h-3 text-amber-500" />
                                            <span className="text-[10px] font-bold text-amber-500 uppercase">Outcome Variance</span>
                                        </div>
                                    ) : (
                                        <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full flex items-center space-x-2">
                                            <CheckCircle className="w-3 h-3 text-green-500" />
                                            <span className="text-[10px] font-bold text-green-500 uppercase">Outcome Consistent</span>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-8 flex-1">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Original (Threshold: {(simulationResult.originalThreshold * 100)}%)</p>
                                        <div className="h-32 glass border-white/5 rounded-2xl flex items-center justify-center relative overflow-hidden group">
                                            <span className={`text-2xl font-black ${simulationResult.originalOutcome === 'APPROVE' ? 'text-green-500' : 'text-red-500'}`}>
                                                {simulationResult.originalOutcome}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-[10px] font-bold text-primary uppercase">Simulated (Threshold: {(simulationResult.newThreshold * 100)}%)</p>
                                        <div className="h-32 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
                                            <span className={`text-2xl font-black ${simulationResult.simulatedOutcome === 'APPROVE' ? 'text-green-500' : 'text-red-500'}`}>
                                                {simulationResult.simulatedOutcome}
                                            </span>
                                            {simulationResult.isDifferent && (
                                                <div className="absolute top-0 right-0 px-2 py-1 bg-primary text-[8px] font-black text-white">SHIFT</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-muted-foreground leading-relaxed italic">
                                    &quot;Under the simulated threshold of {simulationResult.newThreshold}, the AI output {simulationResult.isDifferent ? 'deviates' : 'remains consistent'} from the original audit record. This indicates {simulationResult.isDifferent ? 'legal exposure if policy changes are retroactive.' : 'robust compliance posture.'}&quot;
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
