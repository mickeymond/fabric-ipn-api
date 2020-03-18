import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FileSystemWallet, Gateway } from 'fabric-network';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

import * as ccp from '../../crypto/connection.json';
import { ICopyrightInput, ICopyrightType } from '../interfaces/copyright.interface';
import { IUserType } from '../interfaces/user.interface';

@Injectable()
export class CopyrightsService {
  private walletPath: string;
  private wallet: FileSystemWallet;
  private gateway: Gateway;

  constructor() {
    this.walletPath = path.resolve(process.cwd(), "dist", "crypto", "wallet");
    // Create a new file system based wallet for managing identities.
    this.wallet = new FileSystemWallet(this.walletPath);
    // Create a new gateway for connecting to our peer node.
    this.gateway = new Gateway();
  }

  async createCopyright(user: IUserType, copyrightInput: ICopyrightInput) {
    try {
      // connect to gateway with user credentials
      await this.gateway.connect(ccp, {
        wallet: this.wallet,
        identity: user.enrollmentId,
        discovery: { enabled: true, asLocalhost: true }
      });
  
      // Get the network channel that the smart contract is deployed to.
      const network = await this.gateway.getNetwork("mychannel");
  
      // Get the smart contract from the network channel.
      const contract = network.getContract("fabric-ipn-contract");

      // Generate Unique ID for the Resource
      const id = uuidv4();
  
      // Submit the 'createCar' transaction to the smart contract, and wait for it
      // to be committed to the ledger.
      await contract.submitTransaction("createCopyright", JSON.stringify({ id, ...copyrightInput }));
      this.gateway.disconnect();
  
      return "Transaction has been submitted";
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async readCopyrights(user: IUserType): Promise<ICopyrightType[]> {
    try {
      // connect to gateway using admin credentials
      const gateway = new Gateway();
      await gateway.connect(ccp, {
        wallet: this.wallet,
        identity: user.enrollmentId,
        discovery: { enabled: true, asLocalhost: true }
      });
  
      // Get the network channel that the smart contract is deployed to.
      const network = await gateway.getNetwork("mychannel");
  
      // Get the smart contract from the network channel.
      const contract = network.getContract("fabric-ipn-contract");
  
      // Submit the 'createCar' transaction to the smart contract, and wait for it
      // to be committed to the ledger.
      const results = await contract.evaluateTransaction("readAllCopyright");
      gateway.disconnect();
  
      return JSON.parse(results.toString());
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async readCopyright(user: IUserType, id: string): Promise<ICopyrightType> {
    try {
      // connect to gateway using admin credentials
      const gateway = new Gateway();
      await gateway.connect(ccp, {
        wallet: this.wallet,
        identity: user.enrollmentId,
        discovery: { enabled: true, asLocalhost: true }
      });
  
      // Get the network channel that the smart contract is deployed to.
      const network = await gateway.getNetwork("mychannel");
  
      // Get the smart contract from the network channel.
      const contract = network.getContract("fabric-ipn-contract");
  
      // Submit the 'createCar' transaction to the smart contract, and wait for it
      // to be committed to the ledger.
      const results = await contract.evaluateTransaction("readCopyright", id);
      gateway.disconnect();
  
      return JSON.parse(results.toString());
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
