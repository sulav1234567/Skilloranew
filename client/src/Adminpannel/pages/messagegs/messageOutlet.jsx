import { IoSearch, IoSend } from "react-icons/io5";
import styles from "../../css/messages/messages.module.css";
import { useUserInfo } from "../../../userinfo/userinfo";
import { PiChecksBold } from "react-icons/pi";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useGlobalMessageContext } from "../../../Globalmessage/components/globalmessage";
import { GoDotFill } from "react-icons/go";
import { MessageCard } from "../../components/messages/MessageCard";
import { Outlet, useNavigate } from "react-router-dom";

let SocketContext = createContext(null);

const MessageOutlet = () => {
  const { user, loading } = useUserInfo();
  const [users, setUsers] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const { showMessages } = useGlobalMessageContext();
  const [typingStatus,setTypingStatus]=useState({
    state:false,
    userId:null
  })
  let navigate = useNavigate();
  const socketRef = useRef(null);

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
      console.log(users);
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
  }, [user, loading]);

  useEffect(() => {
    if (selectedReceiver) {
      navigate(`/admin/messages/i/${selectedReceiver._id}`, { replace: true });
    }
  }, [selectedReceiver]);

 useEffect(() => {
  if (!user || loading) return;

  const socket = socketRef.current;

  if (!socket) return;

  const handleNewMessage = (message) => {
    if (!message) return;

    const messageSender = message.sender?.toString();
    const messageReceiver = message.receiver?.toString();
    const currentUserId = user._id.toString();

    const otherUserId =
      messageSender === currentUserId
        ? messageReceiver
        : messageSender;

    setUsers((prevUsers) => {
      if (!Array.isArray(prevUsers)) return [];

      const updatedUsers = prevUsers.map((useri) => {
        if (useri._id?.toString() !== otherUserId) {
          return useri;
        }

        return {
          ...useri,
          LastMessage: [message],
        };
      });

      const targetUser = updatedUsers.find(
        (useri) => useri._id?.toString() === otherUserId
      );

      const otherUsers = updatedUsers.filter(
        (useri) => useri._id?.toString() !== otherUserId
      );

      return targetUser
        ? [targetUser, ...otherUsers]
        : updatedUsers;
    });
  };

  const handleStatusUpdate = (data) => {
    setUsers((prevUsers) =>
    prevUsers.map((useri) => {
      if (
        useri._id?.toString() !== data.receiver?.toString()
      ) {
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

  const handleTypingStatus = (data)=>{

   

    setTypingStatus({
      userId:data?.userId,
      state:Boolean(data?.state)
    })



  }

  socket.on("new_message", handleNewMessage);
  socket.on("status_update", handleStatusUpdate);
  socket.on("typing_state",handleTypingStatus)

  return () => {
    socket.off("new_message", handleNewMessage);
    socket.off("status_update", handleStatusUpdate);
    socket.off("typing_state",handleTypingStatus)
  };
}, [user, loading]);
  let handleSelectReceiver = (receiver) => {
    setSelectedReceiver(receiver);
  };

  return (
    <div className={styles.mainchatcontainer}>
      <div className={styles.chatsleft}>
        <div className={styles.messagingheading}>Messages</div>
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
      <SocketContext.Provider value={{ socketRef: socketRef }}>
        <Outlet />
      </SocketContext.Provider>
    </div>
  );
};

export const useSocket = () => useContext(SocketContext);

export default MessageOutlet;
