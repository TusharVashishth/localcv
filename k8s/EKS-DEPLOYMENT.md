# Deploying localCV on Amazon EKS (Elastic Kubernetes Service)

This guide provides a comprehensive, step-by-step walkthrough to build, configure, and deploy **localCV** to AWS using Amazon ECR (Elastic Container Registry) and Amazon EKS.

---

## Table of Contents

1. [Architecture & Flow Overview](#1-architecture--flow-overview)
2. [Prerequisites & Tool Installation](#2-prerequisites--tool-installation)
3. [Required IAM Permissions & Roles](#3-required-iam-permissions--roles)
4. [Step 1: Build & Push Docker Image to Amazon ECR](#step-1-build--push-docker-image-to-amazon-ecr)
5. [Step 2: Provision the Amazon EKS Cluster](#step-2-provision-the-amazon-eks-cluster)
   - [Understanding `eksctl-cluster.yaml`](#understanding-eksctl-clusteryaml)
6. [Step 3: Manage Environment Variables (.env)](#step-3-manage-environment-variables-env)
   - [Option A: Standard Kubernetes Secrets (Simple/Direct)](#option-a-standard-kubernetes-secrets-simple-direct)
   - [Option B: AWS Secrets Manager & CSI Driver (Enterprise Setup)](#option-b-aws-secrets-manager--csi-driver-enterprise-setup)
7. [Step 4: Update Manifests & Deploy to EKS](#step-4-update-manifests--deploy-to-eks)
8. [Step 5: Access the Application & Post-Deployment Configuration](#step-5-access-the-application--post-deployment-configuration)
9. [Step 6: Set Up ArgoCD for GitOps Management](#step-6-set-up-argocd-for-gitops-management)
10. [Step 7: Clean Up AWS Resources](#step-7-clean-up-aws-resources)

---

## 1. Architecture & Flow Overview

When deployed to EKS, the application will run in the following architecture:

- **ECR Repository**: Hosts the containerized Next.js image.
- **EKS Cluster**: Managed Kubernetes cluster running the application.
- **Namespace (`local-cv`)**: Logical isolation within Kubernetes for the application's resources.
- **Deployment (`local-cv`)**: Runs 2 replicas (Pods) of the application container.
- **Network Load Balancer (NLB)**: Exposes the app to the internet. AWS creates an NLB pointing to the EKS worker nodes.
- **Horizontal Pod Autoscaler (HPA)**: Automatically scales Pods (between 2 and 6) based on CPU utilization.
- **Environment Management**: Injection of configuration via Kubernetes Secrets (Option A) or synchronized from AWS Secrets Manager (Option B).

---

## 2. Prerequisites & Tool Installation

You need to install the following CLI tools on your local machine to manage AWS and Kubernetes.

### A. Install Required CLI Tools

- **AWS CLI**: For communicating with AWS services.
  - _macOS (via Homebrew)_: `brew install awscli`
  - _Verify_: `aws --version`
- **kubectl**: The Kubernetes command-line tool.
  - _macOS_: `brew install kubectl`
  - _Verify_: `kubectl version --client`
- **eksctl**: The official CLI tool for creating and managing EKS clusters.
  - _macOS_: `brew install eksctl`
  - _Verify_: `eksctl version`
- **Docker**: For building container images. Download and run [Docker Desktop](https://www.docker.com/products/docker-desktop/).
  - _Verify_: `docker --version`
- **Helm**: Optional but highly recommended for installing the Kubernetes CSI drivers (needed for Option B).
  - _macOS_: `brew install helm`

### B. Configure AWS CLI

Run the configuration wizard and input your AWS Access Key, Secret Access Key, preferred region (e.g., `ap-south-1` or `us-east-1`), and default output format (`json`):

```bash
aws configure
```

---

## 3. Required IAM Permissions & Roles

To successfully deploy and manage this system, you need different levels of AWS Identity and Access Management (IAM) permissions depending on the task:

| Role / Actor                                                   | Purpose                                                                    | Required IAM Permissions / Policies                                                                                                                                                                                      |
| :------------------------------------------------------------- | :------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cluster Creator** (The user/role running `eksctl` and `aws`) | Creates cluster, VPC, subnets, worker nodes, and IAM roles.                | Requires administrative access or a customized policy containing permissions for `cloudformation:*`, `eks:*`, `ec2:*`, `iam:*` (specifically for role creation & policies), and `autoscaling:*`.                         |
| **ECR Image Pusher** (Developer machine or CI/CD Pipeline)     | Authenticates with ECR and pushes Docker images.                           | AWS managed policy: `AmazonEC2ContainerRegistryPowerUser` (or explicit `ecr:GetAuthorizationToken`, `ecr:BatchCheckLayer`, `ecr:InitiateLayerUpload`, `ecr:UploadLayerPart`, `ecr:CompleteLayerUpload`, `ecr:PutImage`). |
| **EKS Worker Node Role** (Automatically created by EKS/eksctl) | Allows EC2 nodes to pull images, record metrics, and configure networking. | `AmazonEKSWorkerNodePolicy`, `AmazonEC2ContainerRegistryReadOnly`, `AmazonEKS_CNI_Policy`.                                                                                                                               |
| **Application Secrets Reader** (The ServiceAccount pod role)   | Allows the Next.js container to read credentials from AWS Secrets Manager. | Custom IAM policy: `secretsmanager:GetSecretValue` and `secretsmanager:DescribeSecret` scoped only to the specific secret.                                                                                               |

---

## Step 1: Build & Push Docker Image to Amazon ECR

Next.js has a specific environment variable model. You must understand this to build your image correctly:

- **Build-time Environment Variables** (`NEXT_PUBLIC_*`): Inlined into client-side JS bundles during `npm run build`. They **must** be available when building the image.
- **Runtime Environment Variables** (Secrets like `GITHUB_SECRET`): Accessed only on the server-side, and can be injected dynamically when the container starts.

### A. Authenticate Docker with Amazon ECR

Tell Docker how to authenticate with your AWS account's ECR registry (replace `<aws-region>` and `<aws-account-id>`):

```bash
aws ecr get-login-password --region <aws-region> | docker login --username AWS --password-stdin <aws-account-id>.dkr.ecr.<aws-region>.amazonaws.com
```

### B. Create an ECR Repository

Create a repository named `local-cv` in your AWS account:

```bash
aws ecr create-repository \
    --repository-name local-cv \
    --region <aws-region> \
    --image-scanning-configuration scanOnPush=true \
    --encryption-configuration encryptionType=AES256
```

### C. Build the Docker Image

Ensure you are using the correct Node.js version locally before doing any Node commands:

```bash
nvm use 24.11.1
```

Build the Docker image, passing the build-time public variables as `--build-arg`.

```bash
docker build \
  --build-arg NEXT_PUBLIC_MICROSOFT_CLARITY_ID="vvaekivrvw" \
  -t local-cv:latest .
```

### D. Tag and Push the Image to ECR

Tag your local image to point to your ECR registry, and then push it:

```bash
# Tag the image
docker tag local-cv:latest <aws-account-id>.dkr.ecr.<aws-region>.amazonaws.com/local-cv:latest

# Push the image
docker push <aws-account-id>.dkr.ecr.<aws-region>.amazonaws.com/local-cv:latest
```

---

## Step 2: Provision the Amazon EKS Cluster

We will use `eksctl` to provision a production-ready EKS cluster.

### Understanding `eksctl-cluster.yaml`

In your project, we created a file called [eksctl-cluster.yaml](file:///Users/tusharvashishth/Dev/open-source/local_cv/k8s/eksctl-cluster.yaml). Here is why we use these parameters:

- `apiVersion` & `kind`: Declares the configuration spec version that `eksctl` reads.
- `metadata.name`: Sets the name to `local-cv-cluster` so AWS resources are neatly grouped under this project name.
- `metadata.version`: Sets the Kubernetes version to `1.30`. Using a modern version ensures we have active support and security updates from AWS.
- `managedNodeGroups`: EC2 instances that run your workloads. We set:
  - `instanceType: t3.medium`: Provides a good balance of 2 vCPUs and 4GB RAM to handle Next.js compilation, routing, and background tasks.
  - `desiredCapacity: 2`: Ensures high availability by spreading containers across 2 physical instances.
  - `minSize: 1` & `maxSize: 4`: Allows the cluster to autoscale nodes based on workload.
  - `volumeSize: 20`: Allocates 20GB disk space for storing container logs and Docker cache.
  - `privateNetworking: false`: Puts worker nodes in public subnets (simplified setup). If setting to `true` (enterprise standard), you would need to set up NAT Gateways (adds AWS costs) to let nodes download packages.

### Launch the Cluster

Run `eksctl` using the configuration file. This step takes **10 to 15 minutes**:

```bash
eksctl create cluster -f k8s/eksctl-cluster.yaml
```

### Update Kubeconfig & Verify Connection

Configure your local machine to interact with the new cluster:

```bash
aws eks update-kubeconfig --region <aws-region> --name local-cv-cluster
```

Verify that the nodes are successfully created and running:

```bash
kubectl get nodes
```

> [!WARNING]
> **Did you see a warning about the `vpc-cni` addon and OIDC being disabled?**
>
> **Why this happens**: The `vpc-cni` addon (which configures container networking) needs permissions to communicate with AWS EC2 APIs (to assign IP addresses to Pods). If IAM OIDC wasn't enabled during cluster creation, `eksctl` can't automatically assign those permissions.
>
> **How to fix it for your current cluster**:
>
> 1. **Associate the OIDC Provider**:
>    Enable OpenID Connect trust on the cluster so EKS can authenticate service accounts using AWS IAM:
>    ```shell
>    eksctl utils associate-iam-oidc-provider --cluster local-cv-cluster --approve --region <aws-region>
>    ```

````
>
> 2. **Create the IAM Role for `vpc-cni`**:
>    Create the IAM role and bind it to the `aws-node` service account in the `kube-system` namespace using the AWS-managed CNI policy:
>    ```bash
eksctl create iamserviceaccount \
  --name aws-node \
  --namespace kube-system \
  --cluster local-cv-cluster \
  --role-name AmazonEKSVPCCNIRole \
  --attach-policy-arn arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy \
  --approve \
  --region <aws-region>
````

> 3. **Update the Addon**:
>    Force the `vpc-cni` addon to update and utilize the newly created service account:
>    ```bash
>    eksctl update addon --name vpc-cni --cluster local-cv-cluster --region <aws-region> --wait
>    ```

````
>
> *(Note: We have updated [eksctl-cluster.yaml](file:///Users/tusharvashishth/Dev/open-source/local_cv/k8s/eksctl-cluster.yaml) to include `iam.withOIDC: true` under `metadata` so that this is handled automatically during any future cluster creations).*

---

## Step 3: Manage Environment Variables (.env)

We need to provide configurations like client secrets and salt keys to our pods. Choose either **Option A** (simplest, standard Kubernetes way) or **Option B** (recommended for production, integrates with AWS Secrets Manager).

Before starting, create the namespace:
```bash
kubectl create namespace local-cv
````

---

### Option A: Standard Kubernetes Secrets (Simple/Direct)

This approach stores your environment variables inside base64-encoded Kubernetes Secrets objects, managed via `kubectl`.

Run this command to create the secret (remember, `NEXTAUTH_URL` should temporarily be set to a placeholder, which we will update later):

```bash
kubectl create secret generic local-cv-env \
  --namespace local-cv \
  --from-literal=ENCRYPTION_KEY="your-encryption-key-32-chars-long" \
  --from-literal=ENCRYPTION_SALT="your-encryption-salt" \
  --from-literal=GOOGLE_CLIENT_SECRET="your-google-client-secret" \
  --from-literal=GITHUB_SECRET="your-github-secret" \
  --from-literal=NEXTAUTH_SECRET="your-nextauth-secret-string" \
  --from-literal=NEXTAUTH_URL="http://temp.com"
```

Verify the secret:

```bash
kubectl get secrets -n local-cv
```

---

### Option B: AWS Secrets Manager & CSI Driver (Enterprise Setup)

This approach stores the secret securely in AWS Secrets Manager and synchronizes it automatically into Kubernetes using the **AWS Secrets Store CSI Driver**.

#### 1. Associate IAM OIDC Provider with EKS

EKS needs to trust AWS IAM to issue security credentials for pods. Enable this trust:

```bash
eksctl utils associate-iam-oidc-provider --cluster local-cv-cluster --approve --region <aws-region>
```

#### 2. Create the Secret in AWS Secrets Manager

Create a secret named `local-cv-secrets` in AWS Secrets Manager containing your key-value pairs (as JSON):

```bash
aws secretsmanager create-secret \
  --name local-cv-secrets \
  --region <aws-region> \
  --description "Production environment variables for localCV" \
  --secret-string '{"ENCRYPTION_KEY":"your-key","ENCRYPTION_SALT":"your-salt","GOOGLE_CLIENT_SECRET":"your-google-secret","GITHUB_SECRET":"your-github-secret","NEXTAUTH_SECRET":"your-auth-secret","NEXTAUTH_URL":"http://temp.com"}'
```

Take note of the Secret's ARN (Amazon Resource Name) returned by the command.

#### 3. Create an IAM Policy for Secret Access

Create a local policy file named `secrets-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret"
      ],
      "Resource": "arn:aws:secretsmanager:<aws-region>:<aws-account-id>:secret:local-cv-secrets-*"
    }
  ]
}
```

Create the IAM policy in AWS:

```bash
aws iam create-policy \
  --policy-name LocalCVSecretsPolicy \
  --policy-document file://secrets-policy.json
```

_(Copy the ARN of the created policy: `arn:aws:iam::<aws-account-id>:policy/LocalCVSecretsPolicy`)_

#### 4. Create a ServiceAccount with IAM Role (IRSA)

Create a Kubernetes ServiceAccount in the EKS cluster and bind it to a newly created AWS IAM Role with the policy attached:

```bash
eksctl create iamserviceaccount \
  --name local-cv-secrets-sa \
  --namespace local-cv \
  --cluster local-cv-cluster \
  --attach-policy-arn arn:aws:iam::<aws-account-id>:policy/LocalCVSecretsPolicy \
  --approve \
  --region <aws-region>
```

#### 5. Install Secrets Store CSI Driver & AWS Provider Plugin

Install the CSI driver via Helm:

```bash
# Add Helm Repository
helm repo add secrets-store-csi-driver https://kubernetes-sigs.github.io/secrets-store-csi-driver/charts
helm repo update

# Install Driver (enabling sync to Kubernetes Secrets)
helm install csi-secrets-store secrets-store-csi-driver/secrets-store-csi-driver \
  --namespace kube-system \
  --set syncSecret.enabled=true
```

Install the official AWS Provider plugin:

```bash
kubectl apply -f https://raw.githubusercontent.com/aws/secrets-store-csi-driver-provider-aws/main/deployment/aws-provider-installer.yaml
```

#### 6. Configure SecretProviderClass

Create a file named `k8s/secrets-provider.yaml` to configure how EKS syncs the AWS Secrets Manager fields into a standard Kubernetes Secret:

```yaml
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: local-cv-aws-secrets
  namespace: local-cv
spec:
  provider: aws
  secretObjects:
    - secretName: local-cv-env # This is the name of the Kubernetes Secret generated automatically
      type: Opaque
      data:
        - objectName: ENCRYPTION_KEY
          key: ENCRYPTION_KEY
        - objectName: ENCRYPTION_SALT
          key: ENCRYPTION_SALT
        - objectName: GOOGLE_CLIENT_SECRET
          key: GOOGLE_CLIENT_SECRET
        - objectName: GITHUB_SECRET
          key: GITHUB_SECRET
        - objectName: NEXTAUTH_SECRET
          key: NEXTAUTH_SECRET
        - objectName: NEXTAUTH_URL
          key: NEXTAUTH_URL
  parameters:
    objects: |
      - objectName: "local-cv-secrets"
        objectType: "secretsmanager"
        jmesPath:
          - path: "ENCRYPTION_KEY"
            objectAlias: "ENCRYPTION_KEY"
          - path: "ENCRYPTION_SALT"
            objectAlias: "ENCRYPTION_SALT"
          - path: "GOOGLE_CLIENT_SECRET"
            objectAlias: "GOOGLE_CLIENT_SECRET"
          - path: "GITHUB_SECRET"
            objectAlias: "GITHUB_SECRET"
          - path: "NEXTAUTH_SECRET"
            objectAlias: "NEXTAUTH_SECRET"
          - path: "NEXTAUTH_URL"
            objectAlias: "NEXTAUTH_URL"
```

Apply the mapping resource:

```bash
kubectl apply -f k8s/secrets-provider.yaml
```

#### 7. Mount the CSI Volume in your Deployment

To trigger the CSI Driver to pull secrets, you must mount the volume to your Deployment Pods and use the created ServiceAccount.

Open `k8s/eks-prod.yml` and add the `serviceAccountName`, `volumeMounts`, and `volumes` configuration. Your Deployment spec under `template.spec` should look like this:

```yaml
serviceAccountName: local-cv-secrets-sa # The service account linked to the IAM Role
containers:
  - name: local-cv
    image: <aws-account-id>.dkr.ecr.<aws-region>.amazonaws.com/local-cv:latest
    # ... rest of container spec ...
    volumeMounts:
      - name: secrets-store-inline
        mountPath: "/mnt/secrets-store"
        readOnly: true
volumes:
  - name: secrets-store-inline
    csi:
      driver: secrets-store.csi.k8s.io
      readOnly: true
      volumeAttributes:
        secretProviderClass: "local-cv-aws-secrets"
```

---

## Step 4: Update Manifests & Deploy to EKS

### A. Edit `k8s/eks-prod.yml`

Open `k8s/eks-prod.yml` and find the `image` field under the `Deployment` container spec (line 37):

```yaml
- name: local-cv
  image: <aws-account-id>.dkr.ecr.<aws-region>.amazonaws.com/local-cv:latest
```

Replace `<aws-account-id>` and `<aws-region>` with your AWS credentials.

### B. Deploy the Resources

Apply the configuration file to EKS:

```bash
kubectl apply -f k8s/eks-prod.yml
```

### C. Check Deployment Status

Check if the pods are starting up:

```bash
kubectl get pods -n local-cv
```

Check the services to make sure the load balancer is being provisioned:

```bash
kubectl get svc -n local-cv
```

---

## Step 5: Access the Application & Post-Deployment Configuration

### A. Retrieve the AWS Load Balancer URL

Find the DNS name under the `EXTERNAL-IP` column of the `local-cv` Service:

```bash
kubectl get svc local-cv -n local-cv
```

You will see something like:
`k8s-localcv-localcv-xxxxxxxxxx-xxxxxxxxxx.elb.ap-south-1.amazonaws.com`

> [!NOTE]
> It takes 2 to 5 minutes for AWS to register target groups and activate the NLB. If the URL doesn't load immediately in your browser, wait a few minutes.

### B. Configure NextAuth & Auth Providers (Crucial Step)

NextAuth requires the absolute public URL to handle redirects.

1. Copy the external DNS name (e.g., `http://k8s-localcv-localcv-xxxxxxxxxx-xxxxxxxxxx.elb.ap-south-1.amazonaws.com`).
2. Update the environment variables:
   - **For Option A (Kubernetes Secrets)**:
     ```bash
     kubectl delete secret local-cv-env -n local-cv
     kubectl create secret generic local-cv-env \
       --namespace local-cv \
       --from-literal=ENCRYPTION_KEY="your-key" \
       --from-literal=ENCRYPTION_SALT="your-salt" \
       --from-literal=GOOGLE_CLIENT_SECRET="your-google-secret" \
       --from-literal=GITHUB_SECRET="your-github-secret" \
       --from-literal=NEXTAUTH_SECRET="your-auth-secret" \
       --from-literal=NEXTAUTH_URL="http://k8s-localcv-localcv-xxxxxxxxxx-xxxxxxxxxx.elb.ap-south-1.amazonaws.com"
     ```
   - **For Option B (AWS Secrets Manager)**:
     Go to the AWS Console (Secrets Manager) or run the AWS CLI command to update the JSON payload with the correct `NEXTAUTH_URL`:
     ```bash
     aws secretsmanager put-secret-value \
       --secret-id local-cv-secrets \
       --region <aws-region> \
       --secret-string '{"ENCRYPTION_KEY":"your-key","ENCRYPTION_SALT":"your-salt","GOOGLE_CLIENT_SECRET":"your-google-secret","GITHUB_SECRET":"your-github-secret","NEXTAUTH_SECRET":"your-auth-secret","NEXTAUTH_URL":"http://k8s-localcv-localcv-xxxxxxxxxx-xxxxxxxxxx.elb.ap-south-1.amazonaws.com"}'
     ```
3. Perform a **rollout restart** of the deployment so the container re-loads the configuration:
   ```bash
   kubectl rollout restart deployment/local-cv -n local-cv
   ```
4. Update your OAuth Applications (Google Console / GitHub Developer Settings) Authorized Redirect URIs:
   - Google: `http://<your-load-balancer-dns>/api/auth/callback/google`
   - GitHub: `http://<your-load-balancer-dns>/api/auth/callback/github`

### C. Using a Custom Domain (Optional but Recommended)

Instead of using the long AWS ELB URL, you can link a custom domain (e.g. `resume.yourdomain.com`):

1. In your DNS provider (e.g. Route 53, Cloudflare, GoDaddy), create a **CNAME record**:
   - **Name**: `resume`
   - **Value / Target**: `<your-aws-load-balancer-dns-name>`
2. Recreate your secret updating `NEXTAUTH_URL` to your custom domain (`https://resume.yourdomain.com`).
3. Restart the deployment: `kubectl rollout restart deployment/local-cv -n local-cv`.
4. Update OAuth Redirect URIs to use the custom domain.

---

## Step 6: Set Up ArgoCD for GitOps Management

ArgoCD is a declarative GitOps continuous delivery tool for Kubernetes. It monitors your running applications and compares their live state with the target state defined in your Git repository.

Setting up ArgoCD allows you to visually manage, sync, and inspect the status of your Pods, Service, and Deployments.

### A. Install ArgoCD in the Cluster

Create a dedicated `argocd` namespace and apply the official ArgoCD installation manifests:

```bash
# Create the namespace
kubectl create namespace argocd

# Apply the installation manifests
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Verify that all ArgoCD pods are running successfully:

```bash
kubectl get pods -n argocd
```

### B. Access the ArgoCD Dashboard

By default, the ArgoCD API server is not exposed to the public internet. You can access it using either **Option 1** (secure local port-forwarding) or **Option 2** (public Network Load Balancer).

#### Option 1: Port-Forwarding (Secure Local Tunnel)

Forward traffic from your local machine (port `8080`) to the cluster's internal `argocd-server` service:

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Now, you can open your browser and navigate to `https://localhost:8080`.

#### Option 2: Expose via AWS LoadBalancer

Change the Service type of `argocd-server` to `LoadBalancer` to have AWS provision an internet-facing Load Balancer:

```bash
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'
```

To retrieve the public URL of the ArgoCD dashboard:

```bash
kubectl get svc argocd-server -n argocd
```

Look for the `EXTERNAL-IP` (e.g., `*.elb.ap-south-1.amazonaws.com`).

### C. Log In to the Dashboard

1. The default username is **`admin`**.
2. Retrieve the auto-generated initial password by running:
   ```bash
   kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
   ```
3. Use `admin` and this decrypted password to log in. It is highly recommended to change the password in the User Info settings once logged in.

### D. Connect your localCV Application to ArgoCD

You can register your application using either the ArgoCD web UI or by applying a Kubernetes manifest.

#### Method 1: Using the Web UI

1. Click on **`+ NEW APP`** in the top-left corner.
2. Fill out the application details:
   - **Application Name**: `localcv`
   - **Project Name**: `default`
   - **Sync Policy**: `Automatic` (or `Manual` if you prefer to review differences before applying)
3. Set the **Source**:
   - **Repository URL**: Enter your GitHub repository URL where this codebase resides.
   - **Revision**: `HEAD` (or target branch name like `main`)
   - **Path**: `k8s` (this tells ArgoCD to apply all YAML files in the `k8s/` folder)
4. Set the **Destination**:
   - **Cluster URL**: `https://kubernetes.default.svc` (the cluster EKS runs inside)
   - **Namespace**: `local-cv`
5. Click **CREATE**. ArgoCD will map the structure of your manifests and show a live visual graph of your Deployment, Pods, HPA, and LoadBalancer!

#### Method 2: Using a Manifest

Create a file named `k8s/argocd-app.yaml` with the following configuration:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: local-cv-gitops
  namespace: argocd
spec:
  project: default
  source:
    repoURL: "https://github.com/<your-username>/<your-repo-name>.git" # Replace with your repository
    targetRevision: HEAD
    path: k8s
  destination:
    server: "https://kubernetes.default.svc"
    namespace: local-cv
  syncPolicy:
    automated:
      prune: true # Automatically deletes resources that are deleted from Git
      selfHeal: true # Recreates/overwrites resources if manual changes are made in the cluster
```

Apply the application configuration:

```bash
kubectl apply -f k8s/argocd-app.yaml
```

ArgoCD will automatically start syncing the repository state and show the synchronization status on your dashboard.

---

## Step 7: Clean Up AWS Resources

To prevent recurring costs from AWS, delete the resources when you are done.

### A. Delete Kubernetes Resources (NLB, Deployments)

Deleting the Service deletes the underlying AWS Load Balancer:

```bash
kubectl delete -f k8s/eks-prod.yml
```

### B. Delete EKS Cluster

Delete the cluster and all its Node Groups:

```bash
eksctl delete cluster --name local-cv-cluster --region <aws-region>
```

### C. Delete ECR Repository

Delete the Docker images repository:

```bash
aws ecr delete-repository --repository-name local-cv --region <aws-region> --force
```
