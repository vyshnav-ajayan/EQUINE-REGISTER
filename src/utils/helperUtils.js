import {Alert, } from 'react-native';

export function EquineAlert(
  Header,
  Message,
  cancelText,
  okText,
  okFunction,
) {
  setTimeout(function() {
    Alert.alert(
      Header,
      Message,
      [
        {
          text: cancelText,
          style: 'cancel',
        },
        {
          text: okText,
          onPress: () => {
            okFunction ? okFunction() : null;
          },
        },
      ],
      {cancelable: true},
    );
  }, 500);
}


