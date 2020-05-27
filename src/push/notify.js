import React, { useEffect, useState } from 'react';
import { Text, View, Button, Vibration, Platform } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

export default function Notify(){

    const [expoPushToken, setPushToken] = useState('');
    const [notify, setNotify] = useState('');
  
  
    async function registerForPushNotificationsAsync(){
      if (Constants.isDevice) {
        const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;
  
        if (existingStatus !== 'granted') {
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          finalStatus = status;
        }
  
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
  
        const token = await Notifications.getExpoPushTokenAsync();
        console.log(token);
        setPushToken(token);
      } 
  
      else {
        alert('Must use physical device for Push Notifications');
      }
  
      if (Platform.OS === 'android') {
        Notifications.createChannelAndroidAsync('default', {
          name: 'default',
          sound: true,
          priority: 'max',
          vibrate: [0, 250, 250, 250],
        });
      }
  
    };
  
    useEffect(()=>{
      registerForPushNotificationsAsync();
      const notificationSubscription = Notifications.addListener(handleNotification);
    });
      
  
      // Handle notifications that are received or selected while the app
      // is open. If the app was closed and then opened by tapping the
      // notification (rather than just tapping the app icon to open it),
      // this function will fire on the next tick after the app starts
      // with the notification data.
        //addListener fica monitorando, de acordo com a função handleNotification
  
  
    const handleNotification = notification => {
        Vibration.vibrate();
        console.log(notification);
        setNotify(notification );
    }
      
  
    // Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/dashboard/notifications
    async function sendPushNotification(){
      const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Original Title',
        body: 'And here is the body!',
        data: { data: 'goes here' },
        _displayInForeground: true, //funciona com o App inativo
      };
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
    };

    return(
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Button title="Notificar usuário" onPress={()=>{sendPushNotification()}} />
        </View>
    )
}
