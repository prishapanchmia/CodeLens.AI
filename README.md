<h1 align="center">CodeLens.ai – AI Powered Codebase Analysis Tool</h1>

<p>
CodeLens.ai is an intelligent platform that leverages large language models (LLMs) to automate the analysis of complex codebases. Built using Retrieval-Augmented Generation (RAG), it helps developers and non-technical stakeholders gain high-level insights from source repositories through a semantic understanding of the code.
</p>

<p>
 Project Demo Video can be found here: https://drive.google.com/file/d/10dathMWthgdDaeSvzqFRQwsS3R1n8wsm/view?usp=drive_link

🔍 Features
- LLM-Based Code Understanding: Uses quantized Qwen2.5-14B model via Unsloth with prompt templating for context-aware answers.
- RAG Pipeline: Integrates LangChain document loaders, customized text chunking, and vector search with ChromaDB to retrieve relevant code/document snippets.
- Metadata Filtering: Adds contextual metadata to chunks to improve response accuracy and retrieval relevance.
- CUDA-Accelerated Inference: Supports GPU-based execution to minimize latency on large models.
- CI/CD Ready: Uses GitHub Actions for linting, unit testing, and Docker-based deployments.
- Firebase Integration: Stores user interaction data and results securely with fail-safe error handling.
- Robust API Management: Rotates across multiple Cohere API keys to prevent throttling and optimize throughput.
- Asynchronous Backend: FastAPI endpoints structured with Pydantic models and custom exception handling for reliability and speed.

⚙️ Tech Stack
- Frontend: React.js
- Backend: FastAPI, Python (async)
- ML Frameworks: LangChain, ChromaDB, Unsloth, Transformers
- Database: Firebase Firestore (Mock in Dev)
- CI/CD: GitHub Actions, Docker
- Deployment: Local + Cloud-ready with container support

