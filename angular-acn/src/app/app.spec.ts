import { type WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show valid message for a known-good ACN', async () => {
    const fixture = TestBed.createComponent(App);
    const digits = (fixture.componentInstance as unknown as { digits: WritableSignal<string> }).digits;
    digits.set('004085616');
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Valid ACN');
    expect(el.textContent).toContain('004 085 616');
  });

  it('should show invalid message for wrong check digit', async () => {
    const fixture = TestBed.createComponent(App);
    const digits = (fixture.componentInstance as unknown as { digits: WritableSignal<string> }).digits;
    digits.set('004085617');
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('not a valid ACN');
  });
});
