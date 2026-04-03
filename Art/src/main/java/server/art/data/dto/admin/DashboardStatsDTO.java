package server.art.data.dto.admin;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsDTO {
    @JsonProperty("total_users")
    private long totalUsers;
    
    @JsonProperty("total_commissions")
    private long totalCommissions;
    
    @JsonProperty("total_revenue")
    private double totalRevenue; // Should be BigDecimal in production
    
    @JsonProperty("active_disputes")
    private long activeDisputes;
}
