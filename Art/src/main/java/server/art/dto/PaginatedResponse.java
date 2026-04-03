package server.art.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaginatedResponse<T> {

    private List<T> data;
    private long total;
    private int page;
    private int limit;
    private int pages;

    public static <T> PaginatedResponse<T> of(List<T> data, long total, int page, int limit) {
        int pages = (int) Math.ceil((double) total / limit);
        return PaginatedResponse.<T>builder()
                .data(data)
                .total(total)
                .page(page)
                .limit(limit)
                .pages(pages)
                .build();
    }
}
