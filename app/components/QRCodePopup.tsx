import React from 'react';
import {View, Modal, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Icon} from './Icon';
import QRCode from 'react-native-qrcode-svg';

interface Iprops {
  showQrCodeScanner: boolean;
  qrdata: string;
  onHideQrCodeScanner: () => void;
}
const QrCodePopup = (props: Iprops) => {
  return (
    <Modal
      onRequestClose={props.onHideQrCodeScanner}
      // transparent={true}
      visible={props.showQrCodeScanner}>
      <TouchableOpacity
        onPress={props.onHideQrCodeScanner}
        activeOpacity={1}
        style={{
          height: 60,
          justifyContent: 'center',
          backgroundColor: 'black',
          paddingHorizontal: 10,
        }}>
        <Icon icon={'back'} color={'white'} size={26} />
      </TouchableOpacity>
      <View style={styles.mainContainer}>
        <View style={{padding: 10, backgroundColor: 'white'}}>
          <QRCode value={props.qrdata} size={140} />
        </View>
      </View>
    </Modal>
  );
};

export default QrCodePopup;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 1)',
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    // padding: 32,
    color: '#777',
    textAlign: 'center',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});
