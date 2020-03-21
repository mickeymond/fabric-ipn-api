import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common';
import * as FabricCAServices from 'fabric-ca-client';
import { FileSystemWallet, X509WalletMixin, Gateway } from 'fabric-network';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

import * as ccp from '../../crypto/connection.json';
import { IUserInput, IUserType } from '../interfaces/user.interface';
import { generateToken } from '../../utils/jwtHelpers';

@Injectable()
export class UsersService {
  private walletPath: string;
  private wallet: FileSystemWallet;
  private gateway: Gateway;

  constructor(
    private readonly configService: ConfigService
  ) {
    this.walletPath = path.resolve(process.cwd(), "dist", "crypto", "wallet");
    // Create a new file system based wallet for managing identities.
    this.wallet = new FileSystemWallet(this.walletPath);
    // Create a new gateway for connecting to our peer node.
    this.gateway = new Gateway();
  }

  async register({ enrollmentId, enrollmentSecret }: IUserInput) {
    // Check to see if we've already enrolled the user.
    const userExists = await this.wallet.exists(enrollmentId);
    if (userExists) {
      throw new ConflictException("An identity for the user " + enrollmentId + " already exists in the wallet");
    }

    // Check to see if we've already enrolled the admin user.
    const adminExists = await this.wallet.exists("admin");
    if (!adminExists) {
      throw new NotFoundException('An identity for the admin user "admin" does not exist in the wallet');
    }

    try {  
      // Connect Gateway to our peer node.
      await this.gateway.connect(ccp, {
        wallet: this.wallet,
        identity: "admin",
        discovery: { enabled: false, asLocalhost: false }
      });
  
      // Get the CA client object from the gateway for interacting with the CA.
      const ca = this.gateway.getClient().getCertificateAuthority();
      const adminIdentity = this.gateway.getCurrentIdentity();
  
      // Register the user and import the new identity into the wallet.
      await ca.register(
        {
          enrollmentID: enrollmentId,
          enrollmentSecret: enrollmentSecret,
          role: "client",
          maxEnrollments: -1,
          affiliation: ''
        },
        adminIdentity
      );
  
      return `Successfully registered user ${enrollmentId}`;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async enroll({ enrollmentId, enrollmentSecret }: IUserInput) {
    try {
      // Create a new CA client for interacting with the CA.
      const caURL = ccp.certificateAuthorities["Org1CA"].url;
      const ca = new FabricCAServices(caURL);
  
      // Check to see if we've already enrolled the admin user.
      const userExists = await this.wallet.exists(enrollmentId);
      if (userExists) {
        return generateToken(enrollmentId, this.configService.get<string>('JWT_SECRET'));
      }
  
      // Enroll the user, and import the new identity into the wallet.
      const enrollment = await ca.enroll({
        enrollmentID: enrollmentId,
        enrollmentSecret: enrollmentSecret
      });
      const identity = X509WalletMixin.createIdentity(
        this.configService.get<string>('MSP_ID'),
        enrollment.certificate,
        enrollment.key.toBytes()
      );
      await this.wallet.import(enrollmentId, identity);
  
      return generateToken(enrollmentId, this.configService.get<string>('JWT_SECRET'));
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async revoke(user: IUserType, enrollmentId: string) {
    // Check If Actor is Admin
    if (user.enrollmentId !== 'admin') {
      throw new UnauthorizedException(`An identity for the user ${user.enrollmentId} is not the admin of the network`);
    }

    // Check to see if we've already enrolled the admin user.
    const userExists = await this.wallet.exists(user.enrollmentId);
    if (!userExists) {
      throw new NotFoundException(`An identity for the user ${user.enrollmentId} does not exist in the wallet`);
    }

    try {  
      // Use admin credentials connect to our peer node.
      await this.gateway.connect(ccp, {
        wallet: this.wallet,
        identity: user.enrollmentId,
        discovery: { enabled: false, asLocalhost: false }
      });
  
      // Get the CA client object from the gateway for interacting with the CA.
      const ca = this.gateway.getClient().getCertificateAuthority();
      const adminIdentity = this.gateway.getCurrentIdentity();
  
      // Revoke User.
      await ca.revoke(
        { enrollmentID: enrollmentId },
        adminIdentity
      );
  
      await this.wallet.delete(enrollmentId);
  
      return `Successfully revoked user ${enrollmentId}`;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}