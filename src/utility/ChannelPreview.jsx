import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChannelPreviewMessenger } from 'stream-chat-expo';

const CustomChannelPreview = (props) => {
  return (
    <ChannelPreviewMessenger
      {...props}
      PreviewTitle={CustomPreviewTitle}
      containerStyle={styles.container}
      titleStyle={styles.title}
      messageStyle={styles.message}
    />
  );
};

const CustomPreviewTitle = ({ title }) => {
  return <Text style={styles.title}>{title}</Text>;
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 100,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 20,
  },
});

export default CustomChannelPreview;
