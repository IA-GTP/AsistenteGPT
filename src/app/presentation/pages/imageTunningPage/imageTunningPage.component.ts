import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessagesBoxComponent, TextMessageBoxFileComponent, TextMessageBoxSelectComponent, GptMessageEditableImageComponent } from '@components/index';
import { Message } from '@interfaces/messages.interfaces';
import { OpenAIService } from 'app/presentation/services/openAI.service';

@Component({
  selector: 'app-image-tunning-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessagesBoxComponent,
    TextMessageBoxFileComponent,
    TextMessageBoxSelectComponent,
    GptMessageEditableImageComponent
  ],
  templateUrl: './imageTunningPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageTunningPageComponent {

  public messages = signal<Message[]>([
    // {
    //   isGpt: true,
    //   text : 'Peruavian anime',
    //   imageInfo: {
    //     alt: 'Dummy image',
    //     url: 'http://localhost:3000/gpt/image-generation/1714410895134.png'
    //   }
    // }
  ]);
  public isLoading = signal(false);
  public openAIService = inject(OpenAIService);

  public originalImage = signal<string|undefined>(undefined);
  public maskImage = signal<string|undefined>(undefined);

  handleMessage(propmt : string){
    this.isLoading.set(true);
    this.messages.update(prev => [...prev, {isGpt: false, text: propmt}]);

    this.openAIService.imageGeneration(propmt, this.originalImage(), this.maskImage())
      .subscribe(resp =>{
        this.isLoading.set(false);
        if(!resp) return;

        this.messages.update(prev =>[
          ...prev,
          {
            isGpt: true,
            text: resp.alt,
            imageInfo: resp,
          }
        ]);
      })
  }

  handleImageChange(newImage: string, originalImage?: string){
    this.originalImage.set(originalImage);
    //TODO: mask
    this.maskImage.set(newImage);

    console.log({newImage, originalImage})
  }

  generateVariation(){
    if(!this.originalImage()) return;

    this.isLoading.set(true);
    this.openAIService.imageVariation(this.originalImage()!)
      .subscribe(resp => {
        this.isLoading.set(false);
        if(!resp) return;

        this.messages.update(prev => [
          ...prev,
          {
            isGpt: true,
            text: resp.alt,
            imageInfo: resp
          }
        ]);

      })
  }

}


