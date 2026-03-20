import { CfnOutput, Duration, Stack, StackProps } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { join } from "path";
import { existsSync } from "fs";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import {
  AccessLevel,
  Distribution,
  Function,
  FunctionCode,
  FunctionEventType,
  FunctionRuntime,
} from "aws-cdk-lib/aws-cloudfront";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";

const DOMAIN_NAME = "arkun.co.uk";

/**
 * Static Next.js on S3 + CloudFront (output: "export"):
 * - Modern/cost-effective for content and client-only apps; no Node runtime on AWS.
 * - OAC (not legacy OAI) for origin access; CloudFront Functions (not Lambda@Edge) for URL rewrites — low latency, low cost.
 * - For SSR, Route Handlers, or dynamic server features, use a Next adapter (e.g. OpenNext) or Vercel instead of this stack.
 */
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

    // Path to the Next.js static export output (`npm run build` -> `out/`)
    const uiDir = join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "event_countdown_web",
      "out",
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

    // With `trailingSlash: true`, Next emits `out/support/index.html` etc. Browsers request
    // `/support` or `/support/`; S3 keys are `support/index.html` — map those paths here.
    const staticHtmlRewrite = new Function(this, "StaticHtmlRewrite", {
      code: FunctionCode.fromInline(`
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  if (uri === "/" || uri === "") {
    return request;
  }
  if (uri.indexOf("/_next") === 0) {
    return request;
  }
  var path = uri;
  if (path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  var lastSlash = path.lastIndexOf("/");
  var lastSegment = path.substring(lastSlash + 1);
  if (lastSegment.indexOf(".") !== -1) {
    return request;
  }
  request.uri = path + "/index.html";
  return request;
}
`),
      comment: "Map extensionless routes to Next export paths (*/index.html)",
      runtime: FunctionRuntime.JS_2_0,
    });

    // CloudFront CDN distribution with custom domain and SSL
    const distribution = new Distribution(this, "Example2Distribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: s3Origin,
        functionAssociations: [
          {
            function: staticHtmlRewrite,
            eventType: FunctionEventType.VIEWER_REQUEST,
          },
        ],
      },
      domainNames: [DOMAIN_NAME],
      certificate: certificate,
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: "/404.html",
          ttl: Duration.minutes(5),
        },
        // Missing keys on a private S3 origin often return 403; without this,
        // viewers see raw S3 XML instead of the exported 404 page.
        {
          httpStatus: 403,
          responseHttpStatus: 404,
          responsePagePath: "/404.html",
          ttl: Duration.minutes(5),
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
