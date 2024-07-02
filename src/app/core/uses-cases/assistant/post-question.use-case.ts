import { QuestionResponse } from "@interfaces/question-response";
import { environment } from 'environments/environment.development';


export const PostQuestionUseCase = async (threadId: string, question: string)=>{
  console.log({threadID:threadId, question:question})
  try {
    console.log(`${environment.asisstantAPI}/user-question`)
    const resp = await fetch(`${environment.asisstantAPI}/user-question`,{
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({ threadId, question})
    });

      const replies = await resp.json() as QuestionResponse[];
      console.log(replies);
      return replies;

  } catch (error) {
    throw new Error('Error creating thread ID.')
  }
}
