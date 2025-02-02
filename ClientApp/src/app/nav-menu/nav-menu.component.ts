import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
  isAdmin: boolean = false;
  isLogged: boolean = false;

  ngOnInit(){
    this.isAdmin = sessionStorage.getItem('Role') == 'Admin';
    this.isLogged = sessionStorage.getItem('emailId') != null;
  }

  logout(){
    this.isAdmin = false;
    this.isLogged = false;
    sessionStorage.removeItem('emailId');
    window.location.href = '/';
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
