import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  ChatMessageComponent,
  MyMessageComponent,
  TypingLoaderComponent,
  TextMessagesBoxComponent,
  TextMessageBoxFileComponent,
  TextMessageBoxSelectComponent,
  TextMessageEvent,
  TextMessageBoxEvent,
} from '@components/index';
import { Message } from '@interfaces/messages.interfaces';
import { OpenAIService } from 'app/presentation/services/openAI.service';

@Component({
  selector: 'app-asistent-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessagesBoxComponent,
    TextMessageBoxFileComponent,
    TextMessageBoxSelectComponent,
  ],
  templateUrl: './asistentPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AsistentPageComponent implements OnInit {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAIService = inject(OpenAIService);
  public threadId = signal<string | undefined>(undefined);

  ngOnInit(): void {
    this.openAIService.createThread().subscribe((ID) => {
      this.threadId.set(ID);
    });
  }

  handleMessage(question: string) {
    this.isLoading.set(true);
    this.messages.update((prev) => [...prev, { text: question, isGpt: false }]);

    this.openAIService
      .postQuestion(this.threadId()!, question)
      .subscribe((replies) => {
        this.isLoading.set(false);

        // Crear un conjunto con los textos de los mensajes actuales para evitar duplicados
        const currentMessages = new Set(this.messages().map((msg) => msg.text));

        for (const reply of replies) {
          for (const message of reply.content) {
            if (!currentMessages.has(message)) {
              this.messages.update((prev) => [
                ...prev,
                {
                  text: message,
                  isGpt: reply.role === 'assistant',
                },
              ]);
            }
          }
        }
      });
  }
}
