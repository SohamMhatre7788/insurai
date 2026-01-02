import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

@Component({
  selector: 'app-corporate-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ai-root">
      <div class="ai-header">
        <h2>InsurAI Assistant</h2>
        <span class="role-badge admin">ADMIN</span>
      </div>

      <div class="ai-body">
        <!-- CHAT PANEL -->
        <div class="chat-panel">
          <div class="chat-window">
            <div *ngFor="let m of messages" class="chat-bubble" [ngClass]="m.sender">
              <p *ngFor="let line of m.text.split('\n')">{{ line }}</p>
            </div>

            <div *ngIf="loading" class="chat-bubble ai typing">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div #chatEndRef></div>
          </div>

          <div class="chat-input">
            <input
              placeholder="Ask about corporate insurance..."
              [(ngModel)]="input"
              (keydown.enter)="askAI()"
              [disabled]="loading"
            />
            <button (click)="askAI()" [disabled]="loading">
              Send
            </button>
          </div>
        </div>

        <!-- SUGGESTION PANEL -->
        <div class="suggestion-panel">
          <h4>Suggested Questions</h4>
          <div
            *ngFor="let q of suggested"
            class="suggestion-card"
            (click)="askAI(q)"
          >
            {{ q }}
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./corporate-ai-assistant.component.scss']
})
export class CorporateAiAssistantComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatEndRef') chatEndRef!: ElementRef;

  messages: Message[] = [];
  input: string = '';
  suggested: string[] = [
    "List all system policies",
    "Show premium vs coverage comparison",
    "Which policies have high risk?",
    "Create a new corporate policy"
  ];
  loading: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit(): void { }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    // Only scroll if there are messages or loading indicator
    if (this.messages.length === 0 && !this.loading) return;

    try {
      this.chatEndRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
    } catch (err) { }
  }

  askAI(question?: string): void {
    const text = question || this.input;
    if (!text.trim()) return;

    if (!this.authService.isAuthenticated()) {
      this.messages.push({ sender: 'ai', text: "Authentication required. Please log in." });
      return;
    }

    this.messages.push({ sender: 'user', text });
    this.input = '';
    this.loading = true;

    // API Call
    const url = `${environment.apiBaseUrl}/ai/admin-recommendation`;

    const token = this.authService.getToken();
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    this.http.post<any>(url, { input: text }, { headers }).subscribe({
      next: (res) => {
        this.messages.push({ sender: 'ai', text: res.response || "No response from AI." });
        this.loading = false;
      },
      error: (err) => {
        console.error("AI ERROR:", err);
        const errorMsg = err.error?.response || err.error?.message || "AI service failed. Please try again.";
        this.messages.push({ sender: 'ai', text: errorMsg });
        this.loading = false;
      }
    });
  }
}
