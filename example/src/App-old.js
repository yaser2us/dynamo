import React, { useRef, useEffect, useState } from 'react'

import { DynoBuilder } from 'dynamo'
// import 'dynamo/dist/index.css'

// Custom hook for managing the event bus
function useEventBus() {
  const listenersRef = useRef({});

  function subscribe(eventName, callback) {
    if (!listenersRef.current[eventName]) {
      listenersRef.current[eventName] = [];
    }
    listenersRef.current[eventName].push(callback);
  }

  function emit(eventName, data) {
    const listeners = listenersRef.current[eventName];
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  return { subscribe, emit };
}

// 

// Example components using the event bus
function SenderComponent({ eventBus }) {
  useEffect(() => {
    setInterval(() => {
      eventBus.emit('wow3', 'Hello from SenderComponent! wow3' + Date.now());
    }, 2000);
  }, [eventBus]);

  console.log("SenderComponent ;)")
  return <div>Sender Component</div>;
}

function ReceiverComponent({ eventBus, name }) {

  console.log("ReceiverComponent ;)", name)

  const [logs, setData] = useState([])
  useEffect(() => {
    const handleEvent = data => {
      setData([data])
      console.log('Received event:', data);
    };

    eventBus.subscribe(name, handleEvent);

    return () => {
      eventBus.unsubscribe(name, handleEvent);
    };
  }, [eventBus]);

  return (<div>Receiver Component - {name}
    {logs?.map(el => {
      return <p>{el}</p>
    })}
  </div>);
}

const App = () => {
  const eventBus = useEventBus();

  return (
    <div>
      <SenderComponent eventBus={eventBus} />
      {[1,2,3,4,5,6].map((el,index) => {
        return       <ReceiverComponent name={`wow${el}`} eventBus={eventBus} />

      })}
    </div>
  );
}

export default App
