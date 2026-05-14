import TodoItem from './TodoItem';

export default function TodoList({ todos, onToggle, onDelete, onUpdate }) {
  return (
    <ul className="album-list">
      {todos.map((todo, index) => (
        <TodoItem 
          key={todo.id} 
          todo={todo} 
          index={index} 
          onToggle={onToggle} 
          onDelete={onDelete} 
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
}