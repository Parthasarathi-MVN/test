package com.parth.blog.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VerifyOTP {

    private String email;
    private String otpFromClient;
    private Boolean isOTPMatch;

}
