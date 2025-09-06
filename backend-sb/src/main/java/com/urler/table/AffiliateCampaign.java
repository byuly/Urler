package com.urler.table;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class AffiliateCampaign extends Campaign {
    private String affiliateId;
    private double commissionRate; // e.g., 0.15 for 15%
    private String payoutMethod;
}
