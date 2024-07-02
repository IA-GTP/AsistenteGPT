import type { ProConsResponse } from "@interfaces/pro-cons.interface";
import { environment } from "environments/environment.development";

export const proConsUseCase = async (prompt: string)=>{
  try {

    const resp = await fetch(`${environment.backendAPI}/pros-cons-discusser`,{
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({prompt})
    });

    if(!resp.ok) throw new Error('No se pudo realizar la comparación.');
    const data = await resp.json() as ProConsResponse;

    return{
      ok: true,
      ...data,
    }

  } catch (error) {
    console.log(error);
    return{
      ok: false,
      role: '',
      content: 'No se puedo realizar la comparación...'
    }
  }
}
