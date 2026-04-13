/**
 * Last-resort defaults when `NEXT_PUBLIC_*` are unset (e.g. `outputs.json` not found at build time).
 * Keep in sync with `cdk_infrastructure/outputs.json` / Flutter `amplifyconfiguration.dart`.
 */
export const AMPLIFY_ENV_DEFAULTS = {
  userPoolId: "eu-west-2_weHNMaBrf",
  userPoolClientId: "7k2bj5mc3mih796tsdvn5gua47",
  identityPoolId: "eu-west-2:8571b526-05cf-4a0b-a02c-0dfc1d68f422",
  countdownApiEndpoint:
    "https://yd9av6ydjj.execute-api.eu-west-2.amazonaws.com/prod",
  awsRegion: "eu-west-2",
} as const;
