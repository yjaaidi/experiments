import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, Type } from '@angular/core';
import { By } from '@angular/platform-browser';

export function render<T>(cmpType: Type<T>): T {
  const fixture = (_fixture = TestBed.createComponent(cmpType));
  detectChanges();
  return fixture.componentInstance;
}

export function detectChanges() {
  _assertFixtureExists(detectChanges);
  _fixture.detectChanges();
}

export function getByDataRole(dataRole: string) {
  _assertFixtureExists(getByDataRole);
  return get(`[data-role=${dataRole}]`);
}

export function get(selector: string): DebugElement {
  _assertFixtureExists(get);
  return _fixture.debugElement.query(By.css(selector));
}

export function getAllByDataRole(dataRole: string) {
  _assertFixtureExists(getAllByDataRole);
  return getAll(`[data-role=${dataRole}]`);
}

export function getAll(selector: string): DebugElement[] {
  _assertFixtureExists(get);
  return _fixture.debugElement.queryAll(By.css(selector));
}

function _assertFixtureExists(funk: Function) {
  if (_fixture == null) {
    throw new Error(
      `Component fixture not available. Make sure you call "${render.name}" before calling ${funk.name}`
    );
  }
}

let _fixture: ComponentFixture<unknown>;
