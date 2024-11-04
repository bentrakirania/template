import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MedecinComponent } from './medecin.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: MedecinComponent }
	])],
	exports: [RouterModule]
})
export class MedecinRoutingModule { }
