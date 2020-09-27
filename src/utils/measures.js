
import { Dimensions, Platform } from 'react-native';
const { width, height } = Dimensions.get('window');

const measures = {
    ScreenWidth: width < height ? width : height,
    ScreenHeight: width < height ? height : width,
};

export default measures;
