import styles from "../styles.module.css";

export default function MessageList({ messages }) {
  return (
    <div className={styles.messages}>
      {messages.map((msg, index) => (
        <div key={index} className={msg.isSender ? styles.sentMessage : styles.receivedMessage}>
          <p>{msg.text}</p>
          <span className={styles.timestamp}>{msg.timestamp}</span>
        </div>
      ))}
    </div>
  );
}
