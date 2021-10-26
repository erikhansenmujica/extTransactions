import { Test, TestingModule } from '@nestjs/testing';
import { IHelper } from './helper.service';

describe('IHelper', () => {
  let service: IHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IHelper],
    }).compile();

    service = module.get<IHelper>(IHelper);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should have getConfigValue getter', () => {
    expect(service.getConfigValue).toBeDefined();
  });
  it('should have getParameter getter', () => {
    expect(service.getParameter).toBeDefined();
  });
  it('should have getProtecterdValue getter', () => {
    expect(service.getProtectedValue).toBeDefined();
  });
});
