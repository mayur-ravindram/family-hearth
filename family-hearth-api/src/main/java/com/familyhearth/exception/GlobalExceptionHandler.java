package com.familyhearth.exception;

import com.familyhearth.auth.InvalidTokenException;
import com.familyhearth.invites.InviteExpiredException;
import com.familyhearth.invites.InviteNotFoundException;
import com.familyhearth.invites.UserAlreadyExistsException;
import com.familyhearth.media.MediaNotFoundException;
import com.familyhearth.posts.MediaOwnershipException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(FamilyNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleFamilyNotFoundException(FamilyNotFoundException e) {
        return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<Map<String, String>> handleInvalidTokenException(InvalidTokenException e) {
        return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InviteExpiredException.class)
    public ResponseEntity<Map<String, String>> handleInviteExpiredException(InviteExpiredException e) {
        return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.valueOf(419));
    }

    @ExceptionHandler(InviteNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleInviteNotFoundException(InviteNotFoundException e) {
        return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleUserAlreadyExistsException(UserAlreadyExistsException e) {
        return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(com.familyhearth.posts.MediaNotFoundException.class)
    public ResponseEntity<Map<String, String>> handlePostMediaNotFoundException(com.familyhearth.posts.MediaNotFoundException e) {
        return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(MediaNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleMediaNotFoundException(MediaNotFoundException e) {
        return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MediaOwnershipException.class)
    public ResponseEntity<Map<String, String>> handleMediaOwnershipException(MediaOwnershipException e) {
        return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleIllegalStateException(IllegalStateException e) {
        return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.CONFLICT);
    }

    // Generic handler for other exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception e) {
        // In a real app, you would log this exception
        e.printStackTrace();
        return new ResponseEntity<>(Map.of("error", "An unexpected error occurred."), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
