import { Component, OnInit, OnDestroy, ViewChild, trigger, state, style, animate, transition } from '@angular/core';
import { SupplierService } from './supplier.service';
import * as _ from 'underscore';
import { PagerService } from '../services/pagination-service';
import { MODAL_DIRECTIVES, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Router } from '@angular/router';
import {SlimLoadingBarService, SlimLoadingBarComponent} from 'ng2-slim-loading-bar';
import { NotificationService } from '../services/notification/notification.service';
import { AuthService } from '../login/auth.service';

@Component({
    selector: 'supplier-list',
    template: require('./supplier-list.component.html'),
    animations: [
        trigger('flyInOut', [
            state('in', style({ opacity: 1, transform: 'translateX(0)' })),
            transition('void => *', [
                style({
                    opacity: 0,
                    transform: 'translateX(-100%)'
                }),
                animate('0.6s ease-in')
            ]),
            transition('* => void', [
                animate('0.2s 10 ease-out', style({
                    opacity: 0,
                    transform: 'translateX(100%)'
                }))
            ])
        ])
    ]
})

export class SupplierListComponent implements OnInit, OnDestroy{

    private suppliers;

    private suppLoadError;

    pager: any = {};// pager object
 
    pagedItems: any[];// paged items

    private actionValue:any[] =[];

    private selectedSupplierId;

    @ViewChild('modal1') modal1: ModalComponent;

    @ViewChild('modal2') modal2: ModalComponent;

    animation: boolean = true;

    keyboard: boolean = true;

    backdrop: string | boolean = true;

    constructor(
                private suppService: SupplierService, 
                private pagerService: PagerService, 
                private router: Router,
                private slimLoadingBarService:SlimLoadingBarService,
                private notificationService: NotificationService,
                private authService: AuthService){}

    ngOnInit(){
        this.getSuppliers();
    }

    setPage(page: number) {

        if (page < 1 || page > this.pager.totalPages) return;
 
        this.pager = this.pagerService.getPager(this.suppliers.length, page, 5);//get pager object from service
 
        this.pagedItems = this.suppliers.slice(this.pager.startIndex, this.pager.endIndex + 1);//get current page of items

    }

    getSuppliers(){
        this.slimLoadingBarService.start();
        this.suppService.getSuppliers()
                                .subscribe( 
                                                result => this.suppliers = result.suppliers,
                                                error => {
                                                    if(error==='token_error') {
                                                        this.authService.cleanup();
                                                        this.router.navigate(['/login']);
                                                    }else{
                                                        this.notificationService.printErrorMessage(error);
                                                    }
                                                },
                                                () =>  { 
                                                    this.setPage(1);
                                                    this.slimLoadingBarService.complete();
                                                    this.notificationService.printSuccessMessage('Done fetching suppliers...');
                                                    }
                                            );
    }

    close() {
        //this.modal1.close();
    }

    open(supId) {
        if(!this.actionValue[supId]) return;
        this.selectedSupplierId = supId;
        if(this.actionValue[supId]=='delete') this.modal1.open('lg');
        if(this.actionValue[supId]=='edit') this.modal2.open('lg');
    }

    removeSupplier(){
        this.suppService.removeSupplier(this.selectedSupplierId)
                                .subscribe( 
                                                result => this.notificationService.printSuccessMessage(result.success),
                                                error => {
                                                    if(error==='token_error') {
                                                        this.authService.cleanup();
                                                        this.router.navigate(['/login']);
                                                    }else{
                                                        this.notificationService.printErrorMessage(error);
                                                    }
                                                },
                                                () => this.getSuppliers()
                                            );
    }

    editSupplier(){

        let selSupId = this.selectedSupplierId;
        let dis = this;
        _.each(this.suppliers, function( supplier: any ) { 
            if( supplier.id === selSupId ) dis.suppService.setSupEditDetails(supplier);
        }, selSupId);

        let route = '/suppliers/add/' + this.selectedSupplierId;
        this.router.navigate([ route ]); 
    }

    ngOnDestroy(){
        this.suppliers = [];
    }

}