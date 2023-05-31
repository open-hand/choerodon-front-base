# choerodon-front-base

Front of Choerodon.

## Installing the Chart

To install the chart with the release name `choerodon-front-base`:

```console
$ helm repo add c7n https://openchart.choerodon.com.cn/choerodon/c7n
$ helm repo update
$ helm install choerodon-front-base c7n/choerodon-front-base
```

Specify each parameter using the `--set key=value[,key=value]` argument to `helm install`.

## Uninstalling the Chart

```bash
$ helm delete choerodon-front-base
```

## Requirements

| Repository | Name | Version |
|------------|------|---------|
| https://openchart.choerodon.com.cn/choerodon/c7n | common | 1.x.x |

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| affinity | object | `{}` | Affinity for pod assignment. Evaluated as a template. Note: podAffinityPreset, podAntiAffinityPreset, and nodeAffinityPreset will be ignored when it's set # ref: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity # |
| args | list | `[]` | Args for running the server container (set to default if not set). Use array form # |
| automountServiceAccountToken | bool | `false` | AutomountServiceAccountToken indicates whether a service account token should be automatically mounted. #  |
| base.pullPolicy | string | `"IfNotPresent"` | Specify a imagePullPolicy # Defaults to 'Always' if image tag is 'latest', else set to 'IfNotPresent' # ref: http://kubernetes.io/docs/user-guide/images/#pre-pulling-images # |
| base.pullSecrets | list | `[]` | Optionally specify an array of imagePullSecrets. # Secrets must be manually created in the namespace. # ref: https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/ # e.g: # pullSecrets: #   - myRegistryKeySecretName # |
| base.registry | string | `"registry.cn-shanghai.aliyuncs.com"` | Java base image registry |
| base.repository | string | `"c7n/frontbase"` | Java base image repository |
| base.tag | string | `"0.10.0"` | Java base image tag |
| command | list | `[]` | Command for running the server container (set to default if not set). Use array form # |
| commonAnnotations | object | `{}` | Add annotations to all the deployed resources # |
| commonLabels | object | `{}` | Add labels to all the deployed resources # |
| containerPort.serverPort | int | `8080` | server port |
| customLivenessProbe | object | `{}` | Custom Liveness |
| customReadinessProbe | object | `{}` | Custom Readiness |
| customStartupProbe | object | `{}` | Custom Startup probes |
| enableServiceLinks | bool | `false` | EnableServiceLinks indicates whether information about services should be injected into pod's environment variables,  matching the syntax of Docker links. Optional: Defaults to false. #  |
| extraEnv | object | `{}` |  |
| extraEnvVarsCM | string | `""` | ConfigMap with extra environment variables # |
| extraEnvVarsSecret | string | `""` | Secret with extra environment variables # |
| extraVolumeMounts | list | `[]` | Extra volume mounts to add to server containers # |
| extraVolumes | list | `[]` | Extra volumes to add to the server statefulset # |
| fullnameOverride | string | `nil` | String to fully override common.names.fullname template # |
| global.imagePullSecrets | list | `[]` | Global Docker registry secret names as an array # E.g. # imagePullSecrets: #   - myRegistryKeySecretName # |
| global.imageRegistry | string | `nil` | Global Docker image registry |
| global.storageClass | string | `nil` | Global StorageClass for Persistent Volume(s) |
| hostAliases | list | `[]` | server pod host aliases # https://kubernetes.io/docs/concepts/services-networking/add-entries-to-pod-etc-hosts-with-host-aliases/ # |
| image.pullPolicy | string | `"IfNotPresent"` | Specify a imagePullPolicy. Defaults to 'Always' if image tag is 'latest', else set to 'IfNotPresent' # ref: http://kubernetes.io/docs/user-guide/images/#pre-pulling-images # |
| image.pullSecrets | list | `[]` | Optionally specify an array of imagePullSecrets. Secrets must be manually created in the namespace. # ref: https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/ # e.g: # pullSecrets: #   - myRegistryKeySecretName # |
| image.registry | string | `"registry.cn-shanghai.aliyuncs.com"` | service image registry |
| image.repository | string | `"c7n/choerodon-front-base"` | service image repository |
| image.tag | string | `nil` | service image tag. Default Chart.AppVersion |
| ingress.annotations | object | `{}` | Additional annotations for the Ingress resource. To enable certificate autogeneration, place here your cert-manager annotations. # Use this parameter to set the required annotations for cert-manager, see # ref: https://cert-manager.io/docs/usage/ingress/#supported-annotations # e.g: # annotations: #   kubernetes.io/ingress.class: nginx #   cert-manager.io/cluster-issuer: cluster-issuer-name # |
| ingress.apiVersion | string | `""` | Force Ingress API version (automatically detected if not set) # |
| ingress.enabled | bool | `false` | Enable ingress record generation for Discourse # |
| ingress.extraHosts | list | `[]` | An array with additional hostname(s) to be covered with the ingress record # e.g: # extraHosts: #   - name: discourse.local #     path: / # |
| ingress.extraPaths | list | `[]` | An array with additional arbitrary paths that may need to be added to the ingress under the main host # e.g: # extraPaths: # - path: /* #   backend: #     serviceName: ssl-redirect #     servicePort: use-annotation # |
| ingress.extraTls | list | `[]` | TLS configuration for additional hostname(s) to be covered with this ingress record # ref: https://kubernetes.io/docs/concepts/services-networking/ingress/#tls # e.g: # extraTls: # - hosts: #     - discourse.local #   secretName: discourse.local-tls # |
| ingress.hostname | string | `"server.local"` | Default host for the ingress record # |
| ingress.ingressClassName | string | `""` | IngressClass that will be be used to implement the Ingress (Kubernetes 1.18+) # This is supported in Kubernetes 1.18+ and required if you have more than one IngressClass marked as the default for your cluster . # ref: https://kubernetes.io/blog/2020/04/02/improvements-to-the-ingress-api-in-kubernetes-1.18/ # |
| ingress.path | string | `"/"` | Default path for the ingress record # NOTE: You may need to set this to '/*' in order to use this with ALB ingress controllers # |
| ingress.pathType | string | `"ImplementationSpecific"` | Ingress path type # |
| ingress.secrets | list | `[]` | Custom TLS certificates as secrets # NOTE: 'key' and 'certificate' are expected in PEM format # NOTE: 'name' should line up with a 'secretName' set further up # If it is not set and you're using cert-manager, this is unneeded, as it will create a secret for you with valid certificates # If it is not set and you're NOT using cert-manager either, self-signed certificates will be created valid for 365 days # It is also possible to create and manage the certificates outside of this helm chart # Please see README.md for more information # e.g: # secrets: #   - name: discourse.local-tls #     key: |- #       -----BEGIN RSA PRIVATE KEY----- #       ... #       -----END RSA PRIVATE KEY----- #     certificate: |- #       -----BEGIN CERTIFICATE----- #       ... #       -----END CERTIFICATE----- # |
| ingress.selfSigned | bool | `false` | Create a TLS secret for this ingress record using self-signed certificates generated by Helm # |
| ingress.tls | bool | `false` | Enable TLS configuration for the host defined at `ingress.hostname` parameter # TLS certificates will be retrieved from a TLS secret with name: `{{- printf "%s-tls" .Values.ingress.hostname }}` # You can: #   - Use the `ingress.secrets` parameter to create this TLS secret #   - Relay on cert-manager to create it by setting the corresponding annotations #   - Relay on Helm to create self-signed certificates by setting `ingress.selfSigned=true` # |
| initContainers | object | `{}` | Add init containers to the server pods. # e.g: # initContainers: #   - name: your-image-name #     image: your-image #     imagePullPolicy: Always #     ports: #       - name: portname #         containerPort: 1234 # |
| kubeVersion | string | `nil` | Force target Kubernetes version (using Helm capabilites if not set) # |
| livenessProbe.enabled | bool | `true` | Enable livenessProbe |
| livenessProbe.failureThreshold | int | `5` | Failure threshold for livenessProbe |
| livenessProbe.initialDelaySeconds | int | `60` | Initial delay seconds for livenessProbe |
| livenessProbe.periodSeconds | int | `5` | Period seconds for livenessProbe |
| livenessProbe.successThreshold | int | `1` | Success threshold for livenessProbe |
| livenessProbe.timeoutSeconds | int | `3` | Timeout seconds for livenessProbe |
| nameOverride | string | `nil` | String to partially override common.names.fullname template (will maintain the release name) # |
| nodeAffinityPreset.key | string | `""` | Node label key to match # E.g. # key: "kubernetes.io/e2e-az-name" # |
| nodeAffinityPreset.type | string | `""` | Node affinity type. Allowed values: soft, hard # |
| nodeAffinityPreset.values | list | `[]` | Node label values to match # E.g. # values: #   - e2e-az1 #   - e2e-az2 # |
| nodeSelector | object | `{}` | Node labels for pod assignment. Evaluated as a template. # ref: https://kubernetes.io/docs/user-guide/node-selection/ # |
| persistence.accessModes | list | `["ReadWriteOnce"]` | Persistent Volume Access Mode # |
| persistence.annotations | object | `{}` | Persistent Volume Claim annotations # |
| persistence.enabled | bool | `false` | If true, use a Persistent Volume Claim, If false, use emptyDir # |
| persistence.existingClaim | string | `nil` | Enable persistence using an existing PVC # |
| persistence.mountPath | string | `"/data"` | Data volume mount path # |
| persistence.size | string | `"8Gi"` | Persistent Volume size # |
| persistence.storageClass | string | `nil` | Persistent Volume Storage Class # If defined, storageClassName: <storageClass> # If set to "-", storageClassName: "", which disables dynamic provisioning # If undefined (the default) or set to null, no storageClassName spec is #   set, choosing the default provisioner.  (gp2 on AWS, standard on #   GKE, AWS & OpenStack) # |
| podAffinityPreset | string | `""` | Pod affinity preset. Allowed values: soft, hard # ref: https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity # |
| podAnnotations | object | `{}` | Pod annotations # ref: https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/ # |
| podAntiAffinityPreset | string | `"soft"` | Pod anti-affinity preset. Allowed values: soft, hard # ref: https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity # |
| podLabels | object | `{}` | Pod labels # Ref: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/ # |
| readinessProbe.enabled | bool | `true` | Enable readinessProbe |
| readinessProbe.failureThreshold | int | `5` | Failure threshold for readinessProbe |
| readinessProbe.initialDelaySeconds | int | `5` | Initial delay seconds for readinessProbe |
| readinessProbe.periodSeconds | int | `5` | Period seconds for readinessProbe |
| readinessProbe.successThreshold | int | `1` | Success threshold for readinessProbe |
| readinessProbe.timeoutSeconds | int | `3` | Timeout seconds for readinessProbe |
| replicaCount | int | `1` | Number of deployment replicas # |
| resources.limits | object | `{"memory":"128Mi"}` | The resources limits for the init container |
| resources.requests | object | `{"memory":"128Mi"}` | The requested resources for the init container |
| schedulerName | string | `nil` | Scheduler name # https://kubernetes.io/docs/tasks/administer-cluster/configure-multiple-schedulers/ # |
| securityContext | object | `{"enabled":true,"fsGroup":101,"runAsUser":101}` | Security Context # ref: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/ # |
| service.annotations | object | `{}` | Provide any additional annotations which may be required. This can be used to set the LoadBalancer service type to internal only. # ref: https://kubernetes.io/docs/concepts/services-networking/service/#internal-load-balancer # |
| service.enabled | bool | `true` | Set to true to enable service record generation # |
| service.externalTrafficPolicy | string | `"Cluster"` | Enable client source IP preservation # ref http://kubernetes.io/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip # |
| service.loadBalancerIP | string | `nil` | loadBalancerIP for the server Service (optional, cloud specific) # ref: http://kubernetes.io/docs/user-guide/services/#type-loadbalancer # |
| service.loadBalancerSourceRanges | list | `[]` | Load Balancer sources # https://kubernetes.io/docs/tasks/access-application-cluster/configure-cloud-provider-firewall/#restrict-access-for-loadbalancer-service # e.g: # loadBalancerSourceRanges: #   - 10.10.10.0/24 # |
| service.nodePort | object | `{"server":30158}` | Specify the nodePort value for the LoadBalancer and NodePort service types. # ref: https://kubernetes.io/docs/concepts/services-networking/service/#type-nodeport # |
| service.port | object | `{"server":8080}` | server Service port # |
| service.type | string | `"ClusterIP"` | server Service type # |
| serviceAccount.create | bool | `false` | Set to true to create serviceAccount # |
| serviceAccount.name | string | `""` | The name of the ServiceAccount to use. # If not set and create is true, a name is generated using the common.names.fullname template # |
| sidecars | object | `{}` | Add sidecars to the server pods. # e.g: # sidecars: #   - name: your-image-name #     image: your-image #     imagePullPolicy: Always #     ports: #       - name: portname #         containerPort: 1234 # |
| startupProbe.enabled | bool | `true` | Enable startupProbe |
| startupProbe.failureThreshold | int | `60` | Failure threshold for startupProbe |
| startupProbe.initialDelaySeconds | int | `0` | Initial delay seconds for startupProbe |
| startupProbe.periodSeconds | int | `3` | Period seconds for startupProbe |
| startupProbe.successThreshold | int | `1` | Success threshold for startupProbe |
| startupProbe.timeoutSeconds | int | `2` | Timeout seconds for startupProbe |
| tolerations | list | `[]` | Tolerations for pod assignment. Evaluated as a template. # ref: https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/ # |
| updateStrategy.rollingUpdate | object | `{"maxSurge":"100%","maxUnavailable":0}` | Rolling update config params. Present only if DeploymentStrategyType = RollingUpdate. |
| updateStrategy.type | string | `"RollingUpdate"` | Type of deployment. Can be "Recreate" or "RollingUpdate". Default is RollingUpdate. |
| volumePermissionsEnabled | bool | `false` | Change the owner and group of the persistent volume mountpoint to runAsUser:fsGroup values from the securityContext section. |
| workingDir | string | `"/usr/share/nginx/html"` | Container's working directory(Default mountPath). # |

## Maintainers

| Name | Email | Url |
| ---- | ------ | --- |
| choerodon | <zhuchiyu@vip.hand-china.com> | <https://choerodon.io> |
