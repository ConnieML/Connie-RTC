import { putData, deleteData } from '../add_data'

export default function dynamo_demo() {
  
  async function handleAddEntry () {
    putData({TableName: 'starter_db', Item: {
        org_id: 'test_org',
        user_id: 'test_user'
      }})
  };
  
  async function handleDeleteEntry () {
    deleteData({TableName: 'starter_db', Key: {
        org_id: 'test_org',
        user_id: 'test_user'
      }})
  };

  return (<main>
    <div>
        <p>This will add to our dynamo table called starter_db. The table has 
            space for org_id (primary key) and user_id. The add entry button will put
            in an entry test_org:test_user. The delete entry button will delete it. 
            These functions can be modified and used wherever we end up needing them!</p>
        </div>
    
    <div>
        <button onClick={handleAddEntry}>Add entry!</button>
    </div>
    <div>
        <button onClick={handleDeleteEntry}>Delete entry!</button>
    </div>
  </main>)
    
}
