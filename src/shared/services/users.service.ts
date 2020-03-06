import { Injectable } from '@nestjs/common';
import * as FabricCAServices from 'fabric-ca-client';
import { FileSystemWallet, X509WalletMixin } from 'fabric-network';
import * as path from 'path';

import * as ccp from '../../crypto/connection.json';

@Injectable()
export class UsersService {
  constructor() {}
}