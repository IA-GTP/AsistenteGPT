import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-gpt-messages-orthography',
  standalone: true,
  imports: [

  ],
  templateUrl: './gptMessagesOrthography.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GptMessagesOrthographyComponent {

  @Input({ required:true }) userScore!: number;
  @Input({ required:true }) text!: string;
  @Input() errors: string[] = [];
}
