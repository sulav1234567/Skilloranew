import { useParams } from "react-router";
import { useUserInfo } from "../../../userinfo/userinfo";
import { useSocket } from "./messageOutlet";
import { useEffect, useRef, useState } from "react";
import styles from "../../css/messages/messages.module.css";
import { IoMdAdd } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { formatMessageTime } from "../../../utilits/utilits";

export const MessageRightSide = () => {
  const { socketRef } = useSocket();
  let { user, loading } = useUserInfo();
  let { receiverid } = useParams();
  const containerRef = useRef(null);
  const textAreaRef = useRef(null);
  const [messages, setMessages] = useState(null);
  const [User, setUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef();
  const typingTimeoutRef = useRef(null);

  const sendMessage = () => {
    if (!receiverid) {
      return;
    }

    if (!socketRef.current) {
      showMessages("Message connection is not available", "reject");

      return;
    }

    if (!socketRef.current.connected) {
      showMessages("Message connection is not available", "reject");

      return;
    }

    const textarea = textAreaRef.current;

    if (!textarea) {
      return;
    }

    const content = textarea.value.trim();

    if (!content) {
      showMessages("Empty messages cannot be sent", "reject");

      return;
    }
    socketRef.current.emit("send_message", {
      receiverid,

      content,
    });

    textarea.value = "";

    textarea.style.height = "auto";

    textarea.style.overflowY = "hidden";
  };
  const handleTextareaInput = (e) => {
    const textarea = e.target;

    textarea.style.height = "auto";

    const maxHeight = 119;

    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;

    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  };
  const handleTextareaKeyDown = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      sendMessage();
    }
  };
  const handleNewMesssage = (message) => {
    if (message) {
      setMessages((prev) => {
        return [...prev, message];
      });
    }
  };
  const handleMessagesRead = ({ receiverid }) => {
  setMessages((prev) =>
    prev.map((message) => {
      if (message.sender.toString() === receiverid.toString()) {
        return {
          ...message,
          status: "read",
        };
      }

      return message;
    })
  );
};
const handleStatusUpdate = (data) => {
  setMessages((prev) => {
    if (!Array.isArray(prev)) return prev;

    return prev.map((message) => {
      if (
        message.receiver?.toString() === data.receiver?.toString()
      ) {
        return {
          ...message,
          status: data.status,
        };
      }

      return message;
    });
  });
};

  const handleTyping = () => {
    const socket = socketRef.current;

    if (!socket || !receiverid) return;

    socket.emit("typing", {
      receiverid,
    });

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", {
        receiverid,
      });
    }, 1000);
  };

  useEffect(() => {
  if (!socketRef.current || !user || loading || !receiverid) {
    return;
  }

  const socket = socketRef.current;

  socket.emit("send_all_message", { receiverid });

  socket.on("all_messages", (messages) => {
    if (!messages) return;
    setMessages(messages);
  });

  socket.on("new_message", handleNewMesssage);

  socket.on("status_update", handleStatusUpdate);

  socket.on("typing_state", ({ state, userId }) => {
    if (userId?.toString() === receiverid?.toString()) {
      setIsTyping(Boolean(state));
    }
  });

  return () => {
    socket.off("all_messages");
    socket.off("new_message", handleNewMesssage);
    socket.off("status_update", handleStatusUpdate);
    socket.off("typing_state");
    clearTimeout(typingTimeoutRef.current);
  };
}, [user, loading, receiverid,socketRef.current]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

    if (!socketRef.current || !user || loading || !receiverid) {
      return;
    }
    const socket = socketRef.current;

    socket.emit("mark_read", { receiverid });
  }, [messages]);

  return (
    <div className={styles.chatsright}>
      {receiverid && (
        <>
          <div className={styles.chatsHeader}>
            {/* <div className={styles.useravatar}>
              <img src={selectedReceiver.avatar} alt="" />
            </div>

            <div className={styles.username}>{selectedReceiver.Fullname}</div> */}
          </div>
          <div className={styles.chatmainholder} ref={containerRef}>
            {messages &&
              Array.isArray(messages) &&
              messages.map((message,index) => {
                return (
                  <div
                    className={`${styles.messagerow} ${message.sender.toString().trim() === user._id.toString().trim() ? styles.senderrow : styles.receiverrow}`}
                  >
                    <div
                      className={`${styles.messagemain} ${message.sender.toString().trim() === user._id.toString().trim() ? styles.sendermessage : styles.receivermessage}`}
                    >
                      {message.content}
                    </div>


                    <div className={`${styles.timespampsandstate} ${messages.length === index+1 && message.sender.toString().trim() === user._id.toString().trim() ? styles.timestampsshow:styles.timestampshide}`}>

                      {formatMessageTime(message.createdAt)} . {message.status}

                      
                    </div>
                  </div>
                );
              })}

            {isTyping && (
              <div className={styles.typinganimation}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            <div ref={bottomRef}></div>
          </div>

          <div className={styles.chatsfooter}>
            <div className={styles.fileaddbtn}>
              <IoMdAdd />
            </div>

            <div className={styles.inputfield}>
              <textarea
                ref={textAreaRef}
                rows={1}
                placeholder="Type Here ...."
                onInput={(e) => {
                  handleTyping();
                  handleTextareaInput(e);
                }}
                onKeyDown={handleTextareaKeyDown}
              />
            </div>

            <div className={styles.sendbtn} onClick={sendMessage}>
              <IoSend />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
