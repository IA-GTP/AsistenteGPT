import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessagesBoxComponent, TextMessageBoxFileComponent, TextMessageBoxSelectComponent } from '@components/index';
import { Message } from '@interfaces/messages.interfaces';
import { OpenAIService } from 'app/presentation/services/openAI.service';

@Component({
  selector: 'app-pros-cons-page',
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
  templateUrl: './prosConsPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProsConsPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAIService = inject(OpenAIService);

  handleMessage(propmt : string){

    this.messages.update((prev)=>[
      ...prev,
      {
        isGpt: false,
        text:propmt
      }
    ]);


    this.isLoading.set(true);
    this.openAIService.proConsDiscusser(propmt)
      .subscribe(resp =>{
        this.isLoading.set(false);
        this.messages.update(prev=>[
          ...prev,
          {
            isGpt: true,
            text: resp.content
          }
        ]);
      })
  }
}
