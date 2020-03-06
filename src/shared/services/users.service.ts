import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common';
import * as FabricCAServices from 'fabric-ca-client';
import { FileSystemWallet, X509WalletMixin, Gateway } from 'fabric-network';
import * as path from 'path';

import * as ccp from '../../crypto/connection.json';

@Injectable()
export class UsersService {
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

  async register(user, secret) {
    try {  
      // Check to see if we've already enrolled the user.
      const userExists = await this.wallet.exists(user);
      if (userExists) {
        throw new ConflictException("An identity for the user " + user + " already exists in the wallet");
      }
  
      // Check to see if we've already enrolled the admin user.
      const adminExists = await this.wallet.exists("admin");
      if (!adminExists) {
        throw new NotFoundException('An identity for the admin user "admin" does not exist in the wallet');
      }
  
      // Connect Gateway to our peer node.
      await this.gateway.connect(ccp, {
        wallet: this.wallet,
        identity: "admin",
        discovery: { enabled: true, asLocalhost: true }
      });
  
      // Get the CA client object from the gateway for interacting with the CA.
      const ca = this.gateway.getClient().getCertificateAuthority();
      const adminIdentity = this.gateway.getCurrentIdentity();
  
      // Register the user and import the new identity into the wallet.
      await ca.register(
        {
          enrollmentID: user,
          enrollmentSecret: secret,
          role: "client",
          maxEnrollments: -1,
          affiliation: ''
        },
        adminIdentity
      );
  
      return `Successfully registered user ${user}`;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async enroll(user, secret) {
    try {
      // Create a new CA client for interacting with the CA.
      const caURL = ccp.certificateAuthorities["173.193.99.104:30669"].url;
      const ca = new FabricCAServices(caURL);
  
      // Check to see if we've already enrolled the admin user.
      const userExists = await this.wallet.exists(user);
      if (userExists) {
        throw new ConflictException("An identity for this user already exists in the wallet");
      }
  
      // Enroll the user, and import the new identity into the wallet.
      const enrollment = await ca.enroll({
        enrollmentID: user,
        enrollmentSecret: secret
      });
      const identity = X509WalletMixin.createIdentity(
        "org1msp",
        enrollment.certificate,
        enrollment.key.toBytes()
      );
      await this.wallet.import(user, identity);
  
      return `Successfully enrolled user ${user} and imported it into the wallet`;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async revoke(user) {
    try {  
      // Check to see if we've already enrolled the admin user.
      const adminExists = await this.wallet.exists("admin");
      if (!adminExists) {
        throw new NotFoundException('An identity for the admin user "admin" does not exist in the wallet');
      }
  
      // Use admin credentials connect to our peer node.
      await this.gateway.connect(ccp, {
        wallet: this.wallet,
        identity: "admin",
        discovery: { enabled: true, asLocalhost: true }
      });
  
      // Get the CA client object from the gateway for interacting with the CA.
      const ca = this.gateway.getClient().getCertificateAuthority();
      const adminIdentity = this.gateway.getCurrentIdentity();
  
      // Register the user, enroll the user, and import the new identity into the wallet.
      await ca.revoke(
        {
          enrollmentID: user,
          // enrollmentSecret: secret,
          // maxEnrollments: -1
        },
        adminIdentity
      );
  
      await this.wallet.delete(user);
  
      return `Successfully revoked user ${user}`;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}