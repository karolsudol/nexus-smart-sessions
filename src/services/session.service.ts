import { Injectable } from '@nestjs/common';
import {
  smartSessionCreateActions,
  createNexusClient,
  toSmartSessionsValidator,
  createNexusSessionClient,
  SessionData,
} from '@biconomy/sdk';
import { NexusClientService } from './nexus-client.service';
import { GrantPermissionParams } from '../types/session.types';
import { SmartSessionMode } from '@rhinestone/module-sdk/module';
import { privateKeyToAccount } from 'viem/accounts';
import { http } from 'viem';

@Injectable()
export class SessionService {
  private sessionNexusClient;

  constructor(private nexusClientService: NexusClientService) {
    const nexusClient = this.nexusClientService.getNexusClient();
    this.sessionNexusClient = nexusClient.extend(
      smartSessionCreateActions(/* sessionsModule */) // You'll need to provide the sessions module
    );
  }

  async initializeSession(userAccount: any, bundlerUrl: string) {
    const nexusClient = await createNexusClient({
      signer: userAccount,
      chain: this.nexusClientService.getChain(),
      transport: http(),
      bundlerTransport: http(bundlerUrl),
    });

    // Create and install sessions module
    const sessionsModule = toSmartSessionsValidator({
      account: nexusClient.account,
      signer: userAccount,
    });

    const hash = await nexusClient.installModule({
      module: sessionsModule.moduleInitData,
    });
    await nexusClient.waitForUserOperationReceipt({ hash });

    this.sessionNexusClient = nexusClient.extend(
      smartSessionCreateActions(sessionsModule)
    );
  }

  async createSessionClient(sessionOwner: any, sessionData: SessionData, bundlerUrl: string) {
    const smartSessionNexusClient = await createNexusSessionClient({
      chain: this.nexusClientService.getChain(),
      accountAddress: sessionData.granter,
      signer: sessionOwner,
      transport: http(),
      bundlerTransport: http(bundlerUrl),
    });

    const usePermissionsModule = toSmartSessionsValidator({
      account: smartSessionNexusClient.account,
      signer: sessionOwner,
      moduleData: sessionData.moduleData,
    });

    return smartSessionNexusClient.extend(
      smartSessionUseActions(usePermissionsModule)
    );
  }

  async grantPermission(params: GrantPermissionParams): Promise<string> {
    const response = await this.sessionNexusClient.grantPermission(params);
    return response;
  }

  async trustAttesters(attesters: string[], registryAddress: string): Promise<string> {
    const response = await this.sessionNexusClient.trustAttesters({
      attesters,
      registryAddress,
    });
    return response;
  }
} 