package spi;

import com.azure.messaging.servicebus.ServiceBusClientBuilder;
import com.azure.messaging.servicebus.ServiceBusMessage;
import com.azure.messaging.servicebus.ServiceBusSenderClient;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class AzureServiceBusPublisher implements EventPublisher {

    private ServiceBusSenderClient senderClient;

    public AzureServiceBusPublisher(String connectionString, String queueName) {
        log.info("Initializing AzureServiceBusPublisher for queue: {}", queueName);
        if (connectionString != null && !connectionString.isEmpty()) {
            try {
                this.senderClient = new ServiceBusClientBuilder()
                        .connectionString(connectionString)
                        .sender()
                        .queueName(queueName)
                        .buildClient();
                log.info("Successfully initialized Azure Service Bus Sender in Keycloak.");
            } catch (Exception e) {
                log.error("Failed to initialize Azure Service Bus Sender: " + e.getMessage(), e);
            }
        }
    }

    @Override
    public void publish(String messageJson) throws Exception {
        if (senderClient != null) {
            log.debug("Publishing message to Azure Service Bus: {}", messageJson);
            senderClient.sendMessage(new ServiceBusMessage(messageJson));
        } else {
            log.error("ASB sender client is null. Cannot send message.");
        }
    }

    @Override
    public void close() {
        if (senderClient != null) {
            try {
                senderClient.close();
            } catch (Exception e) {
                // Ignore
            }
        }
    }
}
