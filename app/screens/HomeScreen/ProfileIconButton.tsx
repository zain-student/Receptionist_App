import React, {useEffect, useState} from 'react';
import {
  Pressable,
  PressableProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import type {SharedValue} from 'react-native-reanimated';
import {isRTL} from '../../i18n';
import {colors, spacing} from '../../theme';
import {Text, Icon} from '../../components';
import {useStores} from 'app/models';
import {widthPercentageToDP} from 'react-native-responsive-screen';

interface ProfileIconButtonProps extends PressableProps {
  open: boolean;
  progress: SharedValue<number>;
}

export function ProfileIconButton(props: ProfileIconButtonProps) {
  const {open, progress, ...PressableProps} = props;
  const {authenticationStore} = useStores();
  const [user, setUser] = useState(authenticationStore.login);

  return (
    <TouchableOpacity
      disabled
      // onPress={}
      style={$profileView}>
      <Text
        preset="formLabel"
        tx={
          'header.nurse' + user.length > 0 && user[0].FullName
            ? user[0].FullName
            : ''
        }
        style={{
          marginHorizontal: 5,
          lineHeight: 18,
          width: widthPercentageToDP(35),
        }}>
        {user.length > 0 && user[0].FullName ? user[0].FullName : ''}
      </Text>
      <Icon
        icon={'profile'}
        // color={focused && colors.tint}
        size={30}
      />
    </TouchableOpacity>
  );
}

const barHeight = 2;

const $container: ViewStyle = {
  alignItems: 'center',
  height: 56,
  justifyContent: 'center',
  width: 56,
};

const $topBar: ViewStyle = {
  height: barHeight,
};

const $middleBar: ViewStyle = {
  height: barHeight,
  marginTop: spacing.xxs,
};

const $bottomBar: ViewStyle = {
  height: barHeight,
};

const $profileView: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  position: 'absolute',
  right: 10,
};
// @demo remove-file
