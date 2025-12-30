import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-corporate-ai-assistant',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container" style="padding: 2rem;">
      <h1>Corporate AI Assistant (Admin)</h1>
      <div class="card" style="padding: 2rem; margin-top: 2rem; text-align: center;">
        <p>AI Assistant interface for admins coming soon...</p>
      </div>
    </div>
  `,
    styles: []
})
export class CorporateAiAssistantComponent { }
