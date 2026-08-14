import { IoSearch, IoSend } from "react-icons/io5";

import styles from "../../css/messages/messages.module.css";

import { useUserInfo } from "../../../userinfo/userinfo";

import { PiChecksBold } from "react-icons/pi";

import { IoMdAdd } from "react-icons/io";

import { useEffect, useRef, useState } from "react";

import { io } from "socket.io-client";

import { useGlobalMessageContext } from "../../../Globalmessage/components/globalmessage";

import { GoDotFill } from "react-icons/go";

/*
|--------------------------------------------------------------------------
| Message Card
|--------------------------------------------------------------------------
*/

const MessageCard = ({
  carduser = null,
  onclick = () => {},
  selectedReceiver = null,
}) => {
  const { user, loading } = useUserInfo();

  const lastMessage = carduser?.LastMessage?.[0];

  const isSelected =
    selectedReceiver?._id?.toString().trim() ===
    carduser?._id?.toString().trim();

  const isMyMessage =
    lastMessage &&
    user &&
    lastMessage.sender?.toString().trim() === user._id?.toString().trim();

  const isUnread = lastMessage && !isMyMessage && lastMessage.status !== "read";

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
      {/* Avatar */}

      <div className={styles.userpicture}>
        <img src={carduser?.avatar} alt="" />
      </div>

      {/* Content */}

      <div className={styles.messagecontents}>
        <div className={styles.username}>{carduser?.Fullname}</div>

        <div className={styles.messagecontent}>
          {/* Last message */}

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

          {/* Status */}

          <div className={styles.messagestate}>
            {isUnread && <GoDotFill />}

            {isMyMessage && (
              <PiChecksBold className={styles[lastMessage.status]} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Message Outlet
|--------------------------------------------------------------------------
*/

const MessageOutlet = () => {
  const { user, loading } = useUserInfo();

  const [users, setUsers] = useState([]);

  const [selectedReceiver, setSelectedReceiver] = useState(null);

  const [chatLoading, setChatLoading] = useState(false);

  const { showMessages } = useGlobalMessageContext();
  const [selectedAllMessages,setSelectedAllMessages]=useState(null);
  const containerRef=useRef(null)

  const textAreaRef = useRef(null);

  const socketRef = useRef(null);

  let pushNotification = async (content) => {
    if (Notification.permission === "granted") {
      new Notification("New Message", {
        body: content,
      });

      return;
    }

    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        new Notification("New Message", {
          body: content,
        });
      }

      return;
    }

    if (Notification.permission === "denied") {
      showMessages("Notifications are blocked by the user", "reject");
    }
  };

useEffect(() => {
  if (!user || loading) {
    return;
  }

  const socket = io(
    `${import.meta.env.VITE_BASE_URL}/message`,
    {
      withCredentials: true,
      transports: ["websocket"],
    }
  );

  socketRef.current = socket;

  // --------------------------------------------------------------------------
  // Connected
  // --------------------------------------------------------------------------

  socket.on("connect", () => {
    console.log(
      "Message socket connected:",
      socket.id
    );

    // Backend already knows the user from socket authentication
    socket.emit("join");

    // Get users for the left sidebar
    socket.emit("get_users");
  });

  // --------------------------------------------------------------------------
  // Users
  // --------------------------------------------------------------------------

  socket.on("users", (users) => {
    setUsers(
      Array.isArray(users)
        ? users
        : []
    );
  });

  // --------------------------------------------------------------------------
  // All messages
  // --------------------------------------------------------------------------

  socket.on("all_messages", (messages) => {
    setSelectedAllMessages(
      Array.isArray(messages)
        ? messages
        : []
    );
  });

  // --------------------------------------------------------------------------
  // Socket errors
  // --------------------------------------------------------------------------

  socket.on("message_error", (error) => {
    console.error(
      "Message socket error:",
      error
    );
  });

  socket.on("connect_error", (error) => {
    console.error(
      "Socket connection error:",
      error.message
    );
  });

  socket.on("disconnect", (reason) => {
    console.log(
      "Message socket disconnected:",
      reason
    );
  });

  // --------------------------------------------------------------------------
  // Cleanup
  // --------------------------------------------------------------------------

  return () => {
    console.log(
      "Closing message socket..."
    );

    socket.disconnect();

    socketRef.current = null;
  };

}, [user, loading]);

useEffect(() => {
  const socket = socketRef.current;

  if (!socket || !user) {
    return;
  }

  const handleNewMessage = async (message) => {

    const senderId =
      message.sender
        ?.toString()
        .trim();

    const receiverId =
      message.receiver
        ?.toString()
        .trim();

    const currentUserId =
      user._id
        ?.toString()
        .trim();


    // ------------------------------------------------------------------------
    // Find the other user
    // ------------------------------------------------------------------------

    const otherUserId =
      senderId === currentUserId
        ? receiverId
        : senderId;


    // ------------------------------------------------------------------------
    // Update users in left sidebar
    // ------------------------------------------------------------------------

    setUsers((previousUsers) => {

      const exists =
        previousUsers.some(
          (item) =>
            item._id
              ?.toString()
              .trim() === otherUserId
        );

      // User isn't currently in the sidebar
      if (!exists) {
        return previousUsers;
      }


      const updatedUsers =
        previousUsers.map((item) => {

          if (
            item._id
              ?.toString()
              .trim() === otherUserId
          ) {

            return {
              ...item,
              LastMessage: [message],
            };

          }

          return item;

        });


      // Move the user who just messaged
      // to the top of the list

      const changedUser =
        updatedUsers.find(
          (item) =>
            item._id
              ?.toString()
              .trim() === otherUserId
        );


      const remainingUsers =
        updatedUsers.filter(
          (item) =>
            item._id
              ?.toString()
              .trim() !== otherUserId
        );


      return [
        changedUser,
        ...remainingUsers
      ];

    });


    // ------------------------------------------------------------------------
    // Update currently opened conversation
    // ------------------------------------------------------------------------

    const selectedReceiverId =
      selectedReceiver?._id
        ?.toString()
        .trim();


    const isCurrentConversation =
      selectedReceiverId &&
      (
        selectedReceiverId === senderId ||
        selectedReceiverId === receiverId
      );


    if (isCurrentConversation) {

      setSelectedAllMessages(
        (previousMessages) => [
          ...previousMessages,
          message
        ]
      );

    }


    // ------------------------------------------------------------------------
    // Notification
    // ------------------------------------------------------------------------

    const isMyMessage =
      senderId === currentUserId;


    const isConversationOpen =
      selectedReceiverId === senderId;


    // Don't notify for your own message
    // Don't notify if the current conversation is open

    if (
      !isMyMessage &&
      !isConversationOpen
    ) {

      await pushNotification(
        message.content
      );

    }

  };


  // Register listener

  socket.on(
    "new_message",
    handleNewMessage
  );


  // --------------------------------------------------------------------------
  // Cleanup only this listener
  // --------------------------------------------------------------------------

  return () => {

    socket.off(
      "new_message",
      handleNewMessage
    );

  };

}, [selectedReceiver, user]);
useEffect(() => {
  const container = containerRef.current;

  if (!container) {
    return;
  }

  container.scrollTo({
    top: container.scrollHeight,
    behavior: "smooth",
  });
}, [selectedAllMessages]);

  const sendMessage = () => {
    if (!selectedReceiver?._id) {
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

    if (chatLoading) {
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

    setChatLoading(true);

    socketRef.current.emit("send_message", {
      receiverid: selectedReceiver._id,

      content,
    });

    textarea.value = "";

    textarea.style.height = "auto";

    textarea.style.overflowY = "hidden";

    setChatLoading(false);
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

  let handleSelectReceiver = (receiver) => {
    setSelectedReceiver(receiver);
    
    socketRef.current.emit("send_all_message", {
      receiverid: receiver._id,
    });
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
            />
          ))}
        </div>
      </div>

      <div className={styles.chatsright}>
        {selectedReceiver && (
          <>
            <div className={styles.chatsHeader}>
              <div className={styles.useravatar}>
                <img src={selectedReceiver.avatar} alt="" />
              </div>

              <div className={styles.username}>{selectedReceiver.Fullname}</div>
            </div>
             <div className={styles.chatmainholder} ref={containerRef}>

                {selectedAllMessages && Array.isArray(selectedAllMessages) && selectedAllMessages.map((message)=>{
                    return (
                        <div className={`${styles.messagerow} ${message.sender.toString().trim()===user._id.toString().trim()?styles.senderrow:styles.receiverrow}`}>
                            <div className={`${styles.messagemain} ${message.sender.toString().trim()===user._id.toString().trim()?styles.sendermessage:styles.receivermessage}`}>
                            {message.content}
                              
                            </div>
                          
                        </div>
                    )
                })}
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
                  onInput={handleTextareaInput}
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
    </div>
  );
};

export default MessageOutlet;
