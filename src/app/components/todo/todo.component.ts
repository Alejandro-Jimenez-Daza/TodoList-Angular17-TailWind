import { Component, OnInit, computed, effect, signal } from '@angular/core';
import { FilterType, TodoModel } from '../../models/todo';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'; 

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent implements OnInit {
  todolist = signal<TodoModel[]>([]);


  filter = signal<FilterType>('all');

  todoListFiltered = computed(() =>{
    const filter = this.filter();
    const todos = this.todolist();
    switch(filter){
      case 'active':
        return todos.filter((todo) => !todo.completeed);
      case 'completed':
        return todos.filter((todo) => todo.completeed);
      default:
        return todos;
    }

  });


  newTodo = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)]
  });



  constructor(){


    effect(() =>{
      localStorage.setItem('todos', JSON.stringify(this.todolist()));
    });

  }

  ngOnInit(): void{
    const storage = localStorage.getItem('todos');
    if (storage) {
      this.todolist.set(JSON.parse(storage)); 
    }
  }


  changeFilter(filterString: FilterType){
    this.filter.set(filterString);
  }
  addTodo(){

    const newTodoTitle = this.newTodo.value.trim();
    if (this.newTodo.valid && newTodoTitle !== '') {
      this.todolist.update((prev_todos)=>{
        return [
          ...prev_todos,
          {id: Date.now(), title: newTodoTitle, completeed: false},
        ];
      });
      this.newTodo.reset();
    } else {
      this.newTodo.reset();
    }
  }

  toggleTodo(todoId: number){
    return this.todolist.update((prev_todos) => 
    prev_todos.map((todo) => {


      return todo.id === todoId?{...todo, completeed: !todo.completeed}
      : todo;
    })
    );
  }
  removeTodo(todoId: number){
    this.todolist.update((prev_todos)=> 
      prev_todos.filter((todo) => todo.id !== todoId)
    );
  }

  updateTodoEditingMode(todoId: number){
    return this.todolist.update((prev_todos) =>
    prev_todos.map((todo) => {
      return todo.id === todoId 
      ? {...todo, editing: true }
      : {...todo, editing: false}; 
      })
    );
  }

  saveTitleTodo(todoId: number, event: Event){
    const title = (event.target as HTMLInputElement).value;
    return this.todolist.update((prev_todos) => prev_todos.map((todo) => {
      return todo.id === todoId 
      ? {...todo, title, editing: false}
      : todo;  
    })
    );
  }
}
