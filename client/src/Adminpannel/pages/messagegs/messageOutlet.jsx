import { IoSearch, IoSend } from "react-icons/io5";
import styles from "../../css/messages/messages.module.css";
import { useUserInfo } from "../../../userinfo/userinfo";
import { PiChecksBold } from "react-icons/pi";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useGlobalMessageContext } from "../../../Globalmessage/components/globalmessage";
import { GoDotFill } from "react-icons/go";
import { MessageCard } from "../../components/messages/MessageCard";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { sendBrowserNotification } from "../../../utilits/notification.utilits";

let SocketContext = createContext(null);

// message.sender / message.receiver may arrive as a plain id string
// or as a populated object ({ _id, username, ... }) depending on the
// backend. Normalize either shape to a plain id string.
const getId = (value) => {
  if (!value) return null;
  return typeof value === "string" ? value : value._id?.toString() ?? null;
};

const MessageOutlet = () => {
  const { user, loading } = useUserInfo();
  const [users, setUsers] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const { showMessages } = useGlobalMessageContext();
  const { receiverid } = useParams();
  const [typingStatus, setTypingStatus] = useState({
    state: false,
    userId: null,
  });
  const [notifPermission, setNotifPermission] = useState(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "unsupported"
  );

  let navigate = useNavigate();
  const socketRef = useRef(null);

  // The socket effect below intentionally only depends on [user, loading],
  // so it won't tear down/reconnect on every route change. handleNewMessage
  // still needs the *currently open* conversation, so we track receiverid
  // in a ref it can read fresh on every message without adding receiverid
  // to that effect's deps.
  const receiverIdRef = useRef(receiverid ?? null);
  useEffect(() => {
    receiverIdRef.current = receiverid ?? null;
  }, [receiverid]);

  const enableNotifications = async () => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
      const result = await Notification.requestPermission();
      setNotifPermission(result);
    } else {
      // already granted or denied — nothing JS can do, just reflect it
      setNotifPermission(Notification.permission);
    }
  };

  useEffect(() => {
    if (!user || loading) {
      return;
    }

    const socket = io(`${import.meta.env.VITE_BASE_URL}/message`, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("get_users");
    });

    socket.on("users", (users) => {
      setUsers(Array.isArray(users) ? users : []);
    });
    socket.on("message_error", (error) => {
      console.error("Message socket error:", error);
    });
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });
    socket.on("disconnect", (reason) => {
      console.log("Message socket disconnected:", reason);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
    // keyed off user?._id, not the whole user object, so this doesn't
    // reconnect the socket every time useUserInfo() returns a new
    // object reference for the same logged-in user
  }, [user?._id, loading]);

  useEffect(() => {
    if (selectedReceiver) {
      navigate(`/admin/messages/i/${selectedReceiver._id}`, { replace: true });
    }
  }, [selectedReceiver]);

  useEffect(() => {
    if (!user || loading) return;

    const socket = socketRef.current;
    if (!socket) return;

    const handleNewMessage = (data) => {
      const message = data?.message;
      if (!message) return;

      const messageSender = getId(message.sender);
      const messageReceiver = getId(message.receiver);
      const currentUserId = user._id?.toString();

      const otherUserId =
        messageSender === currentUserId ? messageReceiver : messageSender;

      const isIncomingMessage = messageSender !== currentUserId;
      const isCurrentConversation = receiverIdRef.current === messageSender;
      const isPageVisible = document.visibilityState === "visible";

      console.log("MESSAGE NOTIFICATION CHECK", {
        messageSender,
        currentUserId,
        currentConversation: receiverIdRef.current,
        isIncomingMessage,
        isCurrentConversation,
        isPageVisible,
      });

      if (isIncomingMessage && (!isCurrentConversation || !isPageVisible)) {
        sendBrowserNotification({
          title: data?.senderName || "New Message",
          body: message.content || "You received a new message",
          icon: data?.senderavatar || "/favicon.ico",
          tag: `message-${message._id ?? Date.now()}`,
        });
      }

      setUsers((prevUsers) => {
        if (!Array.isArray(prevUsers)) return [];

        const updatedUsers = prevUsers.map((useri) =>
          useri._id?.toString() !== otherUserId
            ? useri
            : { ...useri, LastMessage: [message] }
        );

        const targetUser = updatedUsers.find(
          (useri) => useri._id?.toString() === otherUserId
        );
        const otherUsers = updatedUsers.filter(
          (useri) => useri._id?.toString() !== otherUserId
        );

        return targetUser ? [targetUser, ...otherUsers] : updatedUsers;
      });
    };

    const handleStatusUpdate = (data) => {
      setUsers((prevUsers) =>
        prevUsers.map((useri) => {
          if (useri._id?.toString() !== data.receiver?.toString()) {
            return useri;
          }
          return {
            ...useri,
            LastMessage: useri.LastMessage?.map((msg) => ({
              ...msg,
              status: data.status,
            })),
          };
        })
      );
    };

    const handleTypingStatus = (data) => {
      setTypingStatus({
        userId: data?.userId,
        state: Boolean(data?.state),
      });
    };

    socket.on("new_message", handleNewMessage);
    socket.on("status_update", handleStatusUpdate);
    socket.on("typing_state", handleTypingStatus);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("status_update", handleStatusUpdate);
      socket.off("typing_state", handleTypingStatus);
    };
  }, [user?._id, loading]);

  let handleSelectReceiver = (receiver) => {
    setSelectedReceiver(receiver);
  };

  return (
    <div className={styles.mainchatcontainer}>
      <div className={styles.chatsleft}>
        <div className={styles.messagingheading}>
          Messages
          {notifPermission === "default" && (
            <button onClick={enableNotifications} className={styles.notifBtn}>
              Enable notifications
            </button>
          )}
          {notifPermission === "denied" && (
            <span
              className={styles.notifBlocked}
              title="Notifications are blocked for this site. Allow them in your browser's site settings, then reload."
            >
              Notifications blocked
            </span>
          )}
        </div>
        <div className={styles.searchbarholder}>
          <div className={styles.searchbar}>
            <IoSearch />
            <input type="text" placeholder="Search Messages" name="search" />
          </div>
        </div>

        <div className={styles.messagecardsholder}>
          {users.map((item) => (
            <MessageCard
              key={item._id}
              carduser={item}
              onclick={handleSelectReceiver}
              selectedReceiver={selectedReceiver}
              typing={typingStatus}
            />
          ))}
        </div>
      </div>
      <SocketContext.Provider
        value={{ socketRef: socketRef, receiverUser: selectedReceiver }}
      >
        <Outlet />
      </SocketContext.Provider>
    </div>
  );
};

export const useSocket = () => useContext(SocketContext);

export default MessageOutlet;