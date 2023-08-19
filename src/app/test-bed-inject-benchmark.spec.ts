import { TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Service {}

test('bench', () => {
  const results = [
    measure({
      fn: () => new Service(),
      name: 'new Service()',
    }),
    measure({
      fn: () => new Service(),
      name: 'new Service()',
    }),
    measure({
      fn: () => TestBed.inject(Service),
      name: 'TestBed.inject(Service)',
    }),
    measure({
      fn: () => TestBed.inject(Service),
      name: 'TestBed.inject(Service)',
    }),
    measure({
      iterations: 1_000_000,
      fn: () => new Service(),
      name: 'new Service()',
    }),
    measure({
      iterations: 1_000_000,
      fn: () => TestBed.inject(Service),
      name: 'TestBed.inject(Service)',
    }),
  ];

  console.log(results.join('\n'));
});

function measure({
  fn,
  iterations = 1,
  name,
}: {
  fn: () => void;
  name: string;
  iterations?: number;
}) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }

  const duration = ((performance.now() - start) * 1_000) / iterations;
  const roundDuration = Math.round(1000 * duration) / 1000;
  return `${iterations} x ${name}: ${roundDuration}µs / run`;
}
