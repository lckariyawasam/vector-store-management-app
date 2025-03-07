ARG BASE_IMAGE
FROM ${BASE_IMAGE}

# Copy project files to the docker image
# COPY --chown=wso2carbon:wso2 carbon-home/carbonapps/*.car ${WSO2_SERVER_HOME}/repository/deployment/server/carbonapps/
COPY --chown=wso2carbon:wso2 carbon-home/carbonapps/extracted  ${WSO2_SERVER_HOME}/repository/deployment/server/apps
COPY --chown=wso2carbon:wso2 carbon-home/repository/resources/security/wso2carbon.jks ${WSO2_SERVER_HOME}/repository/resources/security/wso2carbon.jks
COPY --chown=wso2carbon:wso2 carbon-home/repository/resources/security/client-truststore.jks ${WSO2_SERVER_HOME}/repository/resources/security/client-truststore.jks
COPY --chown=wso2carbon:wso2 carbon-home/conf ${WSO2_SERVER_HOME}/conf
# Change the conf/deployment.toml file to point to the new key store and trust store files
RUN sed -i 's|repository/resources/security/wso2carbon.jks|/tmp/security/wso2carbon.jks|g' ${WSO2_SERVER_HOME}/conf/deployment.toml
RUN sed -i 's|repository/resources/security/client-truststore.jks|/tmp/security/client-truststore.jks|g' ${WSO2_SERVER_HOME}/conf/deployment.toml
# micro-integrator script changes
RUN sed -i 's|TMP_DIR=\"$CARBON_HOME\"/tmp|TMP_DIR="/tmp/temp"|g' ${WSO2_SERVER_HOME}/bin/micro-integrator.sh && \
    sed -i 's|-Djava.io.tmpdir=\"$CARBON_HOME/tmp\"|-Djava.io.tmpdir=/tmp/temp|g' ${WSO2_SERVER_HOME}/bin/micro-integrator.sh && \
    sed -i 's|-DskipStartupExtensions=false|-DskipStartupExtensions=true|g' ${WSO2_SERVER_HOME}/bin/micro-integrator.sh && \
    sed -i 's|-Dcarbon.config.dir.path=\"$CARBON_HOME/conf\"|-Dcarbon.config.dir.path="/tmp/conf"|g' ${WSO2_SERVER_HOME}/bin/micro-integrator.sh && \
    sed -i 's|-Dconf.location=\"$CARBON_HOME/conf\"|-Dconf.location="/tmp/conf"|g' ${WSO2_SERVER_HOME}/bin/micro-integrator.sh && \
    sed -i 's|-Djava.util.logging.config.file=\"$CARBON_HOME/conf/etc/logging-bridge.properties\"|-Djava.util.logging.config.file="/tmp/conf/etc/logging-bridge.properties"|g' ${WSO2_SERVER_HOME}/bin/micro-integrator.sh
RUN sed -i '/org.wso2.micro.integrator.bootstrap.Bootstrap/i -DconfigParseOnly=true \\' ${WSO2_SERVER_HOME}/bin/micro-integrator.sh && \
    sed -i '/org.wso2.micro.integrator.bootstrap.Bootstrap/i -Dconfig.backup.path="/tmp/backup" \\' ${WSO2_SERVER_HOME}/bin/micro-integrator.sh
# Insert comment: Copy p2 profile wso2/components/micro-integrator-default to /tmp/micro-integrator-default
RUN sed -i "/#setting up profile parameter for runtime in MB/i \# Copy p2 profile wso2/components/micro-integrator-default to /tmp/micro-integrator-default" \
${WSO2_SERVER_HOME}/bin/micro-integrator.sh
# Insert command: cp the p2 profile to /tmp
RUN sed -i "/# Copy p2 profile wso2\/components\/micro-integrator-default to \/tmp\/micro-integrator-default/a \cp -r ${WSO2_SERVER_HOME}/wso2/components/micro-integrator-default /tmp\n" \
${WSO2_SERVER_HOME}/bin/micro-integrator.sh
# Insert comment: Create directories for temp and backup
RUN sed -i "/#setting up profile parameter for runtime in MB/i \# Create directories for logs, temp and backup" \
${WSO2_SERVER_HOME}/bin/micro-integrator.sh
# Insert command: Create directories for logs, temp and backup
RUN sed -i "/# Create directories for logs, temp and backup/a \mkdir -p /tmp/logs\nmkdir -p /tmp/temp\nmkdir -p /tmp/backup\n" \
${WSO2_SERVER_HOME}/bin/micro-integrator.sh
# Insert comment: Create directories for registry mounts
RUN sed -i "/#setting up profile parameter for runtime in MB/i \# Create directories for registry mounts" \
${WSO2_SERVER_HOME}/bin/micro-integrator.sh
# Insert command: Create directories for registry mounts
RUN sed -i "/# Create directories for registry mounts/a \mkdir -p /tmp/registry/config\nmkdir -p /tmp/registry/governance\nmkdir -p /tmp/registry/local\n" \
${WSO2_SERVER_HOME}/bin/micro-integrator.sh
# Insert comment: Move Create directories for server key store
RUN sed -i "/#setting up profile parameter for runtime in MB/i \# Move Create directories for server key store" \
${WSO2_SERVER_HOME}/bin/micro-integrator.sh
# Insert command: Move server key store files to /tmp/security
RUN sed -i "/# Move Create directories for server key store/a \cp -r ${WSO2_SERVER_HOME}/repository/resources/security /tmp\n" \
${WSO2_SERVER_HOME}/bin/micro-integrator.sh
# Insert comment: Move server configuration files to /tmp/conf
RUN sed -i "/#setting up profile parameter for runtime in MB/i \# Move server configuration files to /tmp/conf" \
${WSO2_SERVER_HOME}/bin/micro-integrator.sh
# Insert command: Move server configuration files to /tmp/conf
RUN sed -i "/#setting up profile parameter for runtime in MB/i \cp -r ${WSO2_SERVER_HOME}/conf /tmp\n" \
${WSO2_SERVER_HOME}/bin/micro-integrator.sh
# diagnostics-tool changes
RUN sed -i 's|appender.R.fileName = ${sys:app.home}/logs/diagnostics.log|appender.R.fileName = /tmp/logs/diagnostics.log|g' ${WSO2_SERVER_HOME}/diagnostics-tool/conf/log4j2.properties
RUN sed -i 's|appender.R.filePattern = ${sys:app.home}/logs/diagnostics-%d{MM-dd-yyyy}.log|appender.R.filePattern = /tmp/logs/diagnostics-%d{MM-dd-yyyy}.log|g' ${WSO2_SERVER_HOME}/diagnostics-tool/conf/log4j2.properties
RUN sed -i 's|logs_directory = \"../repository/logs\"|logs_directory = \"file:/tmp/logs\"|g' ${WSO2_SERVER_HOME}/diagnostics-tool/conf/config.toml
RUN sed -i 's|diagnostic_log_file_path = \"logs/diagnostics.log\"|diagnostic_log_file_path = \"file:/tmp/logs/diagnostics.log\"|g' ${WSO2_SERVER_HOME}/diagnostics-tool/conf/config.toml
RUN sed -i 's|carbon_log_file_path = \"../repository/logs/wso2error.log\"|carbon_log_file_path = "file:/tmp/logs/wso2error.log"|g' ${WSO2_SERVER_HOME}/diagnostics-tool/conf/config.toml
# Update paths in /tmp/micro-integrator-default/configuration/org.eclipse.equinox.simpleconfigurator/bundles.info to point to ${WSO2_SERVER_HOME}/wso2/components/plugins
RUN sed -i 's|../plugins|file:${WSO2_SERVER_HOME}/wso2/components/plugins|g' ${WSO2_SERVER_HOME}/wso2/components/micro-integrator-default/configuration/org.eclipse.equinox.simpleconfigurator/bundles.info
# Replace placeholder in bundle.info with the actual value of WSO2_SERVER_HOME
RUN sed -i "s|file:\${WSO2_SERVER_HOME}|file:${WSO2_SERVER_HOME}|g" ${WSO2_SERVER_HOME}/wso2/components/micro-integrator-default/configuration/org.eclipse.equinox.simpleconfigurator/bundles.info
# launch.ini changes
RUN sed -i '/osgi.parentClassloader=app/i osgi.configuration.area=/tmp/micro-integrator-default/configuration' ${WSO2_SERVER_HOME}/conf/etc/launch.ini
# Move the logs directory to /tmp
RUN mv ${WSO2_SERVER_HOME}/repository/logs /tmp/logs
# give the write permission to the /tmp/logs
RUN chown -R wso2carbon:wso2 /tmp/logs
# Add simlink to /tmp/logs
RUN ln -sf /tmp/logs ${WSO2_SERVER_HOME}/repository/logs
# Create directories for server configuration files
RUN mkdir -p /tmp/conf
# give the write permission to the /tmp/conf
RUN chown -R wso2carbon:wso2 /tmp/conf
# Update the registry.xml file
RUN sed -i '/<\/registry>/i \<parameter name="RegRoot">file:///tmp/registry</parameter>' ${WSO2_SERVER_HOME}//repository/deployment/server/synapse-configs/default/registry.xml
RUN echo "com.atomikos.icatch.log_base_dir=/tmp" > ${WSO2_SERVER_HOME}/conf/jta.properties
# Pass jta.properties as a system property
ENV JAVA_OPTS="${JAVA_OPTS} -Dcom.atomikos.icatch.file=${WSO2_SERVER_HOME}/conf/jta.properties"
# Run the script
RUN ${WSO2_SERVER_HOME}/bin/extension-runner.sh
# initiate container and start WSO2 Carbon server
ENTRYPOINT ["/bin/sh", "-c", "/home/wso2carbon/docker-entrypoint.sh $JAVA_OPTS"]
