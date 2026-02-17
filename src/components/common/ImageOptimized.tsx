import { Image, ImageProps } from 'expo-image';
import React from 'react';
import { StyleSheet } from 'react-native';

interface ImageOptimizedProps extends ImageProps {
  /**
   * Optional blurhash string for smooth placeholder transition.
   */
  blurhash?: string;
  /**
   * Priority of the image loading.
   */
  priority?: 'low' | 'normal' | 'high';
}

const DEFAULT_BLURHASH = 'L6PZfSDe00_G00AY_wO#00%C_0t7';

/**
 * LensFolio Optimized Image Component
 * Designed by Ultron for maximum visual performance.
 */
export const ImageOptimized = (props: ImageOptimizedProps) => {
  const {
    source,
    style,
    blurhash = DEFAULT_BLURHASH,
    priority = 'normal',
    ...rest
  } = props;

  return (
    <Image
      style={[styles.image, style]}
      source={source}
      placeholder={{ blurhash }}
      contentFit="cover"
      transition={300}
      cachePolicy="memory-disk"
      priority={priority}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
});
