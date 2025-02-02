import { Component, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faDownload, faEdit, faMoneyBill, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../Services/api.service';
import { PayBill } from '../Models/PayBill';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css']
})
export class BillsComponent {
  @Input("close") close!: ElementRef;
  customers: any[] = [];
  months: string[] = [];
  monthsList: any[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  isAdmin: boolean = false
  bills: any[] = [];
  paymentTypes: any[] = ["Credit/Debit Card", "Net Banking", "UPI", "Cash"];
  billForm!: FormGroup;
  paymentForm!: FormGroup;
  faPlus = faPlus;
  faEdit = faEdit;
  faTrash = faTrash;
  faDownload = faDownload;
  faMoneyBill = faMoneyBill;
  isUpdate: boolean = false;
  years: any;

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.billForm = this.fb.group({
      BillID: { value: 0, disabled: true },
      CustomerID: { value: 0, disabled: false },
      Month: { value: '', disabled: false },
      Year: { value: 0, disabled: false },
      NoOfUnits: { value: 0, disabled: false },
      TotalAmount: { value: 0, disabled: true },
      UnpaidAmount: { value: 0, disabled: true }
    });
    this.paymentForm = this.fb.group({
      BillID: { value: 0, disabled: true },
      paymentType: { value: '', disabled: false },
      AmountPaid: { value: 0, disabled: false }
    })
  }

  ngOnInit() {
    if(!sessionStorage.getItem('emailId'))
      this.router.navigate(['/']);
    
    this.getCustomerNames();
    this.isAdmin = sessionStorage.getItem('Role') == 'Admin';
    if (this.isAdmin) {
      this.GetAllBills();
      this.loadYears();
    }
    else {
      this.GetBillsByID();
    }
  }

  getCustomerNames() {
    this.apiService.GetAllCustomers().subscribe((data: any) => {
      this.customers = data;
    })
  }

  loadYears() {
    this.years = Array.from(new Array(5), (val, index) => new Date().getFullYear() - index);
  }

  loadMonths() {
    const year = new Date().getFullYear();
    if (this.billForm.value.Year == year) {
      this.months = this.monthsList.slice(0, new Date().getMonth() + 1);
    }
    else {
      this.months = this.monthsList;
    }
  }

  CalculateBill() {
    const noOfUnits = this.billForm.value.NoOfUnits;
    if (noOfUnits > 100 && noOfUnits <= 400) {
      this.billForm.patchValue({
        TotalAmount: noOfUnits * 4.5
      });
    }
    else if (noOfUnits > 400 && noOfUnits <= 500) {
      this.billForm.patchValue({
        TotalAmount: noOfUnits * 6
      });
    }
    else if (noOfUnits > 500 && noOfUnits <= 600) {
      this.billForm.patchValue({
        TotalAmount: noOfUnits * 8
      });
    }
    else if (noOfUnits > 600 && noOfUnits <= 800) {
      this.billForm.patchValue({
        TotalAmount: noOfUnits * 9
      });
    } else if (noOfUnits > 800 && noOfUnits <= 1000) {
      this.billForm.patchValue({
        TotalAmount: noOfUnits * 10
      });
    }
    else if (noOfUnits > 1000) {
      this.billForm.patchValue({
        TotalAmount: noOfUnits * 11
      });
    }
  }

  GetAllBills() {
    this.apiService.GetAllBills().subscribe(response => {
      this.bills = response;
    })
  }

  onSubmit(): void {
    if (this.billForm.valid) {
      // Handle form submission
      var bill = this.billForm.getRawValue();
      console.log(bill);
      this.apiService.AddBill(bill).subscribe(response => {
        if (response == "Bill Added Successfully") {
          this.clearForm();
          this.GetAllBills();
        }
        alert(response);
        this.close.nativeElement.click();
      })
    }
  }
  UpdateCustomer() {
    if (this.billForm.valid) {
      // Handle form submission
      var bill = this.billForm.getRawValue();
      console.log(bill);
      this.apiService.UpdateBill(bill).subscribe(response => {
        if (response == "Bill Updated Successfully") {
          this.clearForm();
          this.GetAllBills();
        }
        alert(response);
        this.close.nativeElement.click();
      })
    }
  }
  clearForm() {
    this.billForm.reset({
      NoOfUnits: 0,
      TotalAmount: 0,
      UnpaidAmount: 0
    });
  }
  editCustomer(i: any) {
    if (this.isAdmin) {
      var bill = this.bills[i];
      this.billForm.patchValue({
        Year: bill.year
      })
      this.loadMonths();
      this.billForm.patchValue({
        BillID: bill.billId,
        CustomerID: bill.customerId,
        Month: bill.Month,
        Year: bill.year,
        NoOfUnits: bill.noOfUnits,
        TotalAmount: bill.totalAmount,
        UnpaidAmount: bill.unpaidAmount
      });
      this.billForm.get('Month')?.setValue(bill.month);
      this.isUpdate = true;
      this.billForm.get('CustomerID')?.disable();
      this.billForm.get('Year')?.disable();
      this.billForm.get('Month')?.disable();
    }
    else {
      var bill = this.bills[i];
      this.paymentForm.patchValue({
        BillID: bill.billId
      });
    }
  }
  deleteCustomer(i: any) {

  }

  GetBillsByID() {
    var emailId = sessionStorage.getItem('emailId');
    if (emailId != null) {
      this.apiService.GetBill(emailId).subscribe(response => {
        this.bills = response;
      })
    }
  }

  PayBill() {
    const payBill: PayBill = {
      EmailID: sessionStorage.getItem('emailId')!,
      Year: this.bills.find(x => x.billId == this.paymentForm.getRawValue().BillID)?.year,
      month: this.bills.find(x => x.billId == this.paymentForm.getRawValue().BillID)?.month,
      PaymentType: this.paymentForm.value.paymentType,
      AmountPaid: this.paymentForm.value.AmountPaid
    }
    this.apiService.PayBill(payBill).subscribe(response => {
      alert(response);
      var ele = this.close.nativeElement;
      ele.click();
      this.GetBillsByID();
    })
  }

  Download(i: any) {
    const bill = this.bills[i];
    const customer = this.customers.find(x => x.customerId == bill.customerId);
    const doc = new jsPDF();
    const text1 = 'Electric Billing Management System';
    const pageWidth1 = doc.internal.pageSize.getWidth();
    const textWidth1 = doc.getTextWidth(text1);
    const x1 = (pageWidth1 - textWidth1) / 2;
    doc.text(text1,x1,10)
    
    const text = 'Bill Receipt';
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(text);
    const x = (pageWidth - textWidth) / 2;

    doc.text(text, x, 20);

    autoTable(doc, {
      startY: 30,
      tableWidth: 'wrap', // Restrict table width to content width
      columnStyles: {
        0: { cellWidth: 'wrap' }, // Set width for the first column
        1: { cellWidth: 'wrap' } // Set width for the second column
      },
      // head: [['Field', 'Value']],
      body: [
        ['Bill ID', ":", bill.billId],
        ['Customer Name', ":", customer.firstName+", "+customer.lastName],
        ['Month', ":", bill.month],
        ['Year', ":", bill.year],
        ['No of Units', ":", bill.noOfUnits],
        ['Total Amount', ":", bill.totalAmount]
      ],
    });

    doc.save(`${customer.firstName+", "+customer.lastName}_Bill_Receipt_${bill.month}-${bill.year}.pdf`);
  }
}
