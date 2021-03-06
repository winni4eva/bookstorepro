import { Routes, RouterModule } from '@angular/router';

import { BookRoutes } from './books/book.routes';
import { CategoryRoutes } from './categories/category.routes';
import { SupplierRoutes } from './suppliers/supplier.routes';
import { LevelRoutes } from './levels/level.routes';
import { CartRoutes } from './cart/cart.routes';
import { HomeRoutes } from './home/home.routes';

//import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
//import { LoginGuard } from './login/guard.service';
import { SignUpComponent } from './signup/signup.component';


const appRoutes : Routes = [
    ...HomeRoutes,
    ...BookRoutes,
    ...CategoryRoutes,
    ...SupplierRoutes,
    ...LevelRoutes,
    ...CartRoutes,
     {
        path: 'login',
        component: LoginComponent
    },
     {
        path: 'signup',
        component: SignUpComponent
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch:'full'
    }
    //{
        //path: '',
        //component: HeaderComponent,
        //outlet: 'header'
        //children: [
            //{ path: '', component: LoginComponent },
            //{ path: '', component: MainComponent, outlet: 'header' }
        //]
    //},
    //{
    //  path: '**',
    //  component: PageNotFoundComponent
    //},
];

export const routing = RouterModule.forRoot(appRoutes,{ useHash: true });
