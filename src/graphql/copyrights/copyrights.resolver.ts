import { Resolver, Query } from '@nestjs/graphql';

import { CopyrightsService } from '../../shared/services/copyrights.service';
import { CopyrightType } from './dto/copyrights.dto';

@Resolver('Copyrights')
export class CopyrightsResolver {
  constructor(
    private readonly copyrightsService: CopyrightsService
  ) {}

  @Query(() => [CopyrightType])
  copyrights(): any {
    return this.copyrightsService.readCopyrights();
  }
}
