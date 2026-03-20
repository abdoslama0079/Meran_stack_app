# 🚀 MERN Stack: DevOps & GitOps Pipeline

A production-grade **MERN** (MongoDB, Express, React, Node.js) application deployed with a "Security-First" mindset. This project demonstrates a complete automated lifecycle—from code quality and vulnerability scanning to self-healing Kubernetes orchestration.

---

## 📑 Table of Contents
* [Architecture](#-architecture)
* [Tech Stack](#-tech-stack)
* [DevOps & GitOps Workflow](#-DevOps--gitops-workflow)
* [Monitoring & Observability](#-monitoring--observability)
* [Deployment Guide](#-deployment-guide)

---

## 🏗️ Architecture
The application follows a microservices-style architecture orchestrated within an **Azure Kubernetes Service (AKS)** cluster:
* **Frontend**: React.js SPA with Material-UI, optimized via Nginx.
* **Backend**: Node.js REST API with Mongoose schema validation (3-char minimum task enforcement).
* **Database**: MongoDB Atlas (Cloud) with secure credential injection.

---

## 🛠️ Tech Stack
| Category | Technology |
| :--- | :--- |
| **Frontend** | React, Material-UI, Axios |
| **Backend** | Node.js, Express, Mongoose |
| **Database** | MongoDB Atlas |
| **CI/CD** | **Jenkins** (Automation Hub) |
| **Quality/Security**| **SonarQube** (SAST) & **Trivy** (Container Scanning) |
| **GitOps** | **Argo CD** (Continuous Delivery) |
| **Monitoring** | **Prometheus** & **Grafana** (Helm) |
| **Orchestration** | Kubernetes (AKS) & Ingress-NGINX |

---

## 🔄 DevOps & GitOps Workflow
This pipeline ensures every release is high-quality, secure, and synchronized.

### 1. Continuous Integration (Jenkins)
* **Code Analysis**: **SonarQube** scans the source code for bugs, vulnerabilities, and code smells.
* **Vulnerability Scanning**: **Trivy** performs a deep scan of the Docker images to catch CVEs in the OS and dependencies.
* **Image Registry**: Verified images are pushed to the Azure Container Registry (ACR).

### 2. Continuous Delivery (Argo CD)
* **GitOps Flow**: Argo CD monitors the `/k8s` folder for manifest changes.
* **Self-Healing**: Automatically detects and corrects "configuration drift" if anyone tries to manually edit the cluster.
* **Zero-Downtime**: Performs rolling updates across the frontend and API pods.

---

## 📈 Monitoring & Observability
Managed via **Helm**, the monitoring stack provides real-time insights into cluster health:
* **Prometheus**: Collects time-series metrics from nodes and application pods.
* **Grafana**: Provides visual dashboards for CPU/Memory usage and network traffic.

---

## 🚀 Deployment & Usage

### 🛡️ Security Check
The backend enforces strict data integrity. Tasks must be at least **3 characters** long to pass Mongoose validation.

### 📦 Manual Rollout
To manually trigger a refresh of the environment:
```bash

kubectl rollout restart deployment frontend -n mern-prod
kubectl rollout restart deployment api -n mern-prod

---
<img width="1599" height="750" alt="d1" src="https://github.com/user-attachments/assets/2351a60b-599a-4956-bb53-dfff530ee7d9" />
<img width="1600" height="752" alt="image" src="https://github.com/user-attachments/assets/0b6b284e-3634-4308-b222-391c8ba5e83f" />
<img width="1598" height="751" alt="image" src="https://github.com/user-attachments/assets/633e2b12-12f4-4938-8ce0-6ded06ce1ac9" />
<img width="1600" height="751" alt="image" src="https://github.com/user-attachments/assets/08bf2c15-a17c-408b-b8d2-412b1beb3beb" />
