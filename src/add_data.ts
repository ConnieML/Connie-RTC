//These params are just to keep things standard, should be changed 
//when we decide on a table format and decide what entries are required/optional
import { DeleteParams, PutParams } from './dynamodb-types'

//These functions are working now, but they should eventually be changed a bit
//The deleteData function should pass the id's of the thing to be deleted in the url
//deleteData function method should also be DELETE
//Then, there is potential to combine put and delete so that we only have one api endpoint

export const putData = async (newEntry:PutParams) => {
  const body = JSON.stringify(newEntry)
  console.log('body', body);
  const req = new Request ('api/dynamoCreate', {body: body, method: 'POST'}); 
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

export const deleteData = async (delEntry:DeleteParams) => {
  const body = JSON.stringify(delEntry)
  const req = new Request ('api/dynamoDelete', {body: body, method: 'POST'}); 
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
