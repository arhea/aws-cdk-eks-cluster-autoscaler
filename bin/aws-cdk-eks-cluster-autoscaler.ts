#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { AwsCdkEksClusterAutoscalerStack } from '../lib/aws-cdk-eks-cluster-autoscaler-stack';

const app = new cdk.App();
new AwsCdkEksClusterAutoscalerStack(app, 'AwsCdkEksClusterAutoscalerStack');
