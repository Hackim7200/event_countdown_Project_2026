import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { join } from "path";
import { existsSync } from "fs";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { AccessLevel, Distribution } from "aws-cdk-lib/aws-cloudfront";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";

const DOMAIN_NAME = "arkun.co.uk";

export class UiDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    // CloudFront requires ACM certificates to be in us-east-1
    super(scope, id, props);

    // Look up the existing Route 53 hosted zone for arkun.com
    const hostedZone = HostedZone.fromLookup(this, "HostedZone", {
      domainName: DOMAIN_NAME,
    });

    // Create an SSL certificate, validated automatically via Route 53 DNS
    const certificate = new Certificate(this, "SiteCertificate", {
      domainName: DOMAIN_NAME,
      validation: CertificateValidation.fromDns(hostedZone),
    });

    // S3 bucket to store the static frontend files
    const deploymentBucket = new Bucket(this, "uiDeploymentBucket", {
      bucketName: `arkun-co-uk-frontend`,
    });

    // Path to the Next.js static export output (npm run build -> dist/)
    const uiDir = join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "event_countdown_web",
      "dist",
    );

    // Skip deployment if dist folder doesn't exist (build hasn't been run yet)
    if (!existsSync(uiDir)) {
      console.warn("Ui dir not found:" + uiDir);
      return;
    }

    // OAC (Origin Access Control) lets CloudFront read from the private S3 bucket
    const s3Origin = S3BucketOrigin.withOriginAccessControl(deploymentBucket, {
      originAccessLevels: [AccessLevel.READ],
    });

    // CloudFront CDN distribution with custom domain and SSL
    const distribution = new Distribution(this, "Example2Distribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: s3Origin,
      },
      domainNames: [DOMAIN_NAME],
      certificate: certificate,
      // Fallback to index.html for client-side routing (e.g. /events, /todos)
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
      ],
    });

    // Upload the static build files to the S3 bucket and invalidate CloudFront cache
    new BucketDeployment(this, "Example2Deployment", {
      destinationBucket: deploymentBucket,
      sources: [Source.asset(uiDir)],
      distribution: distribution,
      distributionPaths: ["/*"],
    });

    // DNS record pointing arkun.com to the CloudFront distribution
    new ARecord(this, "SiteAliasRecord", {
      zone: hostedZone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    });

    // Output the site URL after deploy
    new CfnOutput(this, "SiteUrl", {
      value: `https://${DOMAIN_NAME}`,
    });
  }
}
