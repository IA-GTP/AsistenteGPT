import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessagesBoxComponent, TextMessageBoxFileComponent, TextMessageBoxSelectComponent, TextMessageEvent, TextMessageBoxEvent } from '@components/index';
import { Message } from '@interfaces/messages.interfaces';
import { OpenAIService } from 'app/presentation/services/openAI.service';

@Component({
  selector: 'app-text-to-audio-page',
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
  templateUrl: './textToAudioPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TextToAudioPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAIService = inject(OpenAIService);

  public voices = signal([
    { id: "nova", text: "Nova" },
    { id: "alloy", text: "Alloy" },
    { id: "echo", text: "Echo" },
    { id: "fable", text: "Fable" },
    { id: "onyx", text: "Onyx" },
    { id: "shimmer", text: "Shimmer" },
  ]);

  handleMessagewithSelect({ prompt, selectedOption}: TextMessageBoxEvent){
    const message = `${selectedOption} - ${prompt}`;

    this.messages.update( prev => [...prev, {text: message, isGpt: false}]);
    this.isLoading.set(true);

    this.openAIService.textToAudio(prompt, selectedOption)
      .subscribe( ({message,audioURL}) =>
      {
        this.isLoading.set(false);
        this.messages.update(prev =>[
          ...prev,{
            isGpt: true,
            text: message,
            audioUrl: audioURL,
          }
        ])
      }
    )

  }

}
