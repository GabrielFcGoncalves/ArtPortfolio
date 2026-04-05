package server.art.listeners;

import com.azure.messaging.servicebus.ServiceBusClientBuilder;
import com.azure.messaging.servicebus.ServiceBusReceivedMessage;
import com.azure.messaging.servicebus.ServiceBusReceiverClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

@Slf4j
@Service
@ConditionalOnProperty(name = "message.broker", havingValue = "servicebus", matchIfMissing = true)
public class AzureServiceBusUserSyncConsumer {

    private final UserRegistrationProcessor processor;
    private final String connectionString;
    private final String queueName = "user-registration-queue";
    private ServiceBusReceiverClient receiver;

    public AzureServiceBusUserSyncConsumer(UserRegistrationProcessor processor,
            @Value("${azure.service-bus.connection-string}") String connectionString) {
        this.processor = processor;
        this.connectionString = connectionString;
    }

    @PostConstruct
    public void startListening() {
        log.info("Initializing Azure Service Bus receiver for queue: {}", queueName);

        receiver = new ServiceBusClientBuilder()
                .connectionString(connectionString)
                .transportType(com.azure.core.amqp.AmqpTransportType.AMQP)
                .receiver()
                .queueName(queueName)
                .buildClient();

        Thread listenerThread = new Thread(this::listen);
        listenerThread.setName("ServiceBusListener-Thread");
        listenerThread.setDaemon(false);
        listenerThread.start();
        
        log.info("Service Bus listener thread started.");
    }

    private void listen() {
        try {
            while (true) {
                receiver.receiveMessages(10).forEach(this::processMessage);
            }
        } catch (Exception e) {
            log.error("Error in Service Bus listener loop", e);
        }
    }

    private void processMessage(ServiceBusReceivedMessage message) {
        String messageBody = message.getBody().toString();
        try {
            processor.processRegistration(messageBody);
            receiver.complete(message);
        } catch (Exception e) {
            log.error("Failed to process message: {}", e.getMessage(), e);
            receiver.abandon(message);
        }
    }

    @PreDestroy
    public void stopListening() {
        if (receiver != null) {
            receiver.close();
            log.info("Service Bus receiver closed");
        }
    }
}
