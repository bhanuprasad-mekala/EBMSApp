import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faEdit, faInfoCircle, faTrash, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Customer } from '../Models/Customer';
import { ApiService } from '../Services/api.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  @Input("close") close!: ElementRef;
  faUser = faUserPlus;
  faEdit = faEdit;
  faTrash = faTrash;
  faInfoCircle = faInfoCircle;
  customerForm!: FormGroup;
  customers: any[] = [];
  selectedCustomer: any;
  isUpdate: boolean = false;

  constructor(private fb: FormBuilder, private apiService: ApiService, private datePipe: DatePipe, private router:Router) { }

  ngOnInit(): void {
    if(!sessionStorage.getItem('emailId'))
      this.router.navigate(['/']);
    this.customerForm = this.fb.group({
      customerID: {value:0,disabled:true},
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      address: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      role: ['Customer', Validators.required], // Default value set to 'Customer'
      password: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]] // Add emailId form control
    });
    this.GetAllCustomers();
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      const customer: Customer = this.customerForm.value;
      console.log(customer);
      // Handle form submission
      this.apiService.AddCustomer(customer).subscribe(response => {
        if (response == "Customer Added Successfully") {
          this.clearForm();
          this.GetAllCustomers();
        }
        alert(response);
        this.close.nativeElement.click();
      })
    }
  }

  clearForm(): void {
    this.customerForm.reset({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      address: '',
      pincode: '',
      role: 'Customer',
      password: '',
      emailId: ''
    });
    this.isUpdate = false;
  }

  GetAllCustomers() {
    this.apiService.GetAllCustomers().subscribe(response => {
      console.log(response);
      this.customers = response;
    })
  }

  showCustomerDetails(i: any) {
    this.selectedCustomer = this.customers[i];
  }


  editCustomer(arg0: any) {
    this.isUpdate = true;
    var customer = this.customers[arg0];
    this.customerForm.patchValue({
      customerID: customer.customerId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      dateOfBirth: this.datePipe.transform(customer.dateOfBirth, "yyyy-MM-dd"),
      address: customer.address,
      pincode: customer.pincode,
      role: customer.role,
      password: customer.password,
      emailId: customer.emailId
    });
  }

  UpdateCustomer() {
    if (this.customerForm.valid) {
      const customer: Customer = this.customerForm.value;
      customer.customerID = this.customerForm.get('customerID')?.getRawValue();
      console.log(customer);
      this.apiService.UpdateCustomer(customer).subscribe(response => {
        if (response == "Customer Details Updated Successfully") {
          this.clearForm();
          this.close.nativeElement.click();
          this.GetAllCustomers();
          this.isUpdate = !this.isUpdate;
        }
        alert(response);
        this.GetAllCustomers();
      })
    }
  }

  deleteCustomer(arg0: any) {
    this.apiService.DeleteCustomer(arg0).subscribe(response =>{
      alert(response);
    })
  }
}
