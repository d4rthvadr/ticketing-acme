## Motivation

## Technologies used
1. Docker and Kubernetes
2. Nextjs
3. Nodejs
4. Skaffold
5. Husky

To start local development, run:

```shell
skaffold dev

```

Publish to an organization repo vtex-tickets

```
 npm publish --access public
```

Update npm package version automatically. example 1.0.5

```shell
npm version patch

```

Update services with latest version of common module
```shell
npm update @vtex-tickets/common

```

To publish an updated common to npm registry do:
1. git add . and commit with a message
2. update version using npm version patch|major|minor depending on your use-case
3. run npm publish

Create secret

```shell
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=some-secret-goes-here
```

### Troubleshooting ingress issues
Verify that the Nginx Ingress Controller is installed and running in your cluster. Use the following command to check:
```shell
kubectl get pods -n ingress-nginx

```
If it's not installed,  install using:
```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml

```

Confirm that the Ingress resource is created and properly configured

```shell
kubectl get ingress

```

## Useful scripts

1. Purge dangling images (ie Images without a tag or labels)
```shell
docker images --filter "dangling=true" --quiet | xargs docker rmi -f
```

2. Port forwarding nats streams to nats pod
```shell
kubectl port-forward nats-depl-XXXXX-XXXX 4222:4222

```


### Notes
Nats
1.  CLientId:
    - Used in NATS Streaming (deprecated in favor of JetStream).
    - Identifies a unique client connection to the NATS Streaming server.
    - Must be unique across clients connecting to the same streaming server.
    - If two clients use the same clientId, the second client forces the first one to disconnect.
2. ClusterId
    - Represents the NATS Streaming cluster name.
    - Used to differentiate multiple independent streaming clusters running on the same infrastructure.
    - Clients connecting to a cluster must specify the correct clusterId.     


### Strategies to solve common microservices problems
1. Outbox-pattern (Dual-write problem)
2. Retry mechanism
3. Saga Pattern for distributed transactions
4. Fallback pattern
5. Retry + circuit breaker pattern
6. Buildhead pattern

