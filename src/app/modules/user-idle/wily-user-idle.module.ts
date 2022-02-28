import {ModuleWithProviders, NgModule} from '@angular/core';
import {UserIdleConfig} from './models/user-idle-config.model';

@NgModule({
  imports: []
})
export class WilyUserIdleModule {
  static forRoot(config: UserIdleConfig): ModuleWithProviders<WilyUserIdleModule> {
    return {
      ngModule: WilyUserIdleModule,
      providers: [
        { provide: UserIdleConfig, useValue: config }
      ]
    };
  }
}
