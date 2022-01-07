import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "todo",
    loadChildren: () => import("./pages/todo/todo.module").then(m => m.TodoModule)
  },
  {
    path: "label",
    loadChildren: () => import("./pages/label/label.module").then(m => m.LabelModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
