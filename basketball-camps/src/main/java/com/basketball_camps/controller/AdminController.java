package com.basketball_camps.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.basketball_camps.model.Admin;
import com.basketball_camps.payload.LoginPayload;
import com.basketball_camps.service.AdminService;

@RestController
@RequestMapping("/admins")
public class AdminController extends BasicControllerOperations<AdminService, Admin> {

   public AdminController(AdminService service) {
      super(service);
   }
    @PostMapping("/login")
    public Admin login(@RequestBody @Validated LoginPayload login) {
        return this.service.login(login.getEmail(), login.getPassword());
    }
}