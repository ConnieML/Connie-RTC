import { DeleteParams, PutParams } from './dynamodb-types'

export const putData = async (url:string, newEntry:PutParams) => {
  const body = JSON.stringify(newEntry)
  console.log('body', body);
  const req = new Request (url, {body: body, method: 'POST'}); 
  try{
    const response = await fetch(req).catch(e=>{console.warn(e); return null;});;
    if (response){
      console.log(response);
    }
  }
  catch (error) {
      console.error('Error in putData: ', error);
  }
};

//This is working now, but change it so that you send the item id in the url and make the method be delete
export const deleteData = async (url:string, delEntry:DeleteParams) => {
  const body = JSON.stringify(delEntry)
  const req = new Request (url, {body: body, method: 'POST'}); 
  try{
    const response = await fetch(req).catch(e=>{console.warn(e); return null;});;
    if (response){
      console.log(response);
    }
  }
  catch (error) {
      console.error('Error in deleteData: ', error);
  }
};
