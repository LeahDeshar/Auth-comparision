import { Module } from '@nestjs/common';
import { PriOpService } from './pri-op.service';

@Module({
  providers: [PriOpService],
  exports: [PriOpService],
})
export class PriOpModule {}
