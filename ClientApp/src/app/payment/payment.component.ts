import { Component } from '@angular/core';
import { faDownload, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../Services/api.service';
import { Router } from '@angular/router';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PayBill } from '../Models/PayBill';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  faDownload = faDownload;
  faPlus = faPlus;
  payments: any[] = [];
  paymentForm!: FormGroup;
  customers: any[] = [];
  bills: any[] = [];
  months: any[] = [];
  paymentTypes:any[] = ["Internet Banking", "Credit/Debit Card", "UPI", "Wallet"];
  isadmin = false;

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.paymentForm = this.fb.group({
      customerId: [''],
      year: [''],
      month: [''],
      paymentType: [''],
      amountPaid: ['']
    })
  }

  ngOnInit() {
    if (!sessionStorage.getItem('emailId'))
      this.router.navigate(['/']);
    if (sessionStorage.getItem('Role') == 'Admin') {
      this.isadmin = true;
      this.getCustomers();
      this.getAllPayments();
    }
    else {
      this.GetPayments();
    }
  }

  getCustomers() {
    this.apiService.GetAllCustomers().subscribe(response => {
      this.customers = response;
    })
  }

  getBills() {
    this.bills = [];
    this.months = [];
    this.paymentForm.get('year')?.setValue('');
    this.paymentForm.get('month')?.setValue('');
    this.paymentForm.get('paymentType')?.setValue('');
    this.paymentForm.get('amountPaid')?.setValue('');
    var customerId = this.paymentForm.get('customerId')?.value;
    var emailId = this.customers.find(c => c.customerId == customerId)?.emailId;
    this.apiService.GetBill(emailId).subscribe(response => {
      console.log(response);
      for(var res in response){
        if(response[res].unpaisAmount != 0){
          this.bills[this.bills.length] = response[res];
        }
      }
    })
  }

  getMonth() {
    console.log(this.bills)
    const month = this.bills.map(b => b.year == this.paymentForm.value.year ? b.month : null).filter((value, index, self) => self.indexOf(value) === index);
    for(var m in month){
      if(month[m] != null){
        this.months[this.months.length] = month[m];
      }
    }
  }

  getAllPayments() {
    this.apiService.GetAllPayments().subscribe(response => {
      this.payments = response;
      this.payments.forEach(payment => {
        payment.status = payment.status ? "Success" : "Fail";
      });
    })
  }

  GetPayments() {
    var emailId = sessionStorage.getItem('emailId');
    if (emailId != null) {
      this.apiService.GetPayments(emailId).subscribe(response => {
        this.payments = response;
        this.payments.forEach(payment => {
          payment.status = payment.status ? "Success" : "Fail";
        });
      })
    }
  }

  download(i: any) {
    const bill = this.payments[i];
    const doc = new jsPDF();
    const text1 = 'Electric Billing Management System';
    const pageWidth1 = doc.internal.pageSize.getWidth();
    const textWidth1 = doc.getTextWidth(text1);
    const x1 = (pageWidth1 - textWidth1) / 2;
    doc.text(text1, x1, 10)

    const text = 'Payment Receipt';
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
        ['Payment ID', ":", bill.paymentID],
        ['Payment Date Time', ':', bill.paymentDateTime],
        ['Customer Name', ":", bill.customerName],
        ['Month', ":", bill.month],
        ['Year', ":", bill.year],
        ['Payment Type', ":", bill.paymentType],
        ['Amount Paid', ":", bill.amount],
        ['Payment Status', ':', bill.status]
      ],
    });

    doc.save(`${bill.customerName}_Payment_Receipt_Payment_ID_${bill.paymentID}.pdf`);
  }

  clearForm() {
    this.paymentForm.reset();
  }

  onSubmit() {
    const paybill:PayBill = {
      EmailID: this.customers.find(c => c.customerId == this.paymentForm.value.customerId)?.emailId,
      Year: this.paymentForm.value.year,
      month: this.paymentForm.value.month,
      PaymentType: this.paymentForm.value.paymentType,
      AmountPaid: this.paymentForm.value.amountPaid
    }
    console.log(paybill)
    this.apiService.PayBill(paybill).subscribe(response => {
      console.log(response);
      if (response) {
        alert("Payment Successfull");
        this.clearForm();
        this.getAllPayments();
      }
      else {
        alert("Payment Failed");
      }
    })
  }
}
