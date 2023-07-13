// These params can be changed based on what we want our table to look like! Just a base to keep the table inputs standard
export interface PutParams {
    TableName: string;
    Item: {
        org_id: string;
        user_id: string;
    };
};

export interface DeleteParams{
    TableName: string;
    Key: {
        org_id: string;
        user_id: string;
    };
};