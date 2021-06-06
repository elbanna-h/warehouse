import Amplify from 'aws-amplify'
import {AWSIoTProvider} from '@aws-amplify/pubsub/lib/Providers'

class MQTT {

    constructor(callbackFunc) {
        this.callbackFunc = callbackFunc;
        this.errors = [];
        this.beacons = {};
        this.esps = [];

        Amplify.configure({
            Auth: {
                identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
                region: process.env.REACT_APP_REGION,
                userPoolId: process.env.REACT_APP_USER_POOL_ID,
                userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID
            }
        })

        Amplify.addPluggable(new AWSIoTProvider({
            aws_pubsub_region: process.env.REACT_APP_REGION,
            aws_pubsub_endpoint: `wss://${process.env.REACT_APP_MQTT_ID}.iot.${process.env.REACT_APP_REGION}.amazonaws.com/mqtt`,
        }))


        // This function keep only one record of each beacon
        this.processMessage = function (msg) {

            // console.log(msg);


            if(msg !== null) {
                for(let i=0; i<msg.e.length;i++) {
                    let mac = msg.e[i].m.toLowerCase();
                    let esp = msg.wm.toLowerCase();
                    if(this.esps.includes(esp)) {

                    } else {
                        this.esps.push(esp);
                    }
                    if(this.esps.includes(mac)) {
                        // Dont measure esps rssi
                        // with other esps.
                    } else {
                        if (typeof this.beacons[mac] !== 'object') {
                            // Initialize
                            this.beacons[mac] = {};
                        } else if (typeof this.beacons[mac][esp] === 'object') {
                            // Remove old record
                            delete this.beacons[mac][esp];
                        }
                        // Insert new record
                        this.beacons[mac][esp] = {
                            rssi: parseInt(msg.e[i].r, 10),
                            timestamp: Math.floor(Date.now() / 1000)
                        }
                    }
                    this.callbackFunc(this.beacons);
                }
            }
        };

        Amplify.PubSub.subscribe('outTopic').subscribe({
            next: data => this.processMessage(data.value),
            error: error => console.error(error),
            close: () => console.log('Done'),
        })

    }

}
export default MQTT;
