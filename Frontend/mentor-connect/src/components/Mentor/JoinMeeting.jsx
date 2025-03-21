import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./JoinMeeting.css";

const JoinMeeting = ( {studentName} ) => {
  const jitsiContainer = useRef(null);

  useEffect(() => {
    if (!studentName) return;

    const domain = "meet.jit.si";
    const options = {
      roomName: `MentorMeeting_${studentName.replace(/\s+/g, "_")}`,
      width: "100%",
      height: "600px",
      parentNode: jitsiContainer.current,
      configOverwrite: {
        startWithAudioMuted: true,
        startWithVideoMuted: true,
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: ["microphone", "camera", "chat", "desktop", "fullscreen", "hangup"],
      },
    };

    const api = new window.JitsiMeetExternalAPI(domain, options);
    return () => api.dispose();
  }, [studentName]);

  return (
    <div className="meeting-container">
      <h2>Meeting with {studentName}</h2>
      <div className="meeting-frame" ref={jitsiContainer}></div>
    </div>
  );
};

export default JoinMeeting;
