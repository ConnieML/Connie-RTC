import { Call, Device } from "@twilio/voice-sdk";

import { useEffect, useRef, useState } from "react";
import { Reservation, Worker } from "twilio-taskrouter";
import { Activity } from "../taskrouterInterfaces";

/**
 * This is a pretty big custom React hook that contains all the
 * functionality needed to power the agent client view. This
 * hook contains information about the agent and any outgoing/incoming
 * calls as well as methods to initiate, modify, or end those calls
 *
 * This hook makes extensive use of event emitters to listen for events
 * and respond to them (i.e. incoming calls, user ended call, agent status)
 * Find out more about Event Emitters here: https://medium.com/swlh/what-the-heck-is-an-event-emitter-84407fce6cd3
 *
 */
export default function useCalls({
  email,
  workerSid,
  friendlyName,
}: {
  email: string;
  workerSid: string | undefined;
  friendlyName: string;
}) {
  const [initialized, setInitialized] = useState(false);
  const device = useRef<Device | null>(null);
  const worker = useRef<Worker | null>(null);
  const call = useRef<Call | null>(null);
  const agentActivities = useRef<Activity[] | null>(null);
  const checkEmail = useRef<string | null>(null);

  const [number, setNumber] = useState("");
  const [incomingCall, setIncomingCall] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [activityName, setActivityName] = useState<string>("Available");


  const initializeWorkerListeners = () => {
    if (!worker.current) return;

    worker.current.on("reservationCreated", (reservation: Reservation) => {
      console.log(
        `Reservation ${reservation.sid} has been created for ${
          worker.current!.sid
        }`
      );

      // change this to something else
      var audio = new Audio('https://assets.mixkit.co/active_storage/sfx/933/933-preview.mp3');
      audio.play();

      // taskSid.current = reservation.task.sid;
      // console.log(`Task attributes are: ${reservation.task.attributes}`);

      // reservation.on("accepted", async (acceptedReservation: Reservation) => {
      //   console.log(`Reservation ${acceptedReservation.sid} was accepted.`);

      //   try {
      //     // Turn agent activity status to reserved to prevent agent from receiving incoming calls
      //     const reservedActivity = agentActivities.current?.find(
      //       (activity) => activity.friendlyName === "Reserved"
      //     );

      //     await fetch(
      //       `/api/workers/?workspaceSid=${process.env.NEXT_PUBLIC_WORKSPACE_SID}&workerSid=${worker.current?.sid}`,
      //       {
      //         method: "PUT",
      //         body: JSON.stringify({
      //           activitySid: reservedActivity?.sid,
      //         }),
      //       }
      //     )
      //       .then(async (data) => {
      //         setActivityName(reservedActivity?.friendlyName ?? activityName);
      //       })
      //       .catch((e) => alert("Failed to update activity name"));
      //   } catch (e) {
      //     console.log(e);
      //   }
      // });

      // reservation.on("canceled", (acceptedReservation: Reservation) => {
      //   console.log(`Reservation ${acceptedReservation.sid} was canceled.`);
      //   setIncomingCall(false);
      //   call.current?.disconnect();
      // });
    });

  //   /**
  //    * This section handles any errors during the websocket connection
  //    */
  //   worker.current.on("disconnected", (reservation: Reservation) => {
  //     alert("You have been disconnected. Please refresh the page to reconnect");
  //   });

  //   worker.current.on("error", (reservation: Reservation) => {
  //     console.log(
  //       `Reservation ${reservation.sid} has been created for ${
  //         worker.current!.sid
  //       }`
  //     );

  //     alert("You have been disconnected. Please refresh the page to reconnect");
  //   });

  //   worker.current.on("tokenExpired", (reservation: Reservation) => {
  //     console.log(
  //       `Reservation ${reservation.sid} has been created for ${
  //         worker.current!.sid
  //       }`
  //     );

  //     alert("You have been disconnected. Please refresh the page to reconnect");
  //   });
  };

  const initializeDeviceListeners = () => {
    if (!device.current) return;

    device.current.on("registered", function () {
      console.log("Twilio.Device Ready to make and receive calls!");
    });
    
    device.current.on("error", function (error: { message: string }) {
      console.log("Twilio.Device Error: " + error.message);
    });

    device.current.on("incoming", (incomingCall: Call) => {
      setIncomingCall(true);
      setNumber(incomingCall.parameters.From);

      call.current = incomingCall;

      incomingCall.on("cancel", () => {
        setIncomingCall(false);
      });

      incomingCall.on("reject", () => {
        setIncomingCall(false);
        setNumber("");
      });

      incomingCall.on("disconnect", () => {
      
        // try {
        //   fetch(`/api/reservations?taskSid=${currentTask?.reservation?.taskSid}&status=completed&reservationSid=${currentTask?.reservation.sid}`, {
        //     method: 'PUT'
        //   })
        // } catch (error) {
        //   console.error("Error updating reservation", error)
        // }
        // try {
        //   fetch(`/api/tasks?taskSid=${currentTask?.reservation?.taskSid}&status=completed&reservationSid=${currentTask?.reservation.sid}`, {
        //     method: 'PUT'
        //   })
        // } catch (error) {
        //   console.error("Error updating reservation", error)
        // }
        // setCurrentTask(null);
        setInCall(false);
        setNumber("");
      });
    });
  };

  /**
   * This useEffect hook is what we use to initialize the device to facilitate
   * calls over the browser via WebRTC as well as the websocket connection
   * for sending real-time taskrouter updates
   */
  useEffect(() => {
    if (
      email &&
      email !== checkEmail.current &&
      !initialized &&
      workerSid !== undefined
    ) {
      checkEmail.current = email;
      const initializeCalls = async () => {
        await Promise.all([
          await initializeDevice(email, workerSid).then((newDevice) => {
            device.current = newDevice;
            initializeDeviceListeners();
          }),

          // TODO uncomment when taskrotuer implemented
          await initializeWorker(workerSid, email, friendlyName).then(
            async (newWorker) => {
              worker.current = newWorker!;
              console.log("NEWORKUS")
              initializeWorkerListeners();

              // await fetch(
              //   `/api/workers/?workspaceSid=${
              //     process.env.NEXT_PUBLIC_WORKSPACE_SID
              //   }&workerSid=${newWorker!.sid}`
              // ).then(async (data) => {
              //   const worker = await data.json();
              //   setActivityName(worker.worker.activityName);
              // });
            }
          ),

          // await fetch(
          //   `/api/activities/?workspaceSid=${process.env.NEXT_PUBLIC_WORKSPACE_SID}`
          // ).then(async (data) => {
          //   const activities = await data.json();
          //   agentActivities.current = activities.activities;
          // }),
        ]).then(() => setInitialized(true));
      };

      initializeCalls();
    }
  }, [initialized, email]);

  /**
   * We use this function to make an outbound call
   *
   * Note: for all outbound calls, we set the agent activity to "Reserved"
   * to prevent any incoming calls.
   *
   * TODO: If time permits, future cohorts should probably refactor
   * this logic to instead create a new task for outoging calls
   *
   * @param number the phone number to call
   *
   */

  const makeCall = async (number: string) => {
    if (!device.current) return;
    const params = {
      // get the phone number to call from the DOM
      To: number,
    };

    console.log("Making a call to", number);

    const newCall = await device.current.connect({ params });

    call.current = newCall;

    // TODO uncomment when taskrouter impelemnted
    // Turn agent activity status to reserved to prevent agent from receiving incoming calls
    // const reservedActivity = agentActivities.current?.find(
    //   (activity) => activity.friendlyName === "Reserved"
    // );

    // await fetch(
    //   `/api/workers/?workspaceSid=${process.env.NEXT_PUBLIC_WORKSPACE_SID}&workerSid=${worker.current?.sid}`,
    //   {
    //     method: "PUT",
    //     body: JSON.stringify({
    //       activitySid: reservedActivity?.sid,
    //     }),
    //   }
    // )
    //   .then(async (data) => {
    //     setActivityName(reservedActivity?.friendlyName ?? activityName);
    //   })
    //   .catch((e) => alert("Failed to update activity name"));

    setInCall(true);

    // Check if I should use this
    newCall.on("disconnect", () => {
      console.log("you disconnected");
      setInCall(false);
      setIncomingCall(false);
    });
  };

  /**
   * Reject an incoming call
   */
  function rejectCall() {
    if (!device.current) return;
    call.current?.reject();
    setIncomingCall(false);
  }

  /**
   * End a live call
   */
  function endCall() {
    if (!call.current) return;

    call.current.disconnect();
    setIncomingCall(false);
    setInCall(false);
    setNumber("");
  }

  /**
   * Accept an incoming call
   */
  const acceptCall = async () => {
    if (call.current === null) return;

    setIncomingCall(false);
    setInCall(true);
    call.current.accept();
  };

  /**
   * Cleanup function used to kill the
   * WebRTC and websocket connections
   * created by the voice and taskrouter client SDKs
   */
  const disconnectEverything = () => {
    device.current?.disconnectAll();
    device.current?.unregister();
    device.current?.destroy();

    worker.current?.disconnect();
  };

  return {
    activityName,
    agentActivities: agentActivities.current,
    initialized,
    inCall,
    incomingCall,
    worker: worker.current,
    number,
    makeCall,
    setActivityName,
    setNumber,
    acceptCall,
    endCall,
    rejectCall,
    disconnectEverything,
  };
}

/**
 *
 * This function initalizes a device so that users can have
 * voice calls over the browser
 *
 * @param client the user's email
 * this is the same value as the "client_url" in the worker's attribute
 *
 */
async function initializeDevice(client: string, workerSid: string) {
  console.log("Initializing device", client)
  const token = await fetch(
    `http://localhost:3000/api/token?client=${client}`
  );

  const value = await token.json();

  const device = new Device(value.token, {
    logLevel: 1,
    codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
  });

  await device.register();

  return device;
}

/**
 *
 * This function initializes a websocket connection between
 * the client app and Twilio to receive any taskrouter events
 * for a specific worker
 *
 * @param workerSid - the unique worker ID found in twilio
 * @param email  - the worker email
 * @param friendlyName - the friendly name found in Okta and Twliio
 *
 */
const initializeWorker = async (
  workerSid: string | undefined,
  email: string,
  friendlyName: string
) => {
  try {
    if (!workerSid) {
      throw `The user ${friendlyName} with email ${email} does not have an employeeNumber in Okta`;
    }
    const tokenResponse = await fetch(
      `/api/workerToken?email=${email}&workerSid=${workerSid}`
    );

    if (tokenResponse.status !== 200) {
      throw `Failed to generate valid token for ${friendlyName} with email ${email}`;
    }

    const token = await tokenResponse.json();

    const worker = new Worker(token);
    await timeout(1000); // For some reason, this is some much needed black magic
    return worker;
  } catch (e) {
    console.error(e);
  }
};

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
