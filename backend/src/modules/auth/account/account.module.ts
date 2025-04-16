import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';
import {VerificationService} from "@/src/modules/auth/verification/verification.service";

@Module({
  providers: [AccountResolver, AccountService, VerificationService],
})
export class AccountModule {}
