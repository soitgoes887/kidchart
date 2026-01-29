import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";

// Configuration
const config = new pulumi.Config();
const image = config.get("image") || "anicu/kidchart:latest";
const replicas = config.getNumber("replicas") || 2;
const host = config.get("host") || "kidchart.com";
const kubeconfigContext = config.get("kubeconfigContext") || "kubernetes-admin@kubernetes";

// Create Kubernetes provider using local kubeconfig
const k8sProvider = new k8s.Provider("k8s-provider", {
    context: kubeconfigContext,
    enableServerSideApply: true,
});

// Create kidchart namespace
const namespace = new k8s.core.v1.Namespace("kidchart-namespace", {
    metadata: {
        name: "kidchart",
    },
}, { provider: k8sProvider });

// Create kidchart deployment
const deployment = new k8s.apps.v1.Deployment("kidchart-deployment", {
    metadata: {
        name: "kidchart",
        namespace: "kidchart",
        labels: { app: "kidchart" },
        annotations: {
            "pulumi.com/patchForce": "true",
        },
    },
    spec: {
        replicas: replicas,
        selector: {
            matchLabels: { app: "kidchart" },
        },
        template: {
            metadata: {
                labels: { app: "kidchart" },
            },
            spec: {
                containers: [{
                    name: "kidchart",
                    image: image,
                    imagePullPolicy: "Always",
                    ports: [{ containerPort: 80 }],
                    resources: {
                        requests: {
                            memory: "64Mi",
                            cpu: "50m",
                        },
                        limits: {
                            memory: "128Mi",
                            cpu: "100m",
                        },
                    },
                    livenessProbe: {
                        httpGet: {
                            path: "/",
                            port: 80,
                        },
                        initialDelaySeconds: 10,
                        periodSeconds: 10,
                    },
                    readinessProbe: {
                        httpGet: {
                            path: "/",
                            port: 80,
                        },
                        initialDelaySeconds: 5,
                        periodSeconds: 5,
                    },
                }],
            },
        },
    },
}, { provider: k8sProvider, dependsOn: [namespace] });

// Create kidchart service
const service = new k8s.core.v1.Service("kidchart-service", {
    metadata: {
        name: "kidchart",
        namespace: "kidchart",
    },
    spec: {
        type: "ClusterIP",
        selector: { app: "kidchart" },
        ports: [{
            port: 80,
            targetPort: 80,
        }],
    },
}, { provider: k8sProvider, dependsOn: [namespace] });

// Create kidchart ingress with TLS
const ingress = new k8s.networking.v1.Ingress("kidchart-ingress", {
    metadata: {
        name: "kidchart",
        namespace: "kidchart",
        annotations: {
            "cert-manager.io/cluster-issuer": "letsencrypt-prod",
        },
    },
    spec: {
        ingressClassName: "nginx",
        tls: [{
            hosts: [host],
            secretName: "kidchart-tls",
        }],
        rules: [{
            host: host,
            http: {
                paths: [{
                    path: "/",
                    pathType: "Prefix",
                    backend: {
                        service: {
                            name: "kidchart",
                            port: { number: 80 },
                        },
                    },
                }],
            },
        }],
    },
}, { provider: k8sProvider, dependsOn: [namespace, service] });

// Exports
export const k8sNamespace = namespace.metadata.name;
export const k8sDeployment = deployment.metadata.name;
export const k8sImage = image;
export const k8sReplicas = replicas;
export const k8sIngressHost = host;
export const k8sUrl = `https://${host}`;
