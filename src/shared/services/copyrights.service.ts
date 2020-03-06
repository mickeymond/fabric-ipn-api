import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FileSystemWallet, Gateway } from 'fabric-network';
import * as path from 'path';

import * as ccp from '../../crypto/connection.json';
import { CopyrightType } from 'src/graphql/copyrights/dto/copyrights.dto.js';

@Injectable()
export class CopyrightsService {
  private walletPath: string;
  private wallet: FileSystemWallet;
  private gateway: Gateway;

  constructor() {
    this.walletPath = path.resolve(process.cwd(), "dist", "crypto", "wallet");
    // Create a new file system based wallet for managing identities.
    this.wallet = new FileSystemWallet(this.walletPath);
    console.log(`Wallet path: ${this.walletPath}`);
    // Create a new gateway for connecting to our peer node.
    this.gateway = new Gateway();
  }

  async createCopyright(user, copyrightId, name) {
    try {
      // connect to gateway with user credentials
      await this.gateway.connect(ccp, {
        wallet: this.wallet,
        identity: user,
        discovery: { enabled: true, asLocalhost: false }
      });
  
      // Get the network channel that the smart contract is deployed to.
      const network = await this.gateway.getNetwork("channel1");
  
      // Get the smart contract from the network channel.
      const contract = network.getContract("demo-chain-ts");
  
      // Submit the 'createCar' transaction to the smart contract, and wait for it
      // to be committed to the ledger.
      await contract.submitTransaction("createCopyright", copyrightId, name);
      this.gateway.disconnect();
  
      return "Transaction has been submitted";
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async readCopyrights(): Promise<CopyrightType[]> {
    try {
      // connect to gateway using admin credentials
      const gateway = new Gateway();
      await gateway.connect(ccp, {
        wallet: this.wallet,
        identity: "admin",
        discovery: { enabled: true, asLocalhost: false }
      });
  
      // Get the network channel that the smart contract is deployed to.
      const network = await gateway.getNetwork("channel1");
  
      // Get the smart contract from the network channel.
      const contract = network.getContract("demo-chain-ts");
  
      // Submit the 'createCar' transaction to the smart contract, and wait for it
      // to be committed to the ledger.
      const results = await contract.evaluateTransaction("readAllCopyright");
      gateway.disconnect();
  
      return JSON.parse(results.toString());
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
