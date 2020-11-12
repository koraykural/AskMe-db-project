import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CreatePostComponent } from './components/create-post/create-post.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { animation: 'bottom-left' },
  },
  {
    path: 'create',
    component: CreatePostComponent,
    data: { animation: 'bottom-right' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
