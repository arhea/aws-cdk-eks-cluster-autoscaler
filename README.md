# AWS CDK EKS Cluster Autoscaler
This module makes it easy to deploy and manage Cluster Autoscaler from AWS CDK for your EKS clusters. This module is designed based on the guidance provided in the [AWS documentation](https://docs.aws.amazon.com/en_pv/eks/latest/userguide/cluster-autoscaler.html). This Construct will perform the following tasks:

- Add `k8s.io/cluster-autoscaler/<cluster-name>` and `k8s.io/cluster-autoscaler/enabled` tags to your autoscaling groups
- Attach the Cluster Autoscaler policy to the role attached to the Autoscaling Group
- Deploy the Cluster Autoscaler  Kubernetes Manifest

## Installation

You can install this with `npm` or `yarn`.

```bash
npm i `@arhea/aws-cdk-eks-cluster-autoscaler` --save
```

or

```bash
yarn add `@arhea/aws-cdk-eks-cluster-autoscaler`
```

## Usage

```typescript
import { ClusterAutoscaler } from '@arhea/aws-cdk-eks-cluster-autoscaler';

const csa = new ClusterAutoscaler(this, 'demo-cluster-autoscaler', {
  cluster: cluster, // your EKS cluster
  nodeGroups: [ ng ], // a list of your node groups
  version: 'v1.14.6' // the version of cluster autoscaler to deploy
});
```

| Option | Description | Default |
|---|---|---|
| `cluster` | The `@aws-cdk/aws-eks` cluster instance where this Cluster Autoscaler should be deployed. | N/A |
| `nodeGroups` | A list of `AutoScalingGroup` (`@aws-cdk/aws-autoscaling`) to include as part of the cluser autoscaler. | N/A |
| `version` | The version of the Cluster Autoscaler to deploy. Find the latest version based on your Kubernetes [version here](https://github.com/kubernetes/autoscaler/releases).  | `v1.14.6` |

## Full Example

```typescript

// create a vpc to deploy eks
const vpc = new ec2.Vpc(this, 'example-vpc', {
  cidr: '10.1.0.0/16',
  maxAzs: 3,
  enableDnsHostnames: true,
  enableDnsSupport: true
});

// define an admin role to use, to enable kubectl
const clusterAdmin = new iam.Role(this, 'AdminRole', {
  assumedBy: new iam.AccountRootPrincipal()
});

// create the cluster
const cluster = new eks.Cluster(this, 'example-cluster', {
  mastersRole: clusterAdmin,
  vpc: vpc,
  vpcSubnets: [
    {
      subnetType: ec2.SubnetType.PRIVATE
    }
  ],
  defaultCapacity: 0
});


// create a custom node group
const ng = cluster.addCapacity('demo-ng1', {
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.LARGE),
  associatePublicIpAddress: false,
  bootstrapEnabled: true,
  desiredCapacity: 3,
  minCapacity: 3,
  maxCapacity: 6,
  mapRole: true
});

// create the cluster autoscaler instance
const csa = new ClusterAutoscaler(this, 'demo-cluster-autoscaler', {
  cluster: cluster, // your EKS cluster
  nodeGroups: [ ng ] // a list of your node groups
});
```
