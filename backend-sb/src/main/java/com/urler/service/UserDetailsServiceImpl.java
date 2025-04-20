package com.urler.service;
import com.urler.repository.UserRepository;
import com.urler.table.User;
import com.urler.table.UserDetailsImpl;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException

import org.springframework.stereotype.Service;

// method returns UserDetails, from spring security with username from database
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final
    UserRepository userRepository;

    // constructor injection instead of @Autowired field injection for testable code
    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional // make sure no lazy loading during method
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        return UserDetailsImpl.build(user); // load user from our database and convert to object type for spring security
    }
}
