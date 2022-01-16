import { Component, OnInit } from '@angular/core';
import { Label } from '../label/label.model';
import { LabelService } from '../label/label.service';
import { ITodo } from './todo.model';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  newTodo: ITodo = {};
  todos: ITodo[] = [];
  filteredTodos: ITodo[] = [];
  state: string = 'all';
  labels: Label[] = [];
  activeLabels: any[] = [];
  isSyncing: boolean = false;

  constructor(private todoService: TodoService,
    private labelService: LabelService) { }

  ngOnInit() {
    this.getLabels();
    // this.getTodos();
  }

  getLabels() {
    const filter = {};

    this.labelService.get(filter)
      .subscribe(labels => {
        this.labels = labels;

        this.activeLabels = labels
          .filter(label => !label.isDeleted)
          .map(label => { return { label: label.name, value: label.id } });

        this.getTodos();
      });
  }

  getTodos() {
    this.todoService.get()
      .subscribe(todos => {
        console.log(todos);
        this.todos = todos;

        this.todos.forEach(todo => {
          todo.selectedLabels = this.labels
            .filter(label => todo.labelIds && todo.labelIds.indexOf(label.id) != -1)
            .map(label => label.name);
        });

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