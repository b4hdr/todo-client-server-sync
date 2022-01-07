import { Component, OnInit } from '@angular/core';
import { ITodo } from './todo.model';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  newTodo: ITodo = {};
  todos: Array<ITodo> = [];
  filteredTodos: Array<ITodo> = [];
  state: string = 'all';
  isSyncing: boolean = false;

  constructor(private todoService: TodoService) { }

  ngOnInit() {
    this.getTodos();
  }

  getTodos() {
    this.todoService.get()
      .subscribe(todos => {
        console.log(todos);
        this.todos = todos;

        this.filterByState(this.state);
      });
  }

  add() {
    this.todoService.add([this.newTodo])
      .subscribe((addedTodos) => {
        if (addedTodos.length > 0) {
          this.getTodos();
          this.clearNewTodo();
          console.log('Successfully added');
        }
      });
  }

  toggleTodoState(todo: ITodo) {
    this.todoService.toggleTodoState(todo)
      .subscribe(data => {
        console.log(data);
      });
  }

  delete(todo: ITodo) {
    this.todoService.delete(todo)
      .subscribe(data => {
        console.log(data);
        this.getTodos();
      });
  }

  clearNewTodo() {
    this.newTodo = {};
  }

  sync() {
    this.isSyncing = true;

    this.todoService.sync()
      .subscribe({
        next: result => {
          this.isSyncing = false;
          console.log(result);
          this.getTodos();
        }, error: error => {
          this.isSyncing = false;
          console.log(error);
        }
      });
  }

  filterByState(state: string) {
    this.state = state;

    switch (state) {
      case 'all':
        this.filteredTodos = this.todos;
        break;

      case 'active':
        this.filteredTodos = this.todos.filter(todo => !todo.isCompleted);
        break;

      case 'completed':
        this.filteredTodos = this.todos.filter(todo => todo.isCompleted);
        break;

      default:
        this.filteredTodos = this.todos;
        break;
    }
  }
}