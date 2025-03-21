package com.nandi.api.controller;

import com.nandi.api.client.AiServiceClient;
import com.nandi.api.dto.*;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.logging.Logger;

@Path("/api")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "AI Service API", description = "AI Service operations")
public class AiServiceController {
    private static final Logger LOG = Logger.getLogger(AiServiceController.class);

    @Inject
    @RestClient
    AiServiceClient aiServiceClient;

    @POST
    @Path("/chat/generate")
    @Operation(
            operationId = "generateChatResponse",
            summary = "Generate chat response",
            description = "Generates an AI response based on the provided message and context"
    )
    @APIResponses({
            @APIResponse(
                    responseCode = "200",
                    description = "Successfully generated response",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON,
                            schema = @Schema(implementation = ChatResponse.class))
            ),
            @APIResponse(
                    responseCode = "400",
                    description = "Invalid request",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON)
            ),
            @APIResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON)
            )
    })
    public Response generateChatResponse(
            @RequestBody(
                    required = true,
                    content = @Content(schema = @Schema(implementation = ChatRequest.class))
            )
            @Valid ChatRequest request) {
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
    @Operation(
            operationId = "calculateSessionPoints",
            summary = "Calculate session points",
            description = "Calculates points for a chat session based on provided metrics"
    )
    @APIResponses({
            @APIResponse(
                    responseCode = "200",
                    description = "Points calculated successfully",
                    content = @Content(schema = @Schema(implementation = PointsResponse.class))
            ),
            @APIResponse(
                    responseCode = "400",
                    description = "Invalid metrics provided"
            ),
            @APIResponse(
                    responseCode = "500",
                    description = "Internal server error"
            )
    })
    public Response calculateSessionPoints(
            @RequestBody(required = true)
            @Valid SessionMetricsRequest request) {
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
    @Operation(
            operationId = "getHealth",
            summary = "Check health status",
            description = "Returns the health status of the AI service"
    )
    @APIResponses({
            @APIResponse(
                    responseCode = "200",
                    description = "Service is healthy",
                    content = @Content(schema = @Schema(implementation = HealthResponse.class))
            ),
            @APIResponse(
                    responseCode = "503",
                    description = "Service is unhealthy"
            )
    })
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