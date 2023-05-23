import { useState, useEffect } from 'react';

const useDynamoHistory = (initialArr, field, id, preventDuplicates = false, replaceDuplicate = false) => {
  if (!Array.isArray(initialArr)) {
    throw new Error('initialArr must be an array.');
  }

  const [history, setHistory] = useState(initialArr);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (history.length === 0) {
      setCurrentIndex(0);
    } else {
      const newIndex = history.findIndex(e => e[field] === id);
      setCurrentIndex(newIndex >= 0 ? newIndex : 0);
    }
  }, [id]);

  useEffect(() => {
    // Assign the type of the first object as primary if not explicitly specified
    if (history.length > 0 && !history[0].type) {
      setHistory(prevHistory => {
        const updatedFirstObj = { ...prevHistory[0], type: 'primary' };
        return [updatedFirstObj, ...prevHistory.slice(1)];
      });
    }
  }, [history]);

  const getNextIndex = () => (currentIndex + 1 >= history.length ? false : currentIndex + 1);
  const getPreviousIndex = () => (currentIndex - 1 < 0 ? false : currentIndex - 1);

  const next = () => {
    if (history.length === 0) return false;
    const nextIndex = getNextIndex();
    return nextIndex !== false ? history[nextIndex] : false;
  };

  const current = () => (currentIndex >= 0 && currentIndex < history.length ? history[currentIndex] : false);

  const previous = () => {
    if (history.length === 0) return false;
    const previousIndex = getPreviousIndex();
    return previousIndex !== false ? history[previousIndex] : false;
  };

  const goToStart = () => {
    if (history.length === 0) return;
    setCurrentIndex(0);
  };

  const goTo = (newId, removeAfter = false) => {
    if (history.length === 0) return;
    const newIndex = history.findIndex(e => e[field] === newId);
    if (newIndex >= 0) {
      setCurrentIndex(newIndex);
      if (removeAfter) {
        removeAfterIndex(newIndex);
      }
    }
  };

  const goNext = () => {
    if (history.length === 0) return;
    const nextIndex = getNextIndex();
    if (nextIndex !== false) {
      setCurrentIndex(nextIndex);
    }
  };

  const goToIndex = (index, removeAfter = false) => {
    if (history.length === 0) return;
    if (index >= 0 && index < history.length) {
      setCurrentIndex(index);
      if (removeAfter) {
        removeAfterIndex(index);
      }
    }
  };

  const goBack = (removeAfter = false) => {
    if (history.length === 0) return;
    const previousIndex = getPreviousIndex();
    if (previousIndex !== false) {
      setCurrentIndex(previousIndex);
      if (removeAfter) {
        removeAfterIndex(previousIndex);
      }
    }
  };

  const goBackToPrimary = (removeAfter = false, skipSecondary = true) => {
    if (history.length === 0) return;
  
    let previousIndex = currentIndex - 1;
    if (skipSecondary) {
      while (previousIndex >= 0 && history[previousIndex].type === 'secondary') {
        previousIndex--;
      }
    }
  
    if (previousIndex >= 0) {
      setCurrentIndex(previousIndex);
      if (removeAfter) {
        removeAfterIndex(previousIndex);
      }
    }
  };

  const goForwardToType = (removeAfter = false, skipSecondary = true, type = "primary") => {
    if (history.length === 0) return;
  
    let nextIndex = currentIndex + 1;
    if (skipSecondary) {
      while (nextIndex < history.length && history[nextIndex].type !== type) {
        nextIndex++;
      }
    }
    
    if (nextIndex < history.length) {
      setCurrentIndex(nextIndex);
      if (removeAfter) {
        removeAfterIndex(nextIndex);
      }
    }
  };

  const goToEnd = () => {
    if (history.length === 0) return;
    setCurrentIndex(history.length - 1);
  };

  const insertObjectAtIndex = (object, insertIndex) => {
    if(insertIndex > history.length) return;
    const newArray = [...history];
    newArray.splice(insertIndex, 0, object);
    setHistory(newArray);
    setCurrentIndex(insertIndex);
  };

  const insertObject = (object, insertIndex, customIgnoreDuplicates = false, customReplaceDuplicate = undefined) => {
    if (preventDuplicates && !customIgnoreDuplicates) {
      const existingIndex = history.findIndex(e => e[field] === object[field]);
      if (existingIndex !== -1) {
        if (customReplaceDuplicate !== undefined ? customReplaceDuplicate : replaceDuplicate) {
          const newArray = [...history];
          newArray[existingIndex] = object;
          setHistory(newArray);
          setCurrentIndex(existingIndex); // Update current index to reflect the new position
        } else {
          setCurrentIndex(existingIndex); // Update current index to the existing position
        }
        return; // Duplicate object found, do not insert or replace
      }
    }
  
    const previousObject = previous();
    const objectType = previousObject && previousObject.type === 'primary' ? 'secondary' : 'primary';
  
    const objectWithDefaultType = {
      ...object,
      ...(!object.type && {type: objectType}),
    };
  
    if (insertIndex !== undefined) {
      insertObjectAtIndex(objectWithDefaultType, insertIndex);
    } else {
      setHistory([...history, objectWithDefaultType]);
      setCurrentIndex(history.length);
    }
  };

  const updateCurrent = (updatedObject) => {
    if (history.length === 0) return;
  
    // If the current object is the first object and its type is secondary,
    // replace the type with "primary"
    if (currentIndex === 0 && updatedObject.type === 'secondary') {
      updatedObject.type = 'primary';
    }
  
    const updatedArray = [...history];
    updatedArray[currentIndex] = updatedObject;
    setHistory(updatedArray);
  };

  const updateObjectById = (updatedObject) => {
    if (history.length === 0) return;

    // If the current object is the first object and its type is secondary,
    // replace the type with "primary"
    if (currentIndex === 0 && updatedObject.type === 'secondary') {
      updatedObject.type = 'primary';
    }

    const index = history.findIndex(e => e[field] === updatedObject[field]);
    if (index !== -1) {
      const updatedArray = [...history];
      updatedArray[index] = updatedObject;
      setHistory(updatedArray);
    }
  };
  
  const removeObjectByIndex = removeIndex => {
    if (removeIndex >= 0 && removeIndex < history.length) {
      const newArray = [...history];
      newArray.splice(removeIndex, 1);
      setHistory(newArray);

      // Adjust the current index if the removed item is before the current index
      if (removeIndex < currentIndex) {
        setCurrentIndex(currentIndex - 1);
      }
      // Set the current index to the last item if it was the last item that got removed
      if (currentIndex >= history.length - 1) {
        setCurrentIndex(history.length - 2);
      }
    }
  };

  const removeObjectByName = removeName => {
    const removeIndex = history.findIndex(e => e[field] === removeName);
    removeObjectByIndex(removeIndex);
  };

  const removeAtIndex = index => {
    if (index >= 0 && index < history.length) {
      const newArr = [...history];
      newArr.splice(index, 1);
      setHistory(newArr);
      if (currentIndex >= history.length) {
        setCurrentIndex(history.length > 0 ? history.length - 1 : 0);
      }
    }
  };

  const removeByName = name => {
    const index = history.findIndex(e => e[field] === name);
    if (index !== -1) {
      removeAtIndex(index);
    }
  };

  const removeFirst = () => {
    if (history.length > 0) {
      removeAtIndex(0);
    }
  };

  const removeLast = () => {
    if (history.length > 0) {
      removeAtIndex(history.length - 1);
    }
  };

  const removeAll = () => {
    setHistory([]);
    setCurrentIndex(0);
  };

  const removeAfterIndex = index => {
    if (index >= 0 && index < history.length - 1) {
      const newArr = [...history];
      newArr.splice(index + 1);
      setHistory(newArr);
      if (currentIndex >= history.length) {
        setCurrentIndex(history.length > 0 ? history.length - 1 : 0);
      }
    }
  };

  const getHistory = () => {
    const historyDict = {};
    history.forEach((obj, index) => {
      const objId = obj[field];
      historyDict[objId] = obj;
    });
    return historyDict;
  };

  return {
    history,
    currentIndex,
    next,
    current,
    previous,
    goToStart,
    goTo,
    goNext,
    goToIndex,
    goBack,
    goToEnd,
    insertObject,
    insertObjectAtIndex,
    removeAtIndex,
    removeByName,
    removeFirst,
    removeLast,
    removeAll,
    removeAfterIndex,
    removeObjectByIndex,
    removeObjectByName,
    updateCurrent,
    goBackToPrimary,
    updateObjectById,
    goForwardToType,
    getHistory
  };
};

export default useDynamoHistory;

// import { useState, useEffect } from 'react';

// const useNavigatableObjectsArray = (initialArr, field, id, preventDuplicates = false, replaceDuplicate = false) => {
//   if (!Array.isArray(initialArr)) {
//     throw new Error('initialArr must be an array.');
//   }

//   const [history, setHistory] = useState(initialArr);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     if (history.length === 0) {
//       setCurrentIndex(0);
//       return;
//     }

//     const newIndex = history.findIndex(e => e[field] === id);
//     setCurrentIndex(newIndex >= 0 ? newIndex : 0);
//   }, [history, field, id]);

//   const getNextIndex = () => (currentIndex + 1 >= history.length ? false : currentIndex + 1);
//   const getPreviousIndex = () => (currentIndex - 1 < 0 ? false : currentIndex - 1);

//   const next = () => {
//     if (history.length === 0) return false;
//     const nextIndex = getNextIndex();
//     return nextIndex !== false ? history[nextIndex] : false;
//   };

//   const current = () => (currentIndex >= 0 && currentIndex < history.length ? history[currentIndex] : false);

//   const previous = () => {
//     if (history.length === 0) return false;
//     const previousIndex = getPreviousIndex();
//     return previousIndex !== false ? history[previousIndex] : false;
//   };

//   const goToStart = () => {
//     if (history.length === 0) return;
//     setCurrentIndex(0);
//   };

//   const goTo = (newId, removeAfter = false) => {
//     if (history.length === 0) return;
//     const newIndex = history.findIndex(e => e[field] === newId);
//     if (newIndex >= 0) {
//       setCurrentIndex(newIndex);
//       if (removeAfter) {
//         removeAfterIndex(newIndex);
//       }
//     }
//   };

//   const goNext = () => {
//     if (history.length === 0) return;
//     const nextIndex = getNextIndex();
//     if (nextIndex !== false) {
//       setCurrentIndex(nextIndex);
//     }
//   };

//   const goToIndex = (index, removeAfter = false) => {
//     if (history.length === 0) return;
//     if (index >= 0 && index < history.length) {
//       setCurrentIndex(index);
//       if (removeAfter) {
//         removeAfterIndex(index);
//       }
//     }
//   };

//   const goToEnd = () => setCurrentIndex(history.length - 1);

//   const goBack = (removeAfter = false) => {
//     if (history.length === 0) return;
//     const previousIndex = getPreviousIndex();
//     if (previousIndex !== false) {
//       setCurrentIndex(previousIndex);
//       if (removeAfter) {
//         removeAfterIndex(previousIndex);
//       }
//     }
//   };

//   const insertObject = (obj, insertIndex = history.length, preventDuplicates = false, replaceDuplicate = false) => {
//     if (preventDuplicates) {
//       const duplicateIndex = history.findIndex(e => e[field] === obj[field]);
//       if (duplicateIndex !== -1) {
//         if (replaceDuplicate) {
//           const newArr = [...history];
//           newArr.splice(duplicateIndex, 1, obj);
//           setHistory(newArr);
//           setCurrentIndex(history.length > 0 ? currentIndex : 0);
//         }
//         return;
//       }
//     }
//     const newArr = [...history];
//     newArr.splice(insertIndex, 0, obj);
//     setHistory(newArr);
//     setCurrentIndex(history.length > 0 ? currentIndex : 0);
//   };

//   const removeAtIndex = index => {
//     if (history.length === 0 || index < 0 || index >= history.length) return;
//     const newArr = [...history];
//     newArr.splice(index, 1);
//     setHistory(newArr);
//     setCurrentIndex(history.length > 0 ? currentIndex : 0);
//   };

//   const removeByName = name => {
//     if (history.length === 0) return;
//     const index = history.findIndex(e => e[field] === name);
//     if (index !== -1) {
//       removeAtIndex(index);
//     }
//   };

//   const removeFirst = () => {
//     removeAtIndex(0);
//   };

//   const removeLast = () => {
//     removeAtIndex(history.length - 1);
//   };

//   const removeAll = () => {
//     setHistory([]);
//     setCurrentIndex(0);
//   };

//   const removeAfterIndex = index => {
//     if (index < 0 || index >= history.length - 1) return;
//     const newArr = history.slice(0, index + 1);
//     setHistory(newArr);
//     setCurrentIndex(index);
//   };

//   return {
//     history,
//     next,
//     current,
//     previous,
//     goToStart,
//     goTo,
//     goNext,
//     goToEnd,
//     goBack,
//     goToIndex,
//     insertObject,
//     removeAtIndex,
//     removeByName,
//     removeFirst,
//     removeLast,
//     removeAll,
//     removeAfterIndex,
//     currentIndex
//   };
// };

// export default useNavigatableObjectsArray;

// // import { useState, useEffect } from 'react';

// // const useNavigatableObjectsArray = (initialArr, field, id, preventDuplicates = false, replaceDuplicate = false) => {
// //   const [history, setHistory] = useState(initialArr);
// //   const [currentIndex, setCurrentIndex] = useState(0);

// //   useEffect(() => {
// //     const newIndex = history.map(e => e[field]).indexOf(id);
// //     setCurrentIndex(newIndex >= 0 ? newIndex : 0);
// //   }, [history, field, id]);

// //   useEffect(() => {
// //     const newIndex = history.findIndex(e => e[field] === history[currentIndex][field]);
// //     setCurrentIndex(newIndex >= 0 ? newIndex : 0);
// //   }, [history, field, currentIndex]);

// //   const getNextIndex = () => (currentIndex + 1 >= history.length ? false : currentIndex + 1);
// //   const getPreviousIndex = () => (currentIndex - 1 < 0 ? false : currentIndex - 1);

// //   const next = () => {
// //     const nextIndex = getNextIndex();
// //     return nextIndex !== false ? history[nextIndex] : false;
// //   };

// //   const current = () => (currentIndex >= 0 && currentIndex < history.length ? history[currentIndex] : false);

// //   const previous = () => {
// //     const previousIndex = getPreviousIndex();
// //     return previousIndex !== false ? history[previousIndex] : false;
// //   };

// //   const goToStart = () => setCurrentIndex(0);

// //   // const goTo = newId => {
// //   //   const newIndex = history.map(e => e[field]).indexOf(newId);
// //   //   if (newIndex >= 0) setCurrentIndex(newIndex);
// //   // };

// //   const goTo = (newId, removeAfter = false) => {
// //     const newIndex = history.map(e => e[field]).indexOf(newId);
// //     if (newIndex >= 0) {
// //       setCurrentIndex(newIndex);
// //       if (removeAfter) {
// //         removeAfterIndex(newIndex);
// //       }
// //     }
// //   };

// //   const goNext = () => {
// //     const nextIndex = getNextIndex();
// //     if (nextIndex !== false) setCurrentIndex(nextIndex);
// //   };

// //   // const goBack = () => {
// //   //   const previousIndex = getPreviousIndex();
// //   //   if (previousIndex !== false) setCurrentIndex(previousIndex);
// //   // };

// //   const goToEnd = () => setCurrentIndex(history.length - 1);

// //   // const goToIndex = index => {
// //   //   if (index >= 0 && index < history.length) {
// //   //     setCurrentIndex(index);
// //   //   }
// //   // };

// //   const goToIndex = (index, removeAfter = false) => {
// //     if (index >= 0 && index < history.length) {
// //       setCurrentIndex(index);
// //       if (removeAfter) {
// //         removeAfterIndex(index);
// //       }
// //     }
// //   };

// //   const goBack = (removeAfter = false) => {
// //     const previousIndex = getPreviousIndex();
// //     if (previousIndex !== false) {
// //       setCurrentIndex(previousIndex);
// //       console.log(removeAfter, 'removeAfter');
// //       if (removeAfter) {
// //         removeAfterIndex(previousIndex);
// //       }
// //     }
// //   };

// //   const insertObjectAtIndex = (object, insertIndex) => {
// //     const newArray = [...history];
// //     newArray.splice(insertIndex, 0, object);
// //     setHistory(newArray);
// //     setCurrentIndex(insertIndex);
// //   };

// //   const insertObject = (object, insertIndex, ignoreDuplicates = false, customReplaceDuplicate = undefined) => {
// //     if (preventDuplicates && !ignoreDuplicates) {
// //       const existingIndex = history.findIndex(e => e[field] === object[field]);
// //       if (existingIndex !== -1) {
// //         if (customReplaceDuplicate !== undefined ? customReplaceDuplicate : replaceDuplicate) {
// //           const newArray = [...history];
// //           newArray[existingIndex] = object;
// //           setHistory(newArray);
// //           setCurrentIndex(existingIndex); // Update current index to reflect the new position
// //         } else {
// //           setCurrentIndex(existingIndex); // Update current index to the existing position
// //         }
// //         return; // Duplicate object found, do not insert or replace
// //       }
// //     }

// //     if (insertIndex !== undefined) {
// //       insertObjectAtIndex(object, insertIndex);
// //     } else {
// //       setHistory([...history, object]);
// //       setCurrentIndex(history.length);
// //     }
// //   };

// //   const removeObjectByIndex = removeIndex => {
// //     if (removeIndex >= 0 && removeIndex < history.length) {
// //       const newArray = [...history];
// //       newArray.splice(removeIndex, 1);
// //       setHistory(newArray);

// //       // Adjust the current index if the removed item is before the current index
// //       if (removeIndex < currentIndex) {
// //         setCurrentIndex(currentIndex - 1);
// //       }
// //       // Set the current index to the last item if it was the last item that got removed
// //       if (currentIndex >= history.length - 1) {
// //         setCurrentIndex(history.length - 2);
// //       }
// //     }
// //   };

// //   const removeObjectByName = removeName => {
// //     const removeIndex = history.findIndex(e => e[field] === removeName);
// //     removeObjectByIndex(removeIndex);
// //   };

// //   const removeAfterIndex = removeIndex => {
// //     if (removeIndex >= 0 && removeIndex < history.length - 1) {
// //       const newArray = history.slice(0, removeIndex + 1);
// //       setHistory(newArray);
// //       setCurrentIndex(Math.min(currentIndex, newArray.length - 1));
// //     }
// //   };

// //   return {
// //     history,
// //     next,
// //     current,
// //     previous,
// //     goToStart,
// //     goTo,
// //     goNext,
// //     goBack,
// //     goToEnd,
// //     goToIndex,
// //     insertObject,
// //     removeObjectByIndex,
// //     removeObjectByName,
// //     removeAfterIndex
// //   };
// // };

// // export default useNavigatableObjectsArray;
// // // Usage example:
// // // const MyComponent = () => {
// // //   const initialData = [
// // //     { id: 1, name: 'Object 1' },
// // //     { id: 2, name: 'Object 2' },
// // //     { id: 3, name: 'Object 3' }
// // //   ];

// // //   const navigatableArray = useNavigatableObjectsArray(initialData, 'id', 2);

// // //   const handleInsertObject = () => {
// // //     const newObject = { id: 4, name: 'Object 4' };
// // //     const insertIndex = 2; // Insert at index 2
// // //     navigatableArray.insertObject(newObject, insertIndex);
// // //   };

// // //   const handleInsertObjectAtEnd = () => {
// // //     const newObject = { id: 5, name: 'Object 5' };
// // //     navigatableArray.insertObject(newObject);
// // //   };

// // //   return (
// // //     <div>
// // //       <button onClick={navigatableArray.goToStart}>Go to Start</button>
// // //       <button onClick={navigatableArray.goNext}>Go Next</button>
// // //       <button onClick={navigatableArray.goBack}>Go Back</button>
// // //       <button onClick={navigatableArray.goToEnd}>Go to End</button>
// // //       <button onClick={handleInsertObject}>Insert Object at Index</button>
// // //       <button onClick={handleInsertObjectAtEnd}>Insert Object at End</button>
// // //       <div>
// // //         Current Object: {navigatableArray.current()?.name}
// // //       </div>
// // //       <ul>
// // //         {navigatableArray.history.map(obj => (
// // //           <li key={obj.id}>{obj.name}</li>
// // //         ))}
// // //       </ul>
// // //     </div>
// // //   );
// // // };




  // const insertObject = (obj, insertIndex = history.length, preventDuplicates = false, replaceDuplicate = false) => {
  //   if (preventDuplicates) {
  //     const duplicateIndex = history.findIndex(e => e[field] === obj[field]);
  //     if (duplicateIndex !== -1) {
  //       if (replaceDuplicate) {
  //         const newArr = [...history];
  //         newArr.splice(duplicateIndex, 1, obj);
  //         setHistory(newArr);
  //         setCurrentIndex(history.length > 0 ? currentIndex : 0);
  //       }
  //       return;
  //     }
  //   }
  //   const newArr = [...history];
  //   newArr.splice(insertIndex, 0, obj);
  //   setHistory(newArr);
  //   setCurrentIndex(history.length > 0 ? currentIndex : 0);
  // };

  // const insertObjectAtIndex = (obj, index, preventDuplicates = false, replaceDuplicate = false) => {
  //   if (preventDuplicates) {
  //     const duplicateIndex = history.findIndex(e => e[field] === obj[field]);
  //     if (duplicateIndex !== -1) {
  //       if (replaceDuplicate) {
  //         const newArr = [...history];
  //         newArr.splice(duplicateIndex, 1, obj);
  //         setHistory(newArr);
  //         setCurrentIndex(history.length > 0 ? currentIndex : 0);
  //       }
  //       return;
  //     }
  //   }
  //   const newArr = [...history];
  //   newArr.splice(index, 0, obj);
  //   setHistory(newArr);
  //   setCurrentIndex(history.length > 0 ? currentIndex : 0);
  // };

    // const updateCurrent = (updatedObject) => {
  //   if (history.length === 0) return;
  //   const updatedArray = [...history];
  //   updatedArray[currentIndex] = updatedObject;
  //   setHistory(updatedArray);
  // };

    // const insertObjectOLD = (object, insertIndex, customIgnoreDuplicates = false, customReplaceDuplicate = undefined) => {
  //   if (preventDuplicates && !customIgnoreDuplicates) {
  //     const existingIndex = history.findIndex(e => e[field] === object[field]);
  //     if (existingIndex !== -1) {
  //       if (customReplaceDuplicate !== undefined ? customReplaceDuplicate : replaceDuplicate) {
  //         const newArray = [...history];
  //         newArray[existingIndex] = object;
  //         setHistory(newArray);
  //         setCurrentIndex(existingIndex); // Update current index to reflect the new position
  //       } else {
  //         setCurrentIndex(existingIndex); // Update current index to the existing position
  //       }
  //       return; // Duplicate object found, do not insert or replace
  //     }
  //   }

  //   if (insertIndex !== undefined) {
  //     insertObjectAtIndex(object, insertIndex);
  //   } else {
  //     setHistory([...history, object]);
  //     setCurrentIndex(history.length);
  //   }
  // };

    

  // useEffect(() => {
  //   if (history.length === 0) {
  //     setCurrentIndex(0);
  //     return;
  //   }

  //   const newIndex = history.findIndex(e => e[field] === id);
  //   setCurrentIndex(newIndex >= 0 ? newIndex : 0);
  // }, [history, field, id]);

  // useEffect(() => {
  //   if (history.length === 0) {
  //     setCurrentIndex(0);
  //     return;
  //   }

  //   const newIndex = history.findIndex(e => e[field] === history[currentIndex][field]);
  //   // setCurrentIndex(newIndex >= 0 ? newIndex : 0);
  // }, [history, currentIndex]);

  // console.log(newIndex, 'useEffect [history, field, id]')
  // console.log(newIndex, 'useEffect [history, field, currentIndex]')