import React from "react";
import {Text, TouchableOpacity, View, StyleSheet, Image} from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import LinearGradient from "react-native-linear-gradient";

export default function SocialMediaButton({
    buttonTitle,
    btnType,
    color,
    backgroundColors,
    source,
    marginLeftIcon,
    marginRightText,
    ...rest
}) {
    let marginLeftIconIn = marginLeftIcon ? marginLeftIcon : 0; 
    let marginRightTextIn = marginRightText ? marginRightText : 0;
    return (
        <>
            <LinearGradient colors={backgroundColors} style={styles.linearGradient}
                start={{ y: 0.0, x: 0.0 }} end={{ y: 0.0, x: 1.0 }}> 
                    <TouchableOpacity style={{flexDirection:"row"}} {...rest}>
                        <View style={styles.iconWrapper}>
                            {!source ? (
                              <FontAwesome name={btnType} style={styles.icon} size={25} color={color}/>
                            ) : <Image source={source} style={{resizeMode:"center", width:25, height:25, marginLeft:marginLeftIconIn}} />}
                        </View>
                        <View style={styles.btnTextWrapper}>
                            <Text style={[styles.buttonText, {color: color}]}>{buttonTitle}</Text>
                        </View>
                    </TouchableOpacity>
            </LinearGradient>
        </>
    );
};

const styles = StyleSheet.create({

    buttonContainer: {
        flex:1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 10,
    },

    iconWrapper: {
        width: 30,
        justifyContent: "center",
        alignItems: "center",
    },

    icon: {
        fontWeight: "bold"
    },

    btnTextWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: "Lato-Regular",
        margin: 10,
        backgroundColor: "transparent"
    },

    linearGradient: {
        flex: 1,
        // width: "40%",
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 10,
        margin:10,
        // height: windowHeight / 15,
        // justifyContent:"center",
      },
});