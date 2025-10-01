package com.basketball_camps.controller;

import com.basketball_camps.dto.CampCoachDto;
import com.basketball_camps.model.CampCoach;
import com.basketball_camps.service.CampCoachService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/camp-coaches")
@RequiredArgsConstructor
public class CampCoachController {

    private final CampCoachService service;

    @PostMapping
    public List<CampCoach> assignCoachesToCamp(@RequestBody CampCoachDto dto) {
        return service.assignCoachesToCamp(dto);
    }
    
    @GetMapping("/{campId}")
    public List<String> getCoachesForCamp(@PathVariable Long campId) {
        return service.getCoachesForCamp(campId);
    }

}