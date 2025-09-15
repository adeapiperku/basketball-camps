package com.basketball_camps.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.basketball_camps.model.School;
import com.basketball_camps.service.SchoolService;

@RestController
@RequestMapping("/schools")
public class SchoolController extends BasicControllerOperations<SchoolService, School> {

   public SchoolController(SchoolService service) {
      super(service);
   }

}