"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    History,
    Search,
    Terminal,
    Lock,
    BarChart3,
    AlertTriangle,
    FileText,
    Copy,
    CheckCircle2,
    Cpu,
    RefreshCw,
    Eye,
    Maximize2,
    ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import { DecisionReceipt, verifyReceipt } from '@/lib/adrs/crypto';
import { getReceipts } from '@/lib/adrs/store';

export default function ADRSDashboard() {
    const [receipts, setReceipts] = useState<DecisionReceipt[]>([]);
    const [selectedReceipt, setSelectedReceipt] = useState<DecisionReceipt | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('Ledger');
    const [anomalies, setAnomalies] = useState<any[]>([]);

    useEffect(() => {
        const data = getReceipts();
        setReceipts(data);
        setAnomalies([
            { id: 1, type: 'DRM_DRIFT', severity: 'HIGH', model: 'RiskEngine-Llama3', message: 'Input distribution shift detected in FIN-AUTH-01.' },
            { id: 2, type: 'CONFIDENCE_ALER', severity: 'MEDIUM', model: 'FraudSentinel', message: 'Multiple decisions below 0.75 confidence threshold.' }
        ]);
    }, []);

    const filteredReceipts = receipts.filter(r =>
        r.receiptId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.systemId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.modelName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar */}
            <nav className="w-64 border-r border-white/5 glass flex flex-col p-6 space-y-8">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 neo-gradient rounded-lg">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">ADRS</span>
                </div>

                <div className="space-y-1">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-2">Main Menu</p>
                    <div onClick={() => setActiveTab('Ledger')}>
                        <NavItem icon={<History className="w-4 h-4" />} label="Audit Ledger" active={activeTab === 'Ledger'} />
                    </div>
                    <div onClick={() => setActiveTab('Anomaly')}>
                        <NavItem icon={<BarChart3 className="w-4 h-4" />} label="Anomaly Detection" active={activeTab === 'Anomaly'} />
                    </div>
                    <div onClick={() => setActiveTab('Gov')}>
                        <NavItem icon={<Cpu className="w-4 h-4" />} label="Model Governance" active={activeTab === 'Gov'} />
                    </div>
                    <Link href="/simulator">
                        <NavItem icon={<RefreshCw className="w-4 h-4" />} label="Replay Simulation" />
                    </Link>
                </div>

                <div className="mt-auto pt-6 border-t border-white/5">
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                        <p className="text-xs font-medium text-primary">System Health</p>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] text-muted-foreground">Immutable Sync</span>
                            <div className="flex space-x-1">
                                <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                                <span className="w-1 h-1 rounded-full bg-primary animate-pulse delay-75" />
                                <span className="w-1 h-1 rounded-full bg-primary animate-pulse delay-150" />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-sm">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-lg font-semibold">{activeTab === 'Ledger' ? 'Audit Ledger' : activeTab === 'Anomaly' ? 'Anomaly Insights' : 'Model Governance'}</h1>
                        <div className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Live Monitor</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search Receipts..."
                                className="bg-secondary/50 border border-white/5 rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-64"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="p-2 rounded-full hover:bg-white/5 transition-colors">
                            <Maximize2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </div>
                </header>

                {/* Console / Content */}
                <div className="flex-1 overflow-auto p-8">
                    <div className="max-w-6xl mx-auto space-y-6">
                        {activeTab === 'Ledger' && (
                            <>
                                {/* Anomaly Highlight */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {anomalies.map(a => (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            key={a.id}
                                            className="p-4 rounded-2xl glass border-white/5 flex items-start space-x-4"
                                        >
                                            <div className={`p-2 rounded-lg ${a.severity === 'HIGH' ? 'bg-red-500/10' : 'bg-yellow-500/10'}`}>
                                                <ShieldAlert className={`w-5 h-5 ${a.severity === 'HIGH' ? 'text-red-500' : 'text-yellow-500'}`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className={`text-[10px] font-bold uppercase tracking-tighter ${a.severity === 'HIGH' ? 'text-red-500' : 'text-yellow-500'}`}>{a.type}</span>
                                                    <span className="text-[10px] text-muted-foreground font-mono">{a.model}</span>
                                                </div>
                                                <p className="text-xs text-white/90">{a.message}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {/* Receipt Table */}
                                    <div className="glass rounded-2xl overflow-hidden border border-white/5">
                                        <table className="w-full text-left text-sm border-collapse">
                                            <thead>
                                                <tr className="bg-white/5 border-b border-white/5 font-medium text-muted-foreground">
                                                    <th className="px-6 py-4">Receipt ID</th>
                                                    <th className="px-6 py-4">Model / Version</th>
                                                    <th className="px-6 py-4">Status</th>
                                                    <th className="px-6 py-4">Timestamp</th>
                                                    <th className="px-6 py-4">Integrity</th>
                                                    <th className="px-6 py-4"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {filteredReceipts.map((r) => (
                                                    <motion.tr
                                                        key={r.receiptId}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="hover:bg-white/5 transition-colors cursor-pointer group"
                                                        onClick={() => setSelectedReceipt(r)}
                                                    >
                                                        <td className="px-6 py-4 font-mono text-xs text-primary">{r.receiptId}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">{r.modelName}</span>
                                                                <span className="text-[10px] text-muted-foreground italic">v{r.modelVersion}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <Badge status={r.policyResult} />
                                                        </td>
                                                        <td className="px-6 py-4 text-xs text-muted-foreground font-mono">
                                                            {new Date(r.timestamp).toLocaleTimeString()}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center space-x-2">
                                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                                <span className="text-[10px] text-green-500 font-bold uppercase">Verified</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button className="text-muted-foreground hover:text-white transition-colors">
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab !== 'Ledger' && (
                            <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
                                <div className="p-4 bg-primary/10 rounded-full border border-primary/20">
                                    <Cpu className="w-12 h-12 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{activeTab} View Placeholder</h3>
                                    <p className="text-muted-foreground text-sm max-w-sm">This module is currently being synchronized with the immutable governance layer.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Side Detail Panel */}
            <AnimatePresence>
                {selectedReceipt && (
                    <motion.aside
                        initial={{ x: 400 }}
                        animate={{ x: 0 }}
                        exit={{ x: 400 }}
                        className="w-96 border-l border-white/5 glass p-8 flex flex-col space-y-6 overflow-auto shadow-2xl"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold">Receipt Detail</h2>
                            <button
                                onClick={() => setSelectedReceipt(null)}
                                className="p-1 hover:bg-white/10 rounded-lg text-muted-foreground"
                            >
                                <Maximize2 className="w-4 h-4 rotate-45" />
                            </button>
                        </div>

                        <div className="p-4 rounded-xl bg-secondary/50 border border-white/5 space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">ID</span>
                                <span className="font-mono text-primary">{selectedReceipt.receiptId}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">System</span>
                                <span>{selectedReceipt.systemId}</span>
                            </div>
                        </div>

                        <section className="space-y-3">
                            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Cryptographic Proofs</h3>
                            <div className="space-y-2">
                                <ProofField label="Prompt Hash" value={selectedReceipt.promptHash} />
                                <ProofField label="Output Hash" value={selectedReceipt.outputHash} />
                                <ProofField label="Integrity Signature" value={selectedReceipt.integrityHash} />
                            </div>
                        </section>

                        <section className="space-y-3">
                            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Decision Metadata</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <MetaItem label="Confidence" value={(selectedReceipt.confidence * 100).toFixed(1) + '%'} color="text-green-500" />
                                <MetaItem label="Lineage" value={selectedReceipt.lineageRef} />
                            </div>
                        </section>

                        <div className="mt-auto space-y-3">
                            <Link href="/simulator" className="block">
                                <button className="w-full py-3 neo-gradient rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center space-x-2">
                                    <RefreshCw className="w-4 h-4" />
                                    <span>Simulate Replay</span>
                                </button>
                            </Link>
                            <button className="w-full py-3 bg-secondary/80 hover:bg-secondary rounded-xl font-bold text-sm transition-colors flex items-center justify-center space-x-2 border border-white/5">
                                <Copy className="w-4 h-4" />
                                <span>Copy Canonical JSON</span>
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </div>
    );
}

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
}

function NavItem({ icon, label, active = false }: NavItemProps) {
    return (
        <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}>
            {icon}
            <span className="text-sm font-medium">{label}</span>
            {active && <div className="ml-auto w-1 h-1 rounded-full bg-primary" />}
        </div>
    );
}

function Badge({ status }: { status: DecisionReceipt['policyResult'] }) {
    const styles = {
        PASS: "bg-green-500/10 text-green-500 border-green-500/20",
        FAIL: "bg-red-500/10 text-red-500 border-red-500/20",
        WARN: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${styles[status]}`}>
            {status}
        </span>
    );
}

function ProofField({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex flex-col space-y-1">
            <span className="text-[9px] text-muted-foreground font-semibold">{label}</span>
            <div className="flex items-center space-x-2 bg-black/40 border border-white/5 rounded-lg p-2 group">
                <span className="flex-1 font-mono text-[10px] truncate opacity-60 group-hover:opacity-100 transition-opacity">{value}</span>
                <button className="text-muted-foreground cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <Copy className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}

function MetaItem({ label, value, color }: { label: string, value: string, color?: string }) {
    return (
        <div className="bg-white/5 border border-white/5 rounded-xl p-3">
            <p className="text-[9px] text-muted-foreground font-semibold mb-1 uppercase tracking-tighter">{label}</p>
            <p className={`text-xs font-bold ${color || 'text-white'}`}>{value}</p>
        </div>
    );
}
