import {NgModule} from '@angular/core';
import {UserIdleConfig} from './models/user-idle-config.model';

@NgModule()
export class UserIdleModule {
  static forRoot(config: UserIdleConfig) {
    return {
      ngModule: UserIdleModule,
      providers: [
        { provide: UserIdleConfig, useValue: config }
      ]
    };
  }
}
