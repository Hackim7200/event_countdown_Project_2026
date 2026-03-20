import { Fn, Stack } from "aws-cdk-lib";

// this function is helper function used to create unique id
export function getSuffixFromStack(stack: Stack) {
    const ShortStackId = Fn.select(2, Fn.split('/', stack.stackId))
    const suffix = Fn.select(4, Fn.split('-', ShortStackId))

    return suffix;
}