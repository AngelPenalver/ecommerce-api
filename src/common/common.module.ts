import { Global, Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';

@Global()
@Module({
  providers: [HashingService],
  exports: [HashingService]
})
export class CommonModule { }
