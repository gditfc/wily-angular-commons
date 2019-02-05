import { ThemingModule } from './theming.module';

describe('ThemingModule', () => {
  let themingModule: ThemingModule;

  beforeEach(() => {
    themingModule = new ThemingModule();
  });

  it('should create an instance', () => {
    expect(themingModule).toBeTruthy();
  });
});
