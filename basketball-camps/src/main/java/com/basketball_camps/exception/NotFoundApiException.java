package com.basketball_camps.exception;

import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;

public class NotFoundApiException extends RuntimeException {

    private final HttpStatus statusCode;
    private List<String> parameters;

    public NotFoundApiException(HttpStatus httpStatusCode) {
        this.statusCode = httpStatusCode;
    }

    public HttpStatus getStatusCode() {
        return this.statusCode;
    }

    public Object[] getParameters() {
        return this.parameters == null ? null : this.parameters.toArray();
    }

    public NotFoundApiException addParameter(String parameter) {
        if (this.parameters == null) {
            this.parameters = new ArrayList<>();
        }
        this.parameters.add(parameter);
        return this;
    }

    public void addParameters(List<String> parameters) {
        this.parameters = parameters;
    }
}
