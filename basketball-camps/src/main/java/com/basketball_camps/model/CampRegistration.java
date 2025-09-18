package com.basketball_camps.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.basketball_camps.enums.RegistrationStatus;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class CampRegistration extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participant_id", nullable = false)
    private Participant participant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "camp_id", nullable = false)
    private Camp camp;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RegistrationStatus status = RegistrationStatus.PENDING;

    @Column(nullable = false)
    private LocalDateTime registeredAt;

    private LocalDateTime confirmedAt;
    private LocalDateTime cancelledAt;

    @Column(precision = 10, scale = 2)
    private BigDecimal amountPaid;

    @Column(columnDefinition = "TEXT")
    private String specialRequests;

    public boolean isConfirmed() {
        return status == RegistrationStatus.CONFIRMED;
    }

    public boolean canBeCancelled() {
        return status == RegistrationStatus.CONFIRMED &&
                camp.getStartDate().isAfter(LocalDate.now().plusDays(7));
    }
}
