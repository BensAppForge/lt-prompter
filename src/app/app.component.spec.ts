import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    // Pin the theme so the test does not depend on the OS colour scheme
    localStorage.setItem(
      'lt-prompter-settings',
      JSON.stringify({ themePreference: 'light' })
    );

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideServiceWorker('ngsw-worker.js', { enabled: false }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('lt-prompter-settings');
    document.body.classList.remove('dark-theme');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.app-title')?.textContent).toContain('LANGUAGE TEACHER - PROMPTER');
  });

  it('should toggle theme', () => {
    expect(component.isDarkMode()).toBeFalse();
    component.toggleTheme();
    fixture.detectChanges();
    expect(component.isDarkMode()).toBeTrue();
    expect(document.body.classList.contains('dark-theme')).toBeTrue();
  });
});
