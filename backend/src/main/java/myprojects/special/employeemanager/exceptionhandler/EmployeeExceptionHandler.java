package myprojects.special.employeemanager.exceptionhandler;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.ArrayList;
import java.util.List;

@ControllerAdvice
public class EmployeeExceptionHandler extends ResponseEntityExceptionHandler {

    @Autowired
    private MessageSource messageSource;

    /*@Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex, HttpHeaders headers,
                                                                  HttpStatus status, WebRequest request) {
        String messageUser = messageSource.getMessage("invalid.message", null, LocaleContextHolder.getLocale());
        return handleExceptionInternal(ex, messageUser, headers, HttpStatus.BAD_REQUEST, request);
    }*/

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers,
                                                                  HttpStatus status, WebRequest request) {
        List<Erro> errs = createListError(ex.getBindingResult());
        return handleExceptionInternal(ex, errs, headers,HttpStatus.BAD_REQUEST, request);
    }

    private List<Erro> createListError(BindingResult bindingResult) {
        List<Erro> errs = new ArrayList<>();
        bindingResult.getFieldErrors().stream().forEach(fieldError -> {
            String messageUser = "";
            String messageDev = "";
            String fieldName = "";
            messageUser = messageSource.getMessage(fieldError, LocaleContextHolder.getLocale());
            messageDev = fieldError.toString();
            fieldName = fieldError.getField();
            errs.add(new Erro(messageUser, messageDev, fieldName));
        });

        return errs;
    }

    @Data
    @AllArgsConstructor
    public static class Erro {

        private String messageUser;
        private String messageDev;
        private String fieldName;

    }
}
