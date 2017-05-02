const React = require('react');
const ReactNative = require('react-native');
const {
  StyleSheet,
  Text,
  View,
  Animated,
} = ReactNative;

const Button = require('react-native-scrollable-tab-view/Button');

const { BlurView, VibrancyView } = require('react-native-blur');

import Icon from 'react-native-vector-icons/FontAwesome';

const DefaultTabBar = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
    backgroundColor: React.PropTypes.string,
    activeTextColor: React.PropTypes.string,
    inactiveTextColor: React.PropTypes.string,
    textStyle: Text.propTypes.style,
    tabStyle: View.propTypes.style,
    renderTab: React.PropTypes.func,
    underlineStyle: View.propTypes.style,
  },

  getDefaultProps() {
    return {
      activeTextColor: 'navy',
      inactiveTextColor: 'gray',
      backgroundColor: null,
    };
  },

  renderTabOption(name, page) {
  },

  renderTab(name, page, isTabActive, onPressHandler) {
    const { activeTextColor, inactiveTextColor, textStyle, } = this.props;
    const textColor = isTabActive ? activeTextColor : inactiveTextColor;
    const fontWeight = isTabActive ? 'bold' : 'normal';

    return <Button
      style={{flex: 1, }}
      key={name || page}
      accessible={true}
      accessibilityLabel={name}
      accessibilityTraits='button'
      onPress={() => onPressHandler(page)}
    >
      <View style={[styles.tab, this.props.tabStyle, ]}>
        <Text style={[{color: textColor, fontWeight, }, textStyle, ]}>
          <Icon name="circle" size={10} />
        </Text>
      </View>
    </Button>;
  },

  render() {
    const containerWidth = this.props.containerWidth;
    const numberOfTabs = this.props.tabs.length;
    const tabUnderlineStyle = {
      position: 'absolute',
      width: containerWidth / numberOfTabs,
      height: 4,
      backgroundColor: 'navy',
      bottom: 0,
    };

    const tabBoxStyle = {
      position: 'absolute',
      width: 14, //containerWidth / numberOfTabs,
      height: 14,
      backgroundColor: 'navy',
      bottom: (50-14)/2,
      borderRadius: 7,
      marginLeft: ((containerWidth / numberOfTabs)/2 - 7) // use cuz I cant figure out Animated offset :(
    };

    var left = this.props.scrollValue.interpolate({
      inputRange: [0, 1, ], outputRange: [0,  containerWidth / numberOfTabs, ],
    });

    return (
      <View style={[styles.tabs, {backgroundColor: this.props.backgroundColor, }, this.props.style, ]}>
        
          <BlurView blurType="light" blurAmount={4} style={styles.blur}>
          {this.props.tabs.map((name, page) => {
            const isTabActive = this.props.activeTab === page;
            const renderTab = this.props.renderTab || this.renderTab;
            return renderTab(name, page, isTabActive, this.props.goToPage);
          })}
          {/*<Animated.View style={[tabUnderlineStyle, { left, }, this.props.underlineStyle, ]} />*/}
          <Animated.View style={[tabBoxStyle, { left, }, this.props.underlineStyle, ]} />
        </BlurView>
      </View>
    );
  },
});

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingBottom: 10,
  },
  blur: {
    height: 50,
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc',
  },
  tabs: {
    height: 50,
    // flexDirection: 'row',
    // justifyContent: 'space-around',
    // borderWidth: 1,
    // borderTopWidth: 0,
    // borderLeftWidth: 0,
    // borderRightWidth: 0,
    // borderColor: '#ccc',
  },
});

module.exports = DefaultTabBar;