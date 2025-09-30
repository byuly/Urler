package com.urler.repository;

import com.urler.table.Clicks;
import com.urler.table.Url;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ClicksRepository extends JpaRepository<Clicks, Long> {
   List<Clicks> findByUrlAndClickDateBetween(Url url, LocalDateTime startDate, LocalDateTime endDate);
   List<Clicks> findByUrlInAndClickDateBetween(List<Url> urls, LocalDateTime startDate, LocalDateTime endDate);
}
