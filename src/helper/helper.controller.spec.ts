import { Test, TestingModule } from '@nestjs/testing';
import { ConfigHelper } from './helper.controller';
import { IHelper } from './helper.service';

describe('ConfigHelper', () => {
  let controller: ConfigHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfigHelper],
      providers: [IHelper],
    }).compile();

    controller = module.get<ConfigHelper>(ConfigHelper);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('getDatabaseHost should be defined', () => {
    expect(controller.getDatabaseHost).toBeDefined();
    expect(typeof controller.getDatabaseHost()).toBe('string');
  });
  it('getDatabaseName should be defined', () => {
    expect(controller.getDatabaseName).toBeDefined();
    expect(typeof controller.getDatabaseName()).toBe('string');
  });
  it('getDatabasePassword should be defined', () => {
    expect(controller.getDatabasePassword).toBeDefined();
    expect(typeof controller.getDatabasePassword()).toBe('string');
  });
  it('getDatabasePort should be defined', () => {
    expect(controller.getDatabasePort).toBeDefined();
    expect(typeof controller.getDatabasePort()).toBe('string');
  });
  it('getDatabaseUser should be defined', () => {
    expect(controller.getDatabaseUser).toBeDefined();
    expect(typeof controller.getDatabaseUser()).toBe('string');
  });
});
