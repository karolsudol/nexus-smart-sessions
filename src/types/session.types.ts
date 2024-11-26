import { type Address } from "viem"

export enum ParamCondition {
  EQUAL = 0,
  GREATER_THAN = 1,
  LESS_THAN = 2,
  GREATER_THAN_OR_EQUAL = 3,
  LESS_THAN_OR_EQUAL = 4,
  NOT_EQUAL = 5
}

export type Usage = {
  limit: bigint;
  used: bigint;
}

export type Rule = {
  condition: ParamCondition;
  offsetIndex: number;
  isLimited: boolean;
  ref: string | number | bigint;
  usage?: Usage;
}

export type ActionPolicy = {
  contractAddress: Address;
  functionSelector: string;
  rules: Rule[];
}

export type SessionConfig = {
  sessionPublicKey: string;
  actionPoliciesInfo: ActionPolicy[];
}

export type GrantPermissionParams = {
  sessionRequestedInfo: SessionConfig[];
} 