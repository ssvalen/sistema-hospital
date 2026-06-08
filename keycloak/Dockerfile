
FROM registry.access.redhat.com/ubi9 AS ubi-build
RUN mkdir -p /mnt/rootfs && \
    dnf install --installroot /mnt/rootfs curl \
        --releasever 9 --setopt install_weak_deps=false --nodocs -y && \
    dnf --installroot /mnt/rootfs clean all

FROM quay.io/keycloak/keycloak:26.0.2
COPY --from=ubi-build /mnt/rootfs /
