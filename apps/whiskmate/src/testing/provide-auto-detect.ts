import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';

export function provideAutoDetect(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: ComponentFixtureAutoDetect, useValue: true },
  ]);
}
