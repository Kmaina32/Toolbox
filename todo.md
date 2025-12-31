# OmniSaaS Implementation Roadmap: Metadata & Forensics Expansion

This document outlines the engineering tasks required to scale the platform to 200+ specialized tools with bespoke UI components.

## 🏗️ Phase 1: Architectural Refactoring [COMPLETE]
- [x] **Component-Based Routing**: Transition `ToolInterface.tsx` to a registry logic.
- [x] **Dynamic Parameters**: Support coordinate-picker and custom types.
- [x] **State Persistence**: Local storage for tool-specific settings.

## 🖼️ Phase 2: Metadata Tool Suite (Tools 1–60) [COMPLETE]
- [x] **ExifTable Component**: Built high-performance table for metadata display.
- [x] **GPS Integration**:
    - [x] Implemented `googleMaps` grounding via Gemini 2.5 Flash.
    - [x] Created `MapWorkspace` for location-aware tools.
- [x] **Batch Metadata Engine**: Extended `bulk` mode logic.

## 🎥 Phase 3: Video Intelligence (Tools 61–105)
- [ ] **VideoInspector Component**: 
    - [ ] Waveform/Vectorscope visualization for `Video color profile viewer`.
    - [ ] Frame-by-frame metadata overlay for `Video timestamp verifier`.
- [ ] **Codec Analysis**: Integrate a more robust parser for stream-level metadata (HEVC, VP9, AV1).

## 📄 Phase 4: Document & Forensic Suite (Tools 106–200+)
- [ ] **Forensic Workspace**:
    - [ ] `DiffViewer`: Side-by-side metadata comparison for `Image metadata diff tool`.
    - [ ] `ELAEngine`: Error Level Analysis visualization for `Image tampering detector`.
- [ ] **Anonymization Pipeline**:
    - [ ] "Redact PII" specialized view for `Legal document anonymizer`.
    - [ ] Automated face-blurring preview for `Privacy Guard`.

## 🎨 Phase 5: UI/UX & Polish
- [ ] **Theme Orchestration**: Tool-specific themes.
- [ ] **Export Manager**: Unified system for exporting results.
- [ ] **Progressive Onboarding**: Help tooltips for complex forensic tools.
