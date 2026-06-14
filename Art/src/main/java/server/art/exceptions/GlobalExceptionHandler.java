package server.art.exceptions;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import server.art.dto.ApiErrorResponse;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        log.warn("Validation error: {}", ex.getMessage());
        List<ApiErrorResponse.FieldError> fieldErrors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(fe -> ApiErrorResponse.FieldError.builder()
                        .field(fe.getField())
                        .error(fe.getDefaultMessage())
                        .build())
                .collect(Collectors.toList());

        ApiErrorResponse response = ApiErrorResponse.builder()
                .error("Validation failed")
                .status(HttpStatus.BAD_REQUEST.value())
                .message("One or more fields are invalid")
                .details(fieldErrors)
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        log.warn("Resource not found exception: {}", ex.getMessage());
        ApiErrorResponse response = ApiErrorResponse.builder()
                .error("Not Found")
                .status(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(BusinessLogicException.class)
    public ResponseEntity<ApiErrorResponse> handleBusinessLogic(BusinessLogicException ex) {
        log.warn("Business logic exception: {}", ex.getMessage());
        ApiErrorResponse response = ApiErrorResponse.builder()
                .error("Business Logic Error")
                .status(422)
                .message(ex.getMessage())
                .build();

        return ResponseEntity.status(422).body(response);
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiErrorResponse> handleConflict(ConflictException ex) {
        log.warn("Conflict exception: {}", ex.getMessage());
        ApiErrorResponse response = ApiErrorResponse.builder()
                .error("Conflict")
                .status(HttpStatus.CONFLICT.value())
                .message(ex.getMessage())
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        log.warn("Access denied exception: {}", ex.getMessage());
        ApiErrorResponse response = ApiErrorResponse.builder()
                .error("Forbidden")
                .status(HttpStatus.FORBIDDEN.value())
                .message("You do not have permission to access this resource")
                .build();

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericException(Exception ex) {
        log.error("An unexpected error occurred: ", ex);
        ApiErrorResponse response = ApiErrorResponse.builder()
                .error("Internal Server Error")
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message("An unexpected error occurred")
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
