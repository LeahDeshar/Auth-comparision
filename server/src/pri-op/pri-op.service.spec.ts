import { Test, TestingModule } from '@nestjs/testing';
import { PriOpService } from './pri-op.service';

describe('PriOpService', () => {
  let service: PriOpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PriOpService],
    }).compile();

    service = module.get<PriOpService>(PriOpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
