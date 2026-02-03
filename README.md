#  IPR2: Microservices on Kubernetes

Проект представляет собой Fullstack-приложение, развернутое в Kubernetes с использованием **Helm Charts**.
Архитектура включает Backend, Frontend, базы данных (Mongo, Redis), настроенный Ingress Controller и автоматическое масштабирование (HPA).

## Технический стек

* **Infrastructure:** Kubernetes (Docker Desktop / Minikube)
* **Orchestration:** Helm v3
* **Ingress:** NGINX Ingress Controller
* **Monitoring:** Metrics Server + HPA
* **Storage:** MongoDB, Redis
* **Backend:** .NET 10 (Docker container)
* **Frontend:** React/SPA (Docker container)

---

## Предварительные требования

Перед запуском убедитесь, что у вас установлены:
1.  **Docker Desktop** (с включенным Kubernetes).
2.  **Helm** (установлен и добавлен в PATH).
3.  **Kubectl**.

### Важная настройка для Windows
Так как мы используем локальные домены, добавьте следующие строки в файл `C:\Windows\System32\drivers\etc\hosts`:

```text
127.0.0.1  ipr2.local 
