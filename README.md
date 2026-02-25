# ADRS: AI Decision Receipt System

**Tamper-proof AI Decision Documentation for Regulated Enterprises.**

AI adoption is accelerating faster than governance. ADRS is the infrastructure layer between the Model, the Enterprise, and the Regulator. It provides a cryptographically verifiable logging layer that generates a "Decision Receipt" every time an AI system produces an output.

## 🔐 Core Features

- **Cryptographic Receipts**: Each decision is hashed (SHA-256) and signed, ensuring immutability.
- **Regulatory-First Design**: Built for financial audits, clinical AI, and insurance underwriting.
- **Model-Agnostic Middleware**: Works across LLMs, forecasting models, and risk engines.
- **Replay Simulation Engine**: Reconstruct historical decisions and test them against new compliance rules.
- **Anomaly Detection**: Layered AI (Isolation Forest/Autoencoders) to detect unusual decision patterns.

## 🛠️ Technical Architecture

1. **Interception**: Middleware intercepts AI model input/output.
2. **Metadata Extraction**: Context, hyperparameters, and lineage are captured.
3. **Canonicalization**: JSON is ordered and hashed for deterministic integrity.
4. **Signing**: The record is cryptographically signed.
5. **Ledger Storage**: Stored in an append-only, verifiable audit trail.

## 🚀 Getting Started

### Installation

```bash
npm install @adrs/sdk
```

### Integration

```typescript
import { documentDecision } from '@/lib/adrs/middleware';

const output = await model.generate(prompt);

// Document the decision automatically
const receipt = await documentDecision({
  input: prompt,
  output: output,
  model: "gpt-4-turbo",
  version: "2024-04-09",
  systemId: "CREDIT-APP-01"
});
```

## 🧠 AI Layers in ADRS

- **Layer 1: Anomaly Detection**: Detects drops in confidence or suspicious response patterns.
- **Layer 2: Similarity Clustering**: Identifies decisions that are outliers compared to historical clusters.
- **Layer 3: Counterfactual Replay**: Simulates alternate policy thresholds to stress-test compliance.

---

*Positioned as the "Stripe for AI Governance".*
