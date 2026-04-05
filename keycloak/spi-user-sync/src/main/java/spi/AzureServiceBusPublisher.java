package spi;

import com.azure.messaging.servicebus.ServiceBusClientBuilder;
import com.azure.messaging.servicebus.ServiceBusMessage;
import com.azure.messaging.servicebus.ServiceBusSenderClient;
import org.jboss.logging.Logger;

public class AzureServiceBusPublisher implements EventPublisher {

    private static final Logger logger = Logger.getLogger(AzureServiceBusPublisher.class);
    private ServiceBusSenderClient senderClient;

    public AzureServiceBusPublisher(String connectionString, String queueName) {
        if (connectionString != null && !connectionString.isEmpty()) {
            try {
                this.senderClient = new ServiceBusClientBuilder()
                        .connectionString(connectionString)
                        .sender()
                        .queueName(queueName)
                        .buildClient();
                logger.debug("Successfully initialized Azure Service Bus Sender in Keycloak.");
            } catch (Exception e) {
                logger.error("Failed to initialize Azure Service Bus Sender: " + e.getMessage());
            }
        }
    }

    @Override
    public void publish(String messageJson) throws Exception {
        if (senderClient != null) {
            senderClient.sendMessage(new ServiceBusMessage(messageJson));
        } else {
            logger.error("ASB sender client is null. Cannot send message.");
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
