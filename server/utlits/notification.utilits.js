
import logo from "../"
import logo from "../../assets/image.svg";


export const sendBrowserNotification = async ({
  title = "Notification",
  body = "",
  icon = "/favicon.ico",
  badge = "/favicon.ico",
  tag,
  data = {},
  onClick,
} = {}) => {
  // Browser doesn't support notifications
  if (!("Notification" in window)) {
    console.warn("Browser notifications are not supported.");
    return false;
  }

  // Request permission if not decided yet
  if (Notification.permission === "default") {
    try {
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        return false;
      }
    } catch (error) {
      console.error("Notification permission request failed:", error);
      return false;
    }
  }

  // User denied notification permission
  if (Notification.permission !== "granted") {
    return false;
  }

  // Create notification
  try {
    const notification = new Notification(title, {
      body,
      icon,
      badge,
      tag,
      data,
    });

    notification.onclick = (event) => {
      event.preventDefault();

      window.focus();

      if (onClick) {
        onClick(event, notification);
      }

      notification.close();
    };

    return notification;
  } catch (error) {
    console.error("Failed to send browser notification:", error);
    return false;
  }
};