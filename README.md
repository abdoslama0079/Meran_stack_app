# 🚀 Enterprise MERN Task Manager: GitOps Edition

A fully containerized, production-grade **MERN** (MongoDB, Express, React, Node.js) application. This project showcases a modern **CI/CD** and **GitOps** workflow, moving from automated builds to self-healing Kubernetes deployments.

---

## 📑 Table of Contents
* [Architecture](#-architecture)
* [Tech Stack](#-tech-stack)
* [CI/CD & GitOps Workflow](#-cicd--gitops-workflow)
* [Database & Validation](#-database--validation)
* [Deployment](#-deployment)

---

## 🏗️ Architecture
The application is split into three main tiers, orchestrated within a **Kubernetes (AKS/EKS)** cluster:
* **Frontend**: React.js SPA with Material-UI, served via Nginx.
* **Backend**: Node.js REST API handling business logic and database communication.
* **Database**: MongoDB Atlas with secure environment-driven authentication.

---

## 🛠️ Tech Stack
| Category | Technology |
| :--- | :--- |
| **Frontend** | React, Material-UI, Axios |
| **Backend** | Node.js, Express, Mongoose |
| **Database** | MongoDB Atlas (Cloud) |
| **CI/CD** | Jenkins (Automated Builds & Testing) |
| **GitOps** | **Argo CD** (Continuous Delivery & Self-Healing) |
| **Registry** | Azure Container Registry (ACR) |
| **Orchestration** | Kubernetes (AKS) & Ingress-NGINX |

---

## 🔄 CI/CD & GitOps Workflow
This project follows **GitOps** principles, ensuring that the Git repository is the single source of truth for the entire infrastructure.

1.  **Continuous Integration (Jenkins)**: 
    * Triggered on every `git push` to GitHub.
    * Builds Docker images for both Frontend and Backend.
    * Pushes tagged images to the private Azure Container Registry.
2.  **Continuous Delivery (Argo CD)**:
    * Monitors the `/k8s` directory for changes in YAML manifests.
    * Automatically synchronizes the cluster state with the repository.
    * **Self-Healing**: Automatically detects and reverts manual changes in the cluster to maintain the desired Git state.

---

## 🛡️ Database & Validation
* **Strict Validation**: The backend implements Mongoose schema validation, enforcing a minimum of **3 characters** per task to maintain data integrity.
* **Security**: Sensitive credentials (DB URIs, Passwords) are managed via **Kubernetes Secrets** and injected as environment variables at runtime.

---

## 🚀 Deployment Guide

### 1. Prerequisites
* A running Kubernetes Cluster.
* Argo CD installed in the `argocd` namespace.
* `kubectl` configured to point to your cluster.

### 2. Deployment via GitOps
Connect your GitHub repository to Argo CD and create a new application pointing to the `k8s/` folder. Argo CD will handle the creation of:
* Deployments
* Services
* Ingress Rules

### 3. Monitoring the Rollout
Check the status of your frontend and backend pods:
```bash
kubectl get pods -n mern-prod
kubectl rollout status deployment/frontend -n mern-prod
