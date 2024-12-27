import { Test, TestingModule } from '@nestjs/testing';

import { CustomerResolver } from './customer.resolver';

describe('UsersController', () => {
  let controller: CustomerResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerResolver],
    }).compile();

    controller = module.get<CustomerResolver>(CustomerResolver);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
