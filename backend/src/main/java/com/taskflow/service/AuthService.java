package com.taskflow.service;

import com.taskflow.dto.AuthResponse;
import com.taskflow.dto.LoginRequest;
import com.taskflow.dto.RegisterRequest;
import com.taskflow.entity.User;
import com.taskflow.exception.EmailNotFoundException;
import com.taskflow.exception.InvalidCredentialsException;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.UserRepository;
import com.taskflow.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Attempting to register user with email: {}", request.getEmail());
        
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration failed: Email already registered - {}", request.getEmail());
            throw new RuntimeException("Email already registered");
        }
        
        String roleUpper = request.getRole().toUpperCase().trim();
        User.Role userRole;
        try {
            userRole = User.Role.valueOf(roleUpper);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid role provided: {}", request.getRole());
            throw new IllegalArgumentException("Invalid role. Must be USER or ADMIN");
        }
        
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(userRole)
                .build();
        
        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {}", savedUser.getEmail());
        
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        
        return buildAuthResponse(token, savedUser);
    }
    
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        log.info("Attempting login for email: {}", request.getEmail());
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("Login failed: Email not found - {}", request.getEmail());
                    return new EmailNotFoundException("Email not registered. Please sign up first.");
                });
        
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            log.warn("Login failed: Invalid credentials for email - {}", request.getEmail());
            throw new InvalidCredentialsException("Invalid credentials. Please check your email or password.");
        } catch (AuthenticationException e) {
            log.error("Authentication error for email {}: {}", request.getEmail(), e.getMessage());
            throw new InvalidCredentialsException("Authentication failed. Please try again.");
        }
        
        log.info("User logged in successfully: {}", user.getEmail());
        
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        
        return buildAuthResponse(token, user);
    }
    
    @Transactional(readOnly = true)
    public AuthResponse.UserInfo getCurrentUser(String email) {
        log.debug("Fetching current user info for email: {}", email);
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("User not found with email: {}", email);
                    return new ResourceNotFoundException("User not found");
                });
        
        return AuthResponse.UserInfo.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
    
    private AuthResponse buildAuthResponse(String token, User user) {
        return AuthResponse.builder()
                .token(token)
                .user(AuthResponse.UserInfo.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .build())
                .build();
    }
    
    @Transactional(readOnly = true)
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }
}
