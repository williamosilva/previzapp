import { Module } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [TranslationService],
  exports: [TranslationService],
})
export class TranslationModule {}
