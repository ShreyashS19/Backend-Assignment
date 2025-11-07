package com.taskflow.service;

import com.taskflow.dto.TaskRequest;
import com.taskflow.dto.TaskResponse;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.exception.UnauthorizedException;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {
    
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    
    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasksForUser(String email) {
        User user = getUserByEmail(email);
        return taskRepository.findByUserId(user.getId())
                .stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long taskId, String email) {
        User user = getUserByEmail(email);
        Task task = taskRepository.findByIdAndUserId(taskId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        return TaskResponse.fromEntity(task);
    }
    
    @Transactional
    public TaskResponse createTask(TaskRequest request, String email) {
        User user = getUserByEmail(email);
        
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .completed(request.getCompleted() != null ? request.getCompleted() : false)
                .user(user)
                .build();
        
        Task savedTask = taskRepository.save(task);
        return TaskResponse.fromEntity(savedTask);
    }
    
    @Transactional
    public TaskResponse updateTask(Long taskId, TaskRequest request, String email) {
        User user = getUserByEmail(email);
        Task task = taskRepository.findByIdAndUserId(taskId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getCompleted() != null) {
            task.setCompleted(request.getCompleted());
        }
        
        Task updatedTask = taskRepository.save(task);
        return TaskResponse.fromEntity(updatedTask);
    }
    
    @Transactional
    public void deleteTask(Long taskId, String email) {
        User user = getUserByEmail(email);
        Task task = taskRepository.findByIdAndUserId(taskId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        taskRepository.delete(task);
    }
    
    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));
    }
}
