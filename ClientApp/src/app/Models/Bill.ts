export interface Bill{
    BillID:number;
    CustomerID: number;
    Month:string;
    Year:number;
    NoOfUnits:number;
    TotalAmount:number;
    UnpaidAmount:number;
}