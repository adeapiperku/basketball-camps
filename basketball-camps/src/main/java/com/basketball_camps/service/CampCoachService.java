package com.basketball_camps.service;

import com.basketball_camps.model.Camp;
import com.basketball_camps.model.CampCoach;
import com.basketball_camps.model.Coach;
import com.basketball_camps.dto.CampCoachDto;
import com.basketball_camps.repository.CampCoachRepository;
import com.basketball_camps.repository.CampRepository;
import com.basketball_camps.repository.CoachRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CampCoachService {

    private final CampCoachRepository repository;
    private final CampRepository campRepository;
    private final CoachRepository coachRepository;

    @Transactional
    public List<CampCoach> assignCoachesToCamp(CampCoachDto dto) {
        Camp camp = campRepository.findById(dto.getCampId())
                .orElseThrow(() -> new RuntimeException("Camp not found"));

        List<CampCoach> campCoaches = new ArrayList<>();

        for (Long coachId : dto.getCoachIds()) {
            Coach coach = coachRepository.findById(coachId)
                    .orElseThrow(() -> new RuntimeException("Coach not found with id " + coachId));

            CampCoach campCoach = new CampCoach();
            campCoach.setCamp(camp);
            campCoach.setCoach(coach);

            campCoaches.add(repository.save(campCoach));
        }

        return campCoaches;
    }

    @Transactional
    public List<String> getCoachesForCamp(Long campId) {
        List<CampCoach> campCoaches = repository.findByCampId(campId);
        List<String> coachNames = new ArrayList<>();
        for (CampCoach cc : campCoaches) {
            Coach coach = cc.getCoach();
            coachNames.add(coach.getFirstName() + " " + coach.getLastName());
        }

        return coachNames;
    }

}
