package spi;

public interface EventPublisher {
    void publish(String messageJson) throws Exception;
    void close();
}
