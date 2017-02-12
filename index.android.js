'use strict';

const FBSDK = require('react-native-fbsdk');

import React, {Component} from 'react';
import api from './api';

import {AppRegistry, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
const {LoginButton, ShareDialog, AccessToken, GraphRequest, GraphRequestManager} = FBSDK;

class MasProject2 extends Component {
    constructor(props) {
        super(props);
        const shareLinkContent = {
            contentType: 'link',
            contentUrl: 'https://www.facebook.com/'
        };

        this.state = {
            shareLinkContent: shareLinkContent
        };
    }

    shareLinkWithShareDialog() {
        var tmp = this;
        ShareDialog.canShow(this.state.shareLinkContent).then(function(canShow) {
            if (canShow) {
                return ShareDialog.show(tmp.state.shareLinkContent);
            }
        }).then(function(result) {
            if (result.isCancelled) {
                alert('Share cancelled');
            } else {
                alert('Share success with postId: ' + result.postId);
            }
        }, function(error) {
            alert('Share fail with error: ' + error);
        });
    }

    getUserInfo(token, callback) {
        const responseInfoCallback = (error, result) => {
            if (error) {
                console.log(error);
                alert('Error fetching data: ' + error.toString());
            } else {
                console.log(result);
                alert('Success fetching data: ' + result.toString());
                callback(result);
            }
        }

        const infoRequest = new GraphRequest('/me', {
            accessToken: token,
            parameters: {
                fields: {
                    string: 'first_name,last_name,email'
                }
            }
        }, responseInfoCallback);
        // Start the graph request.
        new GraphRequestManager().addRequest(infoRequest).start()
    }

    _verifyUser(uid, token) {
      if(true){
            this.getUserInfo(token, userinfo => {
              console.log(userinfo);
              this._createUser(token, userinfo);
            });

          }
    }

    _createUser(token, user){
      api._createUser(user.id, user.email, user.first_name, user.last_name, token);
    }

    render() {
        return (
            <View style={styles.container}>
                <LoginButton readPermissions={["public_profile","email"]} onLoginFinished={(error, result) => {
                    if (error) {
                        alert("login has error: " + result.error);
                    } else if (result.isCancelled) {
                        alert("login is cancelled.");
                    } else {
                        AccessToken.getCurrentAccessToken().then((data) => {
                            this._verifyUser(data.userID.toString(), data.accessToken.toString());
                            alert(data.accessToken.toString());
                            console.log(data);
                        })
                    }
                }} onLogoutFinished={() => alert("logout.")}/>
                <TouchableHighlight style={styles.share} onPress={this.shareLinkWithShareDialog.bind(this)}>
                    <Text style={styles.shareText}>Share link with ShareDialog</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    shareText: {
        fontSize: 20,
        margin: 10
    }
});

AppRegistry.registerComponent('MasProject2', () => MasProject2);
