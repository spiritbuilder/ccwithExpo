import React, {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {isEmpty} from 'lodash';
import FastImage from 'react-native-fast-image';
const OptimizedImage = props => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    source = '',
    style,
    defaultImage,
    size = 'large',
    resizeMode = 'cover',
  } = props;
  return (
    <FastImage
      source={isEmpty(source) || error ? defaultImage : {uri: source}}
      {...restProps}
      style={[styles.image, style]}
      onLoadStart={() => setLoading(true)}
      onLoadEnd={() => setLoading(false)}
      {...restProps}
      onError={() => setError(true)}>
      {loading && (
        <View style={[styles.loader, style]}>
          <ActivityIndicator size={size} color="rgba(26, 137, 23, 1)" />
        </View>
      )}
    </FastImage>
  );
};

export default OptimizedImage;
