import logo from "../assets/image.svg";

export const sendBrowserNotification = async ({
  title = "Notification",
  body = "",
  icon = logo,
  badge,
  tag = "skillora-message",
  data = {},
  onClick,
} = {}) => {
  // --------------------------------------------------
  // 1. Browser support
  // --------------------------------------------------
  if (typeof window === "undefined") {
    return false;
  }

  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications.");
    return false;
  }

  // --------------------------------------------------
  // 2. Permission
  // --------------------------------------------------
  let permission = Notification.permission;

  if (permission === "default") {
    try {
      permission = await Notification.requestPermission();
    } catch (error) {
      console.error(
        "Failed to request notification permission:",
        error
      );

      return false;
    }
  }

  if (permission !== "granted") {
    console.warn(
      "Notification permission is not granted:",
      permission
    );

    return false;
  }

  // --------------------------------------------------
  // 3. Create notification
  // --------------------------------------------------
  try {
    const notification = new Notification(title, {
      body,
      icon,
      ...(badge ? { badge } : {}),
      tag,
      data,
    });

    notification.onclick = (event) => {
      event.preventDefault();

      try {
        window.focus();
      } catch (error) {
        console.warn("Could not focus window:", error);
      }

      if (typeof onClick === "function") {
        onClick(event, notification);
      }

      notification.close();
    };

    notification.onerror = (error) => {
      console.error("Browser notification error:", error);
    };

    return notification;
  } catch (error) {
    console.error(
      "Failed to create browser notification:",
      error
    );

    return false;
  }
};