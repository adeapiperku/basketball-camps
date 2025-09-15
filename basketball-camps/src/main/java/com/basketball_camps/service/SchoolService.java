package com.basketball_camps.service;

import org.springframework.stereotype.Service;

import com.basketball_camps.model.School;
import com.basketball_camps.repository.SchoolRepository;

@Service
public class SchoolService extends BasicServiceOperations<SchoolRepository, School> {

   public SchoolService(SchoolRepository repository) {
      super(repository);
   }
}
