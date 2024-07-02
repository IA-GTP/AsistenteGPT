import { environment } from 'environments/environment.development';


export const createThreadUseCase = async ()=>{
  console.log(`${environment.asisstantAPI}/create-thread`)
  try {
    const resp = await fetch(`${environment.asisstantAPI}/create-thread`,{
      method: 'POST',
    });

    const {id} = await resp.json() as {id: string};

    return id;

  } catch (error) {
    throw new Error('Error creating thread ID')
  }
}
