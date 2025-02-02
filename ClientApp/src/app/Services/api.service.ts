import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../Models/Login';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from '../Models/Customer';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  Login(login:Login):Observable<any>{
    return this.http.post(environment.apiUrl+"/api/Login/login",login);
  }
  
  // customer calls
  AddCustomer(customer:Customer):Observable<any>{
    return this.http.post(environment.apiUrl+"/api/Customer/AddCustomer",customer);
  }

  GetAllCustomers():Observable<any>{
    return this.http.get(environment.apiUrl+"/api/Customer/GetAllCustomers");
  }

  UpdateCustomer(customer:Customer):Observable<any>{
    return this.http.put(environment.apiUrl+"/api/Customer/UpdateCustomer",customer);
  }

  DeleteCustomer(customerId:any):Observable<any>{
    return this.http.delete(environment.apiUrl+"/api/Customer/DeleteCustomer",{params:{customerId}})
  }

  //bills calls
  AddBill(bill:any):Observable<any>{
    return this.http.post(environment.apiUrl+"/api/Bills/AddBill",bill);
  }

  GetAllBills():Observable<any>{
    return this.http.get(environment.apiUrl+"/api/Bills/GetAllBills");
  }

  UpdateBill(bill:any):Observable<any>{
    return this.http.put(environment.apiUrl+"/api/Bills/UpdateBill",bill);
  }

  GetBill(emailId:string):Observable<any>{
    return this.http.get(environment.apiUrl+"/api/Bills/getBillByID",{params:{emailId:emailId}});
  }

  GenerateBill(billId:any):Observable<any>{
    return this.http.get(environment.apiUrl+"/api/Bills/GenerateBill",{params:{billId:billId}});
  }

  //Payment calls
  PayBill(payment:any):Observable<any>{
    return this.http.post(environment.apiUrl+"/api/Payment/PayBill",payment);
  }

  GetAllPayments():Observable<any>{
    return this.http.get(environment.apiUrl+"/api/Payment/GetAllPayments");
  }

  GetPayments(emailId:string):Observable<any>{
    return this.http.get(environment.apiUrl+"/api/Payment/GetPayment",{params:{emailId}});
  }
}

