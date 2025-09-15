package com.basketball_camps.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.basketball_camps.model.Camp;
import com.basketball_camps.service.CampService;

@RestController
@RequestMapping("/camps")
public class CampController extends BasicControllerOperations<CampService, Camp> {

   public CampController(CampService service) {
      super(service);
   }

}