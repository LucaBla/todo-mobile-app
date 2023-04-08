import Toast from 'react-native-root-toast';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://192.168.178.152:3000';

////////////////////////////////
//Get
////////////////////////////////
async function getTodos(authToken, setData, setLoading){
  try {
    const response = await fetch(`${API_URL}/api/v1/todo_tasks`, {
      method: "get",
      headers: {
        "Authorization": authToken,
      }
    })
    const json = await response.json();

    
    let today= new Date();
    let yesterday= new Date();

    yesterday.setDate(today.getDate() - 1)

    let newData = Object.values(json.reduce((acc, item) =>{
      let date = new Date(item.deadline)

      if(item.isAnytime){
        if(!acc['anytime']){
          acc['anytime'] = {
            title: 'anytime',
              data: []
          }
        }

        acc['anytime'].data.push(item);
        console.log(acc['anytime'].data);
      }
      else if(date <= yesterday){
        console.log("Hello There.");
        if(!acc['overdue']){
          acc['overdue'] = {
            title: 'overdue',
              data: []
          }
        }

        acc['overdue'].data.push(item);
      }
      else if(!item.isAnytime){
        if(!acc[item.deadline]) acc[item.deadline] = {
          title: item.deadline,
          data: []
        }

        acc[item.deadline].data.push(item);
      }
      return acc
    }, {}))
    setData(newData);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

////////////////////////////////

async function getNotificationsCount(authToken, setNotificationCount){
  try {
    const response = await fetch(`${API_URL}/api/v1/friendships/requests/count`, {
      method: "get",
      headers: {
        "Authorization": authToken,
      }
    })
    const json = await response.json();

    setNotificationCount(json);
  } catch (error) {
    console.error(error);
  }
}

////////////////////////////////

async function getCreator(authToken, setCreator, setLoading, participantsTodoID){
  try{
    const response = 
      await fetch (`${API_URL}/api/v1/todo_tasks/${participantsTodoID}/creator`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authToken,
        }
      })
    const json = await response.json();
    console.log(json);

    setCreator(json)
  } catch (error) {
    console.error(error);
  } finally{
    setLoading(false);
  }
}

////////////////////////////////

async function getParticipants(authToken, setParticipants, setCreator, setLoading, participantsTodoID){
  try{
    const response = 
      await fetch (`${API_URL}/api/v1/todo_tasks/${participantsTodoID}/participants`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authToken,
        }
      })
    const json = await response.json();
    console.log(json);

    setParticipants(json)
  } catch (error) {
    console.error(error);
  } finally{
    getCreator(authToken, setCreator, setLoading, participantsTodoID);
  }
}

////////////////////////////////

async function getFriends(authToken, setFriends, setLoading){
  try{
    const response = await fetch (`${API_URL}/api/v1/friendships`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authToken,
      }
    })
    const json = await response.json();

    setFriends(json)
  } catch (error) {
    console.error(error);
  } finally{
    setLoading(false);
  }
}

////////////////////////////////

async function getFriendrequests(authToken, setRequests, setLoading){
  try{
    const response = await fetch (`${API_URL}/api/v1/friendships/requests`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authToken,
      }
    })
    const json = await response.json();
    console.log(json);

    setRequests(json)
  } catch (error) {
    console.error(error);
  } finally{
    setLoading(false);
  }
}

////////////////////////////////
////////////////////////////////
////////////////////////////////



////////////////////////////////
//Post
////////////////////////////////

async function postTodo(title, deadline, description, isAnytime, participantsId, authToken, setCreating){
  const todoData = {
    todo_task:{
      title: title,
      deadline: deadline,
      description: description,
      finished: false,
      isAnytime: isAnytime,
      participants_id: participantsId
    }
  }

  try{
    const response = await fetch(`${API_URL}/api/v1/todo_tasks`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authToken
      },
      body: JSON.stringify(todoData),
    })

    if (!response.ok) {
      const message = `An error has occured: ${response.status} - ${response.statusText}`;
      throw new Error(message);
    }

    let toast = Toast.show('Todo created.', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP  + 80
    });

    setCreating(false);

  } catch(error){
    console.error(error);
    let toast = Toast.show('Todo creation failed.', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP  + 80
    });
  }
}

////////////////////////////////

async function postFriendships(email, authToken, setEmail){
  const friendshipData = {
    friendship:{
      friend_email: email,
    }
  }

  try{
    const response = await fetch (`${API_URL}/api/v1/friendships`, {
      method: "post",
      headers: {
        "Authorization": authToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(friendshipData),
    })
    
    let toast = Toast.show('Send friend request if user exists.', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP  + 80
    });

  }catch(error){
    console.error(error);
  } finally{
    setEmail('')
  }
}

////////////////////////////////

async function postUser(email, isValidPassword, password, confirmPassword, setAuthToken){
  if(!isValidPassword){
    console.error("Passwords invalid!");
    return
  }
  if(password !== confirmPassword){
    console.error("Passwords do not match");
    return
  }
  const logInData = {
    todo_user:{
      email: email,
      password: password,
    }
  }

  try{
    const response = await fetch(`${API_URL}/todo_users`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logInData),
    })

    if (!response.ok) {
      const message = `An error has occured: ${response.status} - ${response.statusText}`;
      throw new Error(message);
    }

    const data = await response;

    postLogIn(email, password, setAuthToken);
  } catch(error){
    console.error(error);
  }
}

////////////////////////////////

async function postLogIn(email, password, setAuthToken){
  const logInData = {
    todo_user:{
      email: email,
      password: password,
    }
  }

  try{
    const response = await fetch(`${API_URL}/todo_users/sign_in`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logInData),
    })
    
    const data = await response;
    const newAuthToken = data.headers.get('Authorization');

    console.log(newAuthToken);

    saveAuthToken(newAuthToken);
    setAuthToken(newAuthToken);

    let toast = Toast.show('Logged In.', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP  + 80
    });
  }catch(error){
        console.error(error);
        let toast = Toast.show('Login Failed.', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.TOP  + 80
        });
      }
}

////////////////////////////////

async function postResetPassword(email, setEmail){
  const resetData = {
    email: email
  }

  setEmail('');

  let toast = Toast.show('Instructions sent, if email exists.', {
    duration: Toast.durations.SHORT,
    position: Toast.positions.TOP  + 80
  });

  try{
    const response = await fetch(`${API_URL}/todo_users/password`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resetData),
    })

    if (!response.ok) {
      const message = `An error has occured: ${response.status} - ${response.statusText}`;
      throw new Error(message);
    }

  } catch(error){
    console.error(error);
  }
}

////////////////////////////////
////////////////////////////////
////////////////////////////////



////////////////////////////////
//Put
////////////////////////////////

async function handleUpdateTodo(finished, id, authToken, setData, setLoading){

  const todoData = {
    todo_task:{
      finished: !finished,
    }
  }

  try{
    const response = await fetch(`${API_URL}/api/v1/todo_tasks/${id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authToken
      },
      body: JSON.stringify(todoData),
    })

    if (!response.ok) {
      const message = `An error has occured: ${response.status} - ${response.statusText}`;
      throw new Error(message);
    }

    const data = await response.json();

    getTodos(authToken, setData, setLoading);
  }
  catch(error){
    console.error(error);
  }
}

////////////////////////////////

async function handleAcceptFriendshipNotification(removeItem, friendshipId, authToken){

  const acceptData = {
    friendship:{
      accepted: true,
    }
  }

  try{
    removeItem(friendshipId);
    const response = await fetch(`${API_URL}/api/v1/friendships/${friendshipId}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authToken
      },
      body: JSON.stringify(acceptData),
    })

    if (!response.ok) {
      const message = `An error has occured: ${response.status} - ${response.statusText}`;
      throw new Error(message);
    }

    const data = await response.json();

  }
  catch(error){
    console.error(error);
  }
}

////////////////////////////////
////////////////////////////////
////////////////////////////////

////////////////////////////////
//Delete
////////////////////////////////

async function handleDeleteTodo(removeItem, id, authToken){
  try{
    removeItem(id);
    const response = await fetch(`${API_URL}/api/v1/todo_tasks/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authToken
      }
    })

    if (!response.ok) {
      const message = `An error has occured: ${response.status} - ${response.statusText}`;
      throw new Error(message);
    }

    const data = await response.json();
    
  }
  catch(error){
    console.error(error);
  }
};

////////////////////////////////

async function handleDeleteFriendship(friendId, removeItem, authToken){
  const friendIdData = {
    friendship:{
      friend_id: friendId,
    }
  }

  try{
    removeItem(friendId);
    const response = await fetch(`${API_URL}/api/v1/friendships`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authToken
      },
      body: JSON.stringify(friendIdData)
    })

    if (!response.ok) {
      const message = `An error has occured: ${response.status} - ${response.statusText}`;
      throw new Error(message);
    }

    const data = await response.json();
    
  }
  catch(error){
    console.error(error);
  }
};

////////////////////////////////

async function handleDeleteFriendshipNotification(removeItem, friendshipId, authToken){
  try{
    removeItem(friendshipId);
    const response = await fetch(`${API_URL}/api/v1/friendships/${friendshipId}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authToken
      }
    })

    if (!response.ok) {
      const message = `An error has occured: ${response.status} - ${response.statusText}`;
      throw new Error(message);
    }

    const data = await response.json();
    
  }
  catch(error){
    console.error(error);
  }
};

////////////////////////////////

async function handleLogOut(setAuthToken, authToken){
  setAuthToken(null);
  try {
    const response = await fetch(`${API_URL}/todo_users/sign_out`, {
      method: "delete",
      headers: {
        "Authorization": authToken,
      }
    })

    let toast = Toast.show('Logged Out.', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP  + 80
    });

    deleteToken();
  } catch (error) {
    console.error(error);
  }
}

////////////////////////////////
////////////////////////////////
////////////////////////////////

async function saveAuthToken(newAuthToken){
  try {
    await SecureStore.setItemAsync('authToken', newAuthToken);
  } catch (error) {
    console.log(error);
  }
}

async function deleteToken() {
  try {
    await SecureStore.deleteItemAsync('authToken');
  } catch (error) {
    console.log(error);
  }
}

export { getTodos,
         getNotificationsCount,
         getCreator,
         getParticipants,
         getFriends, 
         getFriendrequests,
         postTodo,
         postFriendships,
         postUser,
         postLogIn, 
         postResetPassword, 
         handleUpdateTodo,
         handleAcceptFriendshipNotification,
         handleDeleteTodo,
         handleDeleteFriendship, 
         handleDeleteFriendshipNotification,
         handleLogOut
       };