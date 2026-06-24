# Kubernetes & Minikube Cheatsheet

This guide covers the end-to-end lifecycle of running your POC in Minikube.

### 1. Start the Cluster
```bash
minikube start
eval $(minikube docker-env)
```
> **Description:** Starts your local Minikube cluster and configures your terminal to use Minikube's internal Docker daemon (so Kubernetes can see your built images).

---

### 2. Build the Docker Images
```bash
docker build -t frontend:poc ./frontend
docker build -t userservice:poc ./backend/userService
docker build -t todoservice:poc ./backend/toDoService
docker build -t expensemanagerservice:poc ./backend/expenceManagerService
```
> **Description:** Builds your application images directly inside the Minikube environment. (Run these again if you change your code).

---

### 3. Start the Pods
```bash
helm install poc ./poc-chart
```
> **Description:** Deploys all databases and services into your Kubernetes cluster using your Helm chart. *(Use `helm upgrade poc ./poc-chart` if you ever modify the `.yaml` files).*

---

### 4. View Status & Logs
```bash
kubectl get pods
```
> **Description:** Lists all pods and shows their current health/status.

```bash
kubectl get svc
```
> **Description:** Lists all services and their internal ports.

```bash
kubectl logs deployment/expence-manager-service-deployment
```
> **Description:** Prints the console logs of a specific deployment (useful for debugging crashes).

---

### 5. Forward Ports (Access the App)
*Note: Run these commands in separate terminal tabs, or add ` &` at the end to run them in the background.*
```bash
kubectl port-forward svc/frontend 5173:3000
kubectl port-forward svc/user-service 3001:3001
kubectl port-forward svc/todo-service 3002:3002
kubectl port-forward svc/expence-manager-service 3003:3003
```
> **Description:** Maps the isolated Kubernetes services to your host machine, allowing you to seamlessly access the app at `http://localhost:5173`.

---

### 6. Dispose of the Pods & Cleanup
**Stop Port-Forwards:**
> **Description:** Press `Ctrl + C` in the terminal tabs where the port-forward commands are actively running.

**Dispose of Pods:**
```bash
helm uninstall poc
```
> **Description:** Tears down all the pods, services, and deployments created by the Helm chart.

**Stop the Cluster:**
```bash
minikube stop
```
> **Description:** Powers down the Minikube VM to free up your computer's RAM and CPU (data is preserved).

**Wipe the Cluster (Optional):**
```bash
minikube delete
```
> **Description:** Completely destroys the Minikube cluster, permanently deleting all databases, volumes, and built Docker images.
