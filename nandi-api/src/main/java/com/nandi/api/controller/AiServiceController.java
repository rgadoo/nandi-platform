package com.nandi.api.controller;

import com.nandi.api.client.AiServiceClient;
import com.nandi.api.dto.*;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.logging.Logger;

@Path("/api")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AiServiceController {
    private static final Logger LOG = Logger.getLogger(AiServiceController.class);

    @Inject
    @RestClient
    AiServiceClient aiServiceClient;

    @POST
    @Path("/chat/generate")
    public Response generateChatResponse(@Valid ChatRequest request) {
        try {
            LOG.debugf("Generating chat response for message: %s", request.getMessage());
            return Response.ok(aiServiceClient.generateChatResponse(request)).build();
        } catch (Exception e) {
            LOG.error("Error generating chat response", e);
            return Response.serverError()
                    .entity(("Error generating chat response"))
                    .build();
        }
    }

    @POST
    @Path("/session/metrics")
    public Response calculateSessionPoints(@Valid SessionMetricsRequest request) {
        try {
            return Response.ok(aiServiceClient.calculateSessionPoints(request)).build();
        } catch (Exception e) {
            LOG.error("Error calculating session points", e);
            return Response.serverError()
                    .entity(("Error calculating session points"))
                    .build();
        }
    }

    @GET
    @Path("/health")
    public Response getHealth() {
        try {
            return Response.ok(aiServiceClient.getHealth()).build();
        } catch (Exception e) {
            LOG.error("Error retrieving health status", e);
            return Response.status(Response.Status.SERVICE_UNAVAILABLE)
                    .entity(("Service is unhealthy"))
                    .build();
        }
    }
}