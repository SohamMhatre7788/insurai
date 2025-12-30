import { Component } from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <button
      aria-label="Toggle theme"
      [title]="(darkMode$ | async) ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      (click)="toggleTheme()"
      class="theme-toggle"
    >
      {{ (darkMode$ | async) ? '🌙' : '🌞' }}
      <span class="theme-name-tooltip">
        {{ (darkMode$ | async) ? 'Dark Mode' : 'Light Mode' }}
      </span>
    </button>
  `,
  styles: [`
    .theme-toggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: var(--radius-full, 9999px);
      border: 1px solid var(--border-color);
      background: transparent;
      color: var(--text-inverse);
      transition: none;
      position: relative;
      cursor: pointer;
      
      &:hover {
        transform: none;
        background: transparent;
        box-shadow: none;
      }
    }

    .theme-name-tooltip {
      position: absolute;
      bottom: -35px;
      left: 50%;
      transform: translateX(-50%) translateY(-5px);
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: none;
      pointer-events: none;
      z-index: 1001;
    }

    .dark-mode .theme-name-tooltip {
      background: rgba(255, 255, 255, 0.9);
      color: #000;
    }
  `]
})
export class ThemeToggleComponent {
  darkMode$: Observable<boolean>;

  constructor(private themeService: ThemeService) {
    this.darkMode$ = this.themeService.darkMode$;
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }
}
