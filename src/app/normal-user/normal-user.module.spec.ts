import { NormalUserModule } from './normal-user.module';

describe('NormalUserModule', () => {
  let normalUserModule: NormalUserModule;

  beforeEach(() => {
    normalUserModule = new NormalUserModule();
  });

  it('should create an instance', () => {
    expect(normalUserModule).toBeTruthy();
  });
});
