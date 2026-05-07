#  IPR2: Microservices on Kubernetes

The project is a full-stack application deployed in Kubernetes using Helm Charts.
The architecture includes a backend, frontend, databases (Mongo, Redis), a configured Ingress Controller, and autoscaling (HPA).

## Tech stack

* **Infrastructure:** Kubernetes (Docker Desktop / Minikube)
* **Orchestration:** Helm v3
* **Ingress:** NGINX Ingress Controller
* **Monitoring:** Metrics Server + HPA
* **Storage:** MongoDB, Redis
* **Backend:** .NET 10 (Docker container)
* **Frontend:** React/SPA (Docker container)

---

## Prerequisites

Before starting, make sure you have installed:
1.  **Docker Desktop** (with Kubernetes enabled).
2.  **Helm** (installed and added to PATH).
3.  **Kubectl**.

### Important setting for Windows
Since we are using local domains, add the following lines to the file `C:\Windows\System32\drivers\etc\hosts`:

```text
127.0.0.1  ipr2.local 
