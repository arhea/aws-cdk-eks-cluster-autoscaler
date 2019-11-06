# AWS CDK EKS Cluster Autoscaler
This module makes it easy to deploy and manage Cluster Autoscaler from AWS CDK for your EKS clusters. This module is designed based on the guidance provided in the [AWS documentation](https://docs.aws.amazon.com/en_pv/eks/latest/userguide/cluster-autoscaler.html).

## Usage

| Option | Description | Default |
|---|---|---|
| `cluster` | The `@aws-cdk/aws-eks` cluster instance where this Cluster Autoscaler should be deployed. | N/A |
| `nodeGroups` | A list of `AutoScalingGroup` (`@aws-cdk/aws-autoscaling`) to include as part of the cluser autoscaler. | N/A |
| `version` | The version of the Cluster Autoscaler to deploy. Find the latest version based on your Kubernetes [version here](https://github.com/kubernetes/autoscaler/releases).  | `v1.14.6` |

```typescript
const vpc = new ec2.Vpc(this, 'demo-vpc', {
  cidr: '10.1.0.0/16',
  maxAzs: 3,
  enableDnsHostnames: true,
  enableDnsSupport: true
});

const clusterAdmin = new iam.Role(this, 'AdminRole', {
  assumedBy: new iam.AccountRootPrincipal()
});

const cluster = new eks.Cluster(this, 'demo-cluster', {
  mastersRole: clusterAdmin,
  vpc: vpc,
  vpcSubnets: [
    {
      subnetType: ec2.SubnetType.PRIVATE
    }
  ],
  defaultCapacity: 0
});

const ng = cluster.addCapacity('demo-ng1', {
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.LARGE),
  associatePublicIpAddress: false,
  bootstrapEnabled: true,
  desiredCapacity: 3,
  minCapacity: 3,
  maxCapacity: 6,
  mapRole: true
});

const csa = new ClusterAutoscaler(this, 'demo-cluster-autoscaler', {
  cluster: cluster, // your EKS cluster
  nodeGroups: [ ng ] // a list of your node groups
});
```
