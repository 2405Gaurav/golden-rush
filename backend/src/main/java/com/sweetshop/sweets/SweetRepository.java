package com.sweetshop.sweets;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface SweetRepository extends JpaRepository<SweetEntity, UUID>, JpaSpecificationExecutor<SweetEntity> {
  Optional<SweetEntity> findByNameIgnoreCase(String name);
}






