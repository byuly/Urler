package com.urler.repository;

import com.urler.table.Url;
import com.urler.table.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UrlRepository extends JpaRepository<Url, Long> {
   Url findByShortenedUrl(String shortenedUrl);
   List<Url> findByUser(User user);
}
