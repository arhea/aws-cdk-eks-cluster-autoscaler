# AWS CDK EKS Cluster Autoscaler
This module makes it easy to deploy and manage Cluster Autoscaler from AWS CDK for your EKS clusters.

## Usage

```typescript
  const csa = new ClusterAutoscaler(this, 'k8s-cluster-autoscaler', {
    cluster: cluster, // your EKS cluister
    nodegroups: [ ng ] // a list of your node groups
  });
```

# Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
