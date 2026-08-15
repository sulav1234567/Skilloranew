import { GoDotFill } from "react-icons/go";
import { PiChecksBold } from "react-icons/pi";
import { useUserInfo } from "../../../userinfo/userinfo";
import styles from "../../css/messages/messages.module.css";
import { useNavigate } from "react-router";

export const MessageCard = ({
  carduser = null,
  onclick = () => {},
  selectedReceiver = null,
  typing=false
}) => {
  const { user, loading } = useUserInfo();
  let navigate = useNavigate();

  const lastMessage = carduser?.LastMessage?.[0];
  const isSelected =
    selectedReceiver?._id?.toString().trim() ===
    carduser?._id?.toString().trim();
  const isMyMessage =
    lastMessage &&
    user &&
    lastMessage.sender?.toString().trim() === user._id?.toString().trim();
  const isUnread =
  lastMessage &&
  lastMessage.status !== "read" &&
  lastMessage.sender?.toString() !== user._id.toString();

  return (
    <div
      className={`
        ${styles.messagecard}
        ${isSelected ? styles.messagecardactive : ""}
      `}
      onClick={(e) => {
        e.stopPropagation();
        onclick(carduser);
      }}
    >
      <div className={styles.userpicture}>
        <img src={carduser?.avatar} alt="" />
      </div>

      <div className={styles.messagecontents}>
        <div className={styles.username}>{carduser?.Fullname}</div>

        <div className={styles.messagecontent}>
  {typing?.state &&
  typing?.userId?.toString() === carduser?._id?.toString() ? (
    <div className={styles.typing}>
      typing....
    </div>
  ) : (
    <>
      <div
        className={`
          ${styles.message}
          ${isUnread ? styles.messagebold : ""}
        `}
      >
        {lastMessage
          ? `${isMyMessage ? "You: " : ""}${lastMessage.content || ""}`
          : ""}
      </div>

      <div className={styles.messagestate}>
        {isUnread && <GoDotFill />}

        {isMyMessage && (
          <PiChecksBold
            className={styles[lastMessage.status]}
          />
        )}
      </div>
    </>
  )}
</div>
      </div>
    </div>
  );
};
