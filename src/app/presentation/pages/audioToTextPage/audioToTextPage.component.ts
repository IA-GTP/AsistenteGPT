import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessagesBoxComponent, TextMessageBoxFileComponent, TextMessageBoxSelectComponent, TextMessageEvent } from '@components/index';
import { AudioToTextResponse } from '@interfaces/audio-text-response';
import { Message } from '@interfaces/messages.interfaces';
import { OpenAIService } from 'app/presentation/services/openAI.service';

@Component({
  selector: 'app-audio-to-text-page',
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
  templateUrl: './audioToTextPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AudioToTextPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAIService = inject(OpenAIService);

  handleMessagewithEventFile({prompt, file}: TextMessageEvent){

    const text = prompt ?? file.name ?? 'Generando el texto...';
    this.isLoading.set(true);

    this.messages.update( prev => [...prev, {isGpt: false, text: text}]);

    this.openAIService.audioToText(file, text)
      .subscribe( resp => this.handleResponse(resp));
  }

  handleResponse(resp: AudioToTextResponse | null){
    this.isLoading.set(false);
    if( !resp) return;

    // const text = `## Transcripción:
    // __Duración:__ ${Math.round(resp.duration)} segundos.

    // ## El texto es:
    // ${resp.text}
    // `;

    const text = `
## Transcripción:
__Duración:__ ${Math.round(resp.duration)} segundos.

## El texto es:
${resp.text}
`;

    this.messages.update(prev => [...prev, {isGpt: true, text: text}]);

    for(const segment of resp.segments){
      const segmentMessage = `
      __De ${Math.round(segment.start)} a ${Math.round(segment.end)} segundos.__
      ${segment.text}
      `;

      this.messages.update(prev => [...prev, {isGpt: true, text: segmentMessage}]);

    }
  }
}
