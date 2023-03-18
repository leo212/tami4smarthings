'use strict';

const {SchemaConnector} = require('st-schema');
const request = require('request-promise-native');

const connector = new SchemaConnector()
    .enableEventLogging(2)
    .discoveryHandler(async (accessToken, response) => {
        console.log('fetching list of tami4 devices');
        const url = 'https://swelcustomers.strauss-water.com/api/v1/device/';
        const headers = {Authorization: `Bearer ${accessToken}`};
        const data = await request({url, headers, json: true});
        for (const entity of data) {
            response.addDevice(entity.id, entity.name, 'c2c-switch')
                .manufacturerName('Strauss Water')
                .modelName(entity.type)
                .hwVersion(entity.deviceFirmware)
                .swVersion('1.0.0')
                .roomName('Kitchen')
                .addGroup('Tami4 Devices')
        }
    })
    .stateRefreshHandler(async (accessToken, response) => {
        console.log('fetching list of tami4 devices');
        const url = 'https://swelcustomers.strauss-water.com/api/v1/device/';
        const headers = {Authorization: `Bearer ${accessToken}`};
        const data = await request({url, headers, json: true});
        for (const entity of data) {
            const device = response.addDevice(entity.id);
            const component = device.addComponent('main');
            component.addState('st.switch', 'switch', 'off');
            component.addState('st.healthCheck', 'healthStatus', entity.connected?'online':'offline');
        }
    })
    .commandHandler(async (accessToken, response, devices) => {
        console.log(`command executed with token:${accessToken}`);
        for (const it of devices) {
            const device = response.addDevice(it.externalDeviceId);
            const component = device.addComponent("main");
            for (const command of it.commands) {
                switch(command.capability) {
                    case 'st.switch':
                        const newState = command.command === 'on' ? 'on' : 'off';
                        component.addState('st.switch', 'switch', newState);
                        if (command.command === 'on') {
                            console.log(`Tami4 switch has been turned on for ${it.externalDeviceId}. Sending an action to Tami4 to boil the water`);
                            const postData = JSON.stringify({});
                            const options = {
                                url: `https://swelcustomers.strauss-water.com/api/v1/device/${it.externalDeviceId}/startBoiling`,
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${accessToken}`
                                },
                                body: postData,
                                json: true
                            };
                            
                            await request(options);
                        }
                        break;
                }
            }
        }
    })
    .callbackAccessHandler(async (accessToken, callbackAuthentication, callbackUrls) => {
        // TODO -- store the tokens and URLs for use in proactive state callbacks
    })
    .integrationDeletedHandler(accessToken => {
        // TODO -- any cleanup necessary when an integration is removed from SmartThings
    });

exports.handler = async (evt, context) => {
    const result = await connector.handleLambdaCallback(evt, context);
    return result;
};