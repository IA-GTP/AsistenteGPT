import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatMessageComponent, GptMessagesOrthographyComponent, MyMessageComponent, TextMessageBoxEvent, TextMessageBoxFileComponent, TextMessageBoxSelectComponent, TextMessageEvent, TextMessagesBoxComponent, TypingLoaderComponent } from '@components/index';
import { Message } from '@interfaces/messages.interfaces';
import { OpenAIService } from 'app/presentation/services/openAI.service';
// import { ChatMessageComponent } from '@components/chat-bubbles/chatMessage/chatMessage.component';
// import { MyMessageComponent } from '@components/chat-bubbles/myMessage/myMessage.component';
// import { ChatMessageComponent } from '../../components/chat-bubbles/chatMessage/chatMessage.component';
// import { MyMessageComponent } from '../../components/chat-bubbles/myMessage/myMessage.component';

@Component({
  selector: 'app-ortography-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    GptMessagesOrthographyComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessagesBoxComponent,
    TextMessageBoxFileComponent,
    TextMessageBoxSelectComponent
  ],
  templateUrl: './ortographyPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrtographyPageComponent {

  public messages = signal<Message[]>([{text: 'Hola mundo', isGpt: false}]);
  public isLoading = signal(false);
  public openAIService = inject(OpenAIService);

  handleMessage(propmt : string){
    this.isLoading.set(true);
    this.messages.update((prev)=>[
      ...prev,
      {
        isGpt: false,
        text: propmt
      }
    ]);

    this.openAIService.checkOrthography(propmt).subscribe(resp =>{
      this.isLoading.set(false);
      console.log(resp)
      this.messages.update(prev =>[
        ...prev,
        {
          isGpt: true,
          text: resp.message,
          info: resp,
        }
      ])
    })

  }

}
