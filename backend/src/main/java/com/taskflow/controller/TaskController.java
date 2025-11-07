package com.taskflow.controller;

import com.taskflow.dto.TaskRequest;
import com.taskflow.dto.TaskResponse;
import com.taskflow.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearer-jwt")
@Tag(name = "Tasks", description = "Task management endpoints")
public class TaskController {
    
    private final TaskService taskService;
    
    @GetMapping
    @Operation(summary = "Get all tasks for logged-in user")
    public ResponseEntity<List<TaskResponse>> getAllTasks(Authentication authentication) {
        return ResponseEntity.ok(taskService.getAllTasksForUser(authentication.getName()));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get task by ID")
    public ResponseEntity<TaskResponse> getTaskById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return ResponseEntity.ok(taskService.getTaskById(id, authentication.getName()));
    }
    
    @PostMapping
    @Operation(summary = "Create a new task")
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody TaskRequest request,
            Authentication authentication
    ) {
        return new ResponseEntity<>(
                taskService.createTask(request, authentication.getName()),
                HttpStatus.CREATED
        );
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update task")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(taskService.updateTask(id, request, authentication.getName()));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete task")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id,
            Authentication authentication
    ) {
        taskService.deleteTask(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
