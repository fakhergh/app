import { Test, TestingModule } from '@nestjs/testing';

import { ServiceProviderResolver } from '@/modules/service-provider/service-provider.resolver';

describe('ServiceProviderController', () => {
  let controller: ServiceProviderResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceProviderResolver],
    }).compile();

    controller = module.get<ServiceProviderResolver>(ServiceProviderResolver);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
