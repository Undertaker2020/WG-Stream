import { Module } from '@nestjs/common';
import { PasswordRecoverService } from './password-recover.service';
import { PasswordRecoverResolver } from './password-recover.resolver';

@Module({
  providers: [PasswordRecoverResolver, PasswordRecoverService],
})
export class PasswordRecoverModule {}
