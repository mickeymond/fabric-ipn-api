import { Injectable } from '@nestjs/common';
import * as FabricCAServices from 'fabric-ca-client';
import { FileSystemWallet, X509WalletMixin } from 'fabric-network';
import * as path from 'path';

import * as ccp from './crypto/connection.json';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService
  ) {
    const walletPath = path.resolve(process.cwd(), "dist", "crypto", "wallet");
    // Create a new CA client for interacting with the CA.
    const caURL = ccp.certificateAuthorities["Org1CA"].url;
    const ca = new FabricCAServices(caURL);

    // Create a new file system based wallet for managing identities.
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the admin user.
    wallet.exists("admin")
      .then(user => {
        if (user) {
          console.log('An identity for "admin" already exists in the wallet');
          return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        ca.enroll({ enrollmentID: "admin", enrollmentSecret: "adminpw" })
          .then(enrollment => {
            const identity = X509WalletMixin.createIdentity(
              this.configService.get<string>('MSP_ID'),
              enrollment.certificate,
              enrollment.key.toBytes()
            );

            wallet.import("admin", identity)
              .then(success => {
                console.log('Successfully enrolled client "admin" and imported it into the wallet');
              });
          })
          .catch(console.log);
      })
      .catch(console.log);
  }
}
