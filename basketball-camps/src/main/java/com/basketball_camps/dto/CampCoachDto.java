package com.basketball_camps.dto;

import lombok.Data;

import java.util.List;

@Data
public class CampCoachDto {
    private Long campId;
    private List<Long> coachIds;
}