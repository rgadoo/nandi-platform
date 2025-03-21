package com.nandi.api.client;

import com.nandi.api.dto.ChatRequest;
import com.nandi.api.dto.ChatResponse;
import com.nandi.api.dto.HealthResponse;
import com.nandi.api.dto.PointsResponse;
import com.nandi.api.dto.SessionMetricsRequest;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

@RegisterRestClient(configKey = "ai-service")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface AiServiceClient {

    @POST
    @Path("/api/chat/generate")
    ChatResponse generateChatResponse(ChatRequest request);

    @POST
    @Path("/api/session/metrics")
    PointsResponse calculateSessionPoints(SessionMetricsRequest request);

    @GET
    @Path("/api/points/calculations")
    PointsResponse getPointsCalculations();

    @GET
    @Path("/health")
    HealthResponse getHealth();
} 