package com.insurai.service;

import com.insurai.dto.user.ChangePasswordRequest;
import com.insurai.dto.user.UpdateProfileRequest;
import com.insurai.dto.user.UserProfileResponse;
import com.insurai.entity.User;
import com.insurai.exception.BadRequestException;
import com.insurai.exception.ResourceNotFoundException;
import com.insurai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new UserProfileResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole().name());
    }

    @Transactional
    public UserProfileResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if email is being changed and if it's already taken
        if (!user.getEmail().equals(request.getEmail()) &&
                userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());

        user = userRepository.save(user);

        return new UserProfileResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole().name());
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    // Admin methods
    public List<UserProfileResponse> getAllClients() {
        return userRepository.findByRole(User.Role.CLIENT).stream()
                .map(user -> new UserProfileResponse(
                        user.getId(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getEmail(),
                        user.getRole().name()))
                .collect(Collectors.toList());
    }

    @Transactional
    public UserProfileResponse updateClient(Long clientId, UpdateProfileRequest request) {
        User user = userRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));

        if (user.getRole() != User.Role.CLIENT) {
            throw new BadRequestException("User is not a client");
        }

        return updateProfile(clientId, request);
    }

    @Transactional
    public void deleteClient(Long clientId) {
        User user = userRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));

        if (user.getRole() != User.Role.CLIENT) {
            throw new BadRequestException("User is not a client");
        }

        userRepository.delete(user);
    }
}
