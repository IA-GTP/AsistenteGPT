import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessagesBoxComponent, TextMessageBoxFileComponent, TextMessageBoxSelectComponent } from '@components/index';
import { Message } from '@interfaces/messages.interfaces';
import { OpenAIService } from 'app/presentation/services/openAI.service';

@Component({
  selector: 'app-pros-cons-stream-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessagesBoxComponent,
    TextMessageBoxFileComponent,
    TextMessageBoxSelectComponent
  ],
  templateUrl: './prosConsStreamPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProsConsStreamPageComponent {

  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAIService = inject(OpenAIService);

  public abortSignal = new AbortController();

  async handleMessage(propmt : string){

    this.abortSignal.abort();
    this.abortSignal = new AbortController();

    this.messages.update(prev =>[
      ...prev,
      {
        isGpt: false,
        text: propmt
      },
      {
        isGpt: true,
        text: '...'
      }
    ])

    this.isLoading.set(true);
    const stream = this.openAIService.proConsStreamDiscusser(propmt, this.abortSignal.signal);
    this.isLoading.set(false);

    for await (const text of stream){
      this.handleStreamResponse(text)
    }
  }

  handleStreamResponse(message: string){
    this.messages().pop();
    const messages = this.messages();
    this.messages.set([...messages, {isGpt: true, text:message}]);
  }

 }
