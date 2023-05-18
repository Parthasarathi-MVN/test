package com.parth.blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.parth.blog.model.EmailModel;
import com.parth.blog.model.User;
import com.parth.blog.model.VerifyOTP;
import com.parth.blog.repository.UserRepository;
import com.parth.blog.service.EmailSenderService;

import jakarta.servlet.http.HttpSession;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class EmailController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    EmailSenderService emailSenderService;

    public String generateOtp() {
        int otpSize = 6;
        char[] o = new char[otpSize];
        o = emailSenderService.generateOTP(otpSize);
        String otp = String.valueOf(o);
        return otp;
    }

    @PostMapping("/send-mail")
    public ResponseEntity<EmailModel> triggerMail(@RequestBody EmailModel emailModel, HttpSession session) {
        System.out.println(emailModel.getEmail());
        System.out.println(emailModel.getIsEmailInDB());

        String email = emailModel.getEmail();

        HttpHeaders responseHeaders = new HttpHeaders();

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            emailModel.setIsEmailInDB(false);
            responseHeaders.set("forgotPassword", "false");
            return new ResponseEntity<>(emailModel, responseHeaders, HttpStatus.NOT_FOUND);
        }

        String otp = generateOtp();
        user.setOtp(otp);
        userRepository.save(user);
        responseHeaders.set("forgotPassword", "true");

        String subject = "Forgot Password - OTP";
        String body = "This is your OTP " + otp + "\n Enter this OTP to change your password.";
        // emailSenderService.sendEmail(email, subject, body);
        // session.setAttribute("email", userEmail);// its like key:value. first
        // paramenter is key, second is value
        // Using HTTP Session to save Email in the session. Because, while verifying
        // the OTP we have to get the User object. For getting the User object we need
        // Email and after getting the User object, we can verify the OTP from database
        // and the OTP entered in the form.

        // return "enter-otp";
        return new ResponseEntity<>(emailModel, responseHeaders, HttpStatus.OK);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<VerifyOTP> verifyOTP(@RequestBody VerifyOTP verifyOTP) {

        System.out.println(verifyOTP.toString());
        String email = verifyOTP.getEmail();
        User user = userRepository.findByEmail(email).orElse(null);

        System.out.println(user.toString());
        if (user != null) {
            String otpFromDB = user.getOtp();
            String otpFromClient = verifyOTP.getOtpFromClient();
            System.out.println(otpFromClient);
            System.out.println(otpFromDB);
            if (otpFromDB.equals(otpFromClient)) {
                verifyOTP.setIsOTPMatch(true);
                return new ResponseEntity<>(verifyOTP, HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(verifyOTP, HttpStatus.NOT_FOUND);
    }

}
