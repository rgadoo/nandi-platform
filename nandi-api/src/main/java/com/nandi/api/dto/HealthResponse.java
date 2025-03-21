package com.nandi.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;

public class HealthResponse {
    @NotNull
    private String status;

    @NotNull
    private String timestamp;

    @NotNull
    private String version;

    @NotNull
    private String environment;

    @NotNull
    private SystemMetrics system;

    @NotNull
    private ServiceMetrics service;

    private String error;

    public static class SystemMetrics {
        @NotNull
        private Double cpuUsage;

        @NotNull
        private MemoryUsage memoryUsage;

        @NotNull
        private DiskUsage diskUsage;

        @NotNull
        private String platform;

        @NotNull
        private String pythonVersion;

        public static class MemoryUsage {
            @NotNull
            private Double percent;

            @NotNull
            private Double usedMb;

            @NotNull
            private Double totalMb;

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
            @NotNull
            private Double percent;

            @NotNull
            private Double usedGb;

            @NotNull
            private Double totalGb;

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
        @NotNull
        private Long cacheSize;

        @NotNull
        private Long uptimeSeconds;

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