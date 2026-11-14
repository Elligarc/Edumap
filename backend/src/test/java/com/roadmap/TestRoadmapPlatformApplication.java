package com.roadmap;

import org.springframework.boot.SpringApplication;

public class TestRoadmapPlatformApplication {

	public static void main(String[] args) {
		SpringApplication.from(RoadmapPlatformApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
