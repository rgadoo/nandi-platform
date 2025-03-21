package com.nandi.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Response object containing health check information")
public class HealthResponse {
    @Schema(description = "Current status of the service")
    @NotNull
    private String status;

    @Schema(description = "Timestamp of the health check")
    @NotNull
    private String timestamp;

    @Schema(description = "Service version")
    @NotNull
    private String version;

    @Schema(description = "Current environment (development, staging, production)")
    @NotNull
    private String environment;

    @Schema(description = "System metrics")
    @NotNull
    private SystemMetrics system;

    @Schema(description = "Service metrics")
    @NotNull
    private ServiceMetrics service;

    @Schema(description = "Error information if any")
    private String error;

    public static class SystemMetrics {
        @Schema(description = "CPU usage percentage")
        @NotNull
        private Double cpuUsage;

        @Schema(description = "Memory usage information")
        @NotNull
        private MemoryUsage memoryUsage;

        @Schema(description = "Disk usage information")
        @NotNull
        private DiskUsage diskUsage;

        @Schema(description = "Platform information")
        @NotNull
        private String platform;

        @Schema(description = "Python version")
        @NotNull
        private String pythonVersion;

        public static class MemoryUsage {
            @Schema(description = "Memory usage percentage")
            @NotNull
            private Double percent;

            @Schema(description = "Used memory in MB")
            @NotNull
            private Double usedMb;

            @Schema(description = "Total memory in MB")
            @NotNull
            private Double totalMb;

            // Getters and setters
            public Double getPercent() {
                return percent;
            }

            public void setPercent(Double percent) {
                this.percent = percent;
            }

            public Double getUsedMb() {
                return usedMb;
            }

            public void setUsedMb(Double usedMb) {
                this.usedMb = usedMb;
            }

            public Double getTotalMb() {
                return totalMb;
            }

            public void setTotalMb(Double totalMb) {
                this.totalMb = totalMb;
            }
        }

        public static class DiskUsage {
            @Schema(description = "Disk usage percentage")
            @NotNull
            private Double percent;

            @Schema(description = "Used disk space in GB")
            @NotNull
            private Double usedGb;

            @Schema(description = "Total disk space in GB")
            @NotNull
            private Double totalGb;

            // Getters and setters
            public Double getPercent() {
                return percent;
            }

            public void setPercent(Double percent) {
                this.percent = percent;
            }

            public Double getUsedGb() {
                return usedGb;
            }

            public void setUsedGb(Double usedGb) {
                this.usedGb = usedGb;
            }

            public Double getTotalGb() {
                return totalGb;
            }

            public void setTotalGb(Double totalGb) {
                this.totalGb = totalGb;
            }
        }

        // Getters and setters
        public Double getCpuUsage() {
            return cpuUsage;
        }

        public void setCpuUsage(Double cpuUsage) {
            this.cpuUsage = cpuUsage;
        }

        public MemoryUsage getMemoryUsage() {
            return memoryUsage;
        }

        public void setMemoryUsage(MemoryUsage memoryUsage) {
            this.memoryUsage = memoryUsage;
        }

        public DiskUsage getDiskUsage() {
            return diskUsage;
        }

        public void setDiskUsage(DiskUsage diskUsage) {
            this.diskUsage = diskUsage;
        }

        public String getPlatform() {
            return platform;
        }

        public void setPlatform(String platform) {
            this.platform = platform;
        }

        public String getPythonVersion() {
            return pythonVersion;
        }

        public void setPythonVersion(String pythonVersion) {
            this.pythonVersion = pythonVersion;
        }
    }

    public static class ServiceMetrics {
        @Schema(description = "Current cache size")
        @NotNull
        private Long cacheSize;

        @Schema(description = "Service uptime in seconds")
        @NotNull
        private Long uptimeSeconds;

        // Getters and setters
        public Long getCacheSize() {
            return cacheSize;
        }

        public void setCacheSize(Long cacheSize) {
            this.cacheSize = cacheSize;
        }

        public Long getUptimeSeconds() {
            return uptimeSeconds;
        }

        public void setUptimeSeconds(Long uptimeSeconds) {
            this.uptimeSeconds = uptimeSeconds;
        }
    }

    // Getters and setters
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public SystemMetrics getSystem() {
        return system;
    }

    public void setSystem(SystemMetrics system) {
        this.system = system;
    }

    public ServiceMetrics getService() {
        return service;
    }

    public void setService(ServiceMetrics service) {
        this.service = service;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
} 