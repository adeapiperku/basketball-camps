package com.basketball_camps.service;

import org.springframework.stereotype.Service;

import com.basketball_camps.model.Camp;
import com.basketball_camps.repository.CampRepository;

@Service
public class CampService extends BasicServiceOperations<CampRepository, Camp> {

   public CampService(CampRepository repository) {
      super(repository);
   }
}
