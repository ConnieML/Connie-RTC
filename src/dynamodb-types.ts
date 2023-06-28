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