import { Injectable } from '@angular/core';
import { Observable, from, of, tap } from 'rxjs';
import { PostQuestionUseCase, audioToTextUseCase, createThreadUseCase, imageGenerationUseCase, imageVariationUseCase, ortographyUseCase, proConsUseCase, prosConsStreamUseCase, textToAudioUseCase, translateTextUseCase  } from 'app/core';

@Injectable({providedIn: 'root'})
export class OpenAIService {

  checkOrthography(prompt: string){
    return from( ortographyUseCase(prompt))
  }

  proConsDiscusser(promt: string){
    return from(proConsUseCase(promt))
  }

  proConsStreamDiscusser(promt: string, abortSignal: AbortSignal){
    return prosConsStreamUseCase(promt, abortSignal);
  }

  translateText(prompt: string, lang: string){
    return from( translateTextUseCase(prompt, lang));
  }

  textToAudio(prompt: string, voice: string){
    return from( textToAudioUseCase(prompt, voice));
  }

  audioToText(file: File ,prompt: string){
    return from( audioToTextUseCase(file,prompt));
  }

  imageGeneration(prompt: string, originalImage?: string, maskImage? : string){
    return from( imageGenerationUseCase(prompt, originalImage, maskImage));
  }

  imageVariation(originalName: string){
    return from (imageVariationUseCase(originalName))
  }

  // LLamados al asistente
  createThread(): Observable<string>{
    if (localStorage.getItem('thread')) {
      return of (localStorage.getItem('thread')!);
    }

    return from (createThreadUseCase())
      .pipe(
        tap((thread)=>{
          localStorage.setItem('thread', thread)
        })
      );
  }

  postQuestion(threadId: string, question: string){
    return from (PostQuestionUseCase(threadId, question));
  }
}
